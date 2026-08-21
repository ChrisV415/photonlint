import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import os from "os";
import { getAuth } from "@clerk/express";
import { db, drcRunsTable } from "@workspace/db";
import { and, desc, sql, count, eq } from "drizzle-orm";
import { FOUNDRIES, getEffectiveRules } from "./foundries.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAuthOrApiKey, getEffectiveUserId } from "../middlewares/apiKeyAuth.js";

const router: IRouter = Router();

// UUID v4 format check — prevents arbitrary strings from hitting the DB
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// DRC engine timeout (ms) — kill Python if it exceeds this.
// Malformed GDS files can hang gdspy/shapely indefinitely without a hard ceiling.
const DRC_TIMEOUT_MS = 120_000; // 2 minutes — generous for full-chip layouts

// PDF report generation timeout (ms) — kill the Python process if it exceeds this
const REPORT_TIMEOUT_MS = 30_000;

// Rate limiter for POST /drc/check — caps expensive DRC runs to prevent
// a single client from saturating the server with back-to-back uploads.
// 10 checks per IP per minute is generous for legitimate use; bots hit it immediately.
const drcCheckLimiter = rateLimit({
  windowMs: 60 * 1_000, // 1 minute
  max: 10,              // 10 DRC submissions per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    req.log.warn({ ip: req.ip }, "DRC rate limit exceeded");
    res.status(429).json({
      error: "Too many DRC checks. Please wait a moment before submitting another file.",
    });
  },
});

// Multer: store uploads in OS temp dir, accept only .gds/.gdsii files
export const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".gds" || ext === ".gdsii") {
      cb(null, true);
    } else {
      cb(new Error("Only .gds / .gdsii files are accepted"));
    }
  },
});

// Paths to Python scripts — resolved relative to this bundle file so they work
// regardless of which directory the Node process is started from.
const __rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRC_SCRIPT    = path.resolve(__rootDir, "src", "lib", "drc_engine.py");
const REPORT_SCRIPT = path.resolve(__rootDir, "src", "lib", "report.py");

interface DrcEngineResult {
  status: "pass" | "fail" | "error";
  errorMessage: string | null;
  violations: Array<{
    rule: string;
    requirement: string;
    location: string;
    severity: "critical" | "warning" | "info";
    details: string;
    geometry: number[][] | null;
  }>;
  passedChecks: number;
  totalChecks: number;
  layoutData: {
    bounds: { minX: number; minY: number; maxX: number; maxY: number };
    polygons: Array<{ layer: number; datatype: number; vertices: number[][] }>;
  } | null;
}

// Output caps — a runaway or malicious engine must not fill Node's heap.
// Normal DRC output is < 50 KB; 1 MB is a generous ceiling before we kill.
const MAX_DRC_STDOUT_BYTES = 1 * 1024 * 1024; // 1 MB
const MAX_STDERR_BYTES     = 64 * 1024;        // 64 KB (for server-side logging only)

/** Kill the entire process group started by a detached child. */
function killGroup(pid: number | undefined): void {
  if (pid == null) return;
  try { process.kill(-pid, "SIGKILL"); } catch { /* already dead — ignore */ }
}

function runPythonDrc(gdsPath: string, rulesJson: string): Promise<DrcEngineResult> {
  return new Promise((resolve, reject) => {
    // detached:true creates a new process group so killGroup(-pid) terminates
    // Python AND any grandchildren (gdspy workers, shapely threads) in one call.
    const py = spawn(
      "python3",
      [DRC_SCRIPT, "--gds-path", gdsPath, "--rules-json", rulesJson],
      { detached: true },
    );

    let stdoutBuf = "";
    let stdoutBytes = 0;
    let stderrBuf = "";
    let stderrBytes = 0;
    let settled = false;

    const settle = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn();
    };

    // Kill entire process group if the engine exceeds the time budget.
    // Malformed GDS files can hang gdspy/shapely indefinitely.
    const timer = setTimeout(() => {
      killGroup(py.pid);
      settle(() => reject(new Error(`DRC engine timed out after ${DRC_TIMEOUT_MS / 1000}s`)));
    }, DRC_TIMEOUT_MS);

    py.stdout.on("data", (d: Buffer) => {
      stdoutBytes += d.length;
      if (stdoutBytes > MAX_DRC_STDOUT_BYTES) {
        killGroup(py.pid);
        settle(() => reject(new Error("DRC engine output exceeded size limit")));
        return;
      }
      stdoutBuf += d.toString();
    });
    // Attach an error handler so an unexpected stream close does not crash Node.
    py.stdout.on("error", (err) => {
      settle(() => reject(new Error(`DRC engine stdout error: ${err.message}`)));
    });

    py.stderr.on("data", (d: Buffer) => {
      stderrBytes += d.length;
      if (stderrBytes <= MAX_STDERR_BYTES) stderrBuf += d.toString();
    });
    py.stderr.on("error", () => { /* non-fatal — stderr stream errors are ignored */ });

    py.on("close", (code) => {
      settle(() => {
        const trimmed = stdoutBuf.trim();
        if (!trimmed) {
          // Log stderr server-side for diagnosis — do NOT surface it to callers.
          // stderr can contain filesystem paths and Python internals.
          reject(new Error(
            `DRC engine exited with code ${code} with no output` +
            (stderrBuf ? ` (stderr: ${stderrBuf.slice(0, 300)})` : "")
          ));
          return;
        }
        try {
          resolve(JSON.parse(trimmed) as DrcEngineResult);
        } catch {
          reject(new Error("DRC engine returned non-JSON output"));
        }
      });
    });

    py.on("error", (err) => {
      settle(() => reject(new Error(`Failed to start DRC engine: ${err.message}`)));
    });
  });
}

// ── KLayout .lyrdb helpers ────────────────────────────────────────────────────

/** Escape the five XML metacharacters so arbitrary strings are safe in element text. */
function xmlEsc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface LyrdbViolation {
  rule: string;
  requirement: string;
  location: string;
  severity: string;
  details: string;
  geometry: number[][] | null;
}

/**
 * Generate a KLayout marker-database XML string (.lyrdb) from a list of
 * DRC violations.
 *
 * Follows the KLayout RDB serialisation format:
 * - Geometry is a text value: `polygon: (x1.xxx,y1.xxx;x2.xxx,y2.xxx;...)`
 * - Coordinates are in layout units (µm) — NOT scaled; the DRC engine already
 *   emits µm and KLayout reads RDB polygons in the same units as the layout.
 * - Item human labels go in `<comment>`, not `<description>`.
 * - `<top-cell>` at report level + matching `<cell>` per item.
 */
function buildLyrdb(opts: {
  filename: string;
  foundryName: string;
  checkedAt: string;
  topCell: string;
  violations: LyrdbViolation[];
}): string {
  const { filename, foundryName, checkedAt, topCell, violations } = opts;

  // Unique rule categories — preserve first-seen insertion order.
  const seen = new Set<string>();
  const categories: Array<{ name: string; description: string }> = [];
  for (const v of violations) {
    if (!seen.has(v.rule)) {
      seen.add(v.rule);
      categories.push({ name: v.rule, description: v.requirement });
    }
  }

  const categoriesXml = categories
    .map(
      (c) =>
        `    <category>\n      <name>${xmlEsc(c.name)}</name>\n` +
        `      <description>${xmlEsc(c.description)}</description>\n    </category>`,
    )
    .join("\n");

  const itemsXml = violations
    .map((v) => {
      // Human-readable label shown in KLayout's Marker Browser panel.
      const comment = `[${v.severity.toUpperCase()}] ${v.rule}: ${v.details}`;

      // KLayout RDB polygon format:  polygon: (x1.ddd,y1.ddd;x2.ddd,y2.ddd;...)
      // Coordinates must be in layout units (µm). Three decimal places gives
      // 1 nm resolution which is finer than any silicon-photonics grid in use.
      let valuesBlock = "";
      if (Array.isArray(v.geometry) && v.geometry.length >= 3) {
        const pts = v.geometry
          .map((pt: number[]) => {
            const x = typeof pt[0] === "number" ? pt[0].toFixed(3) : "0.000";
            const y = typeof pt[1] === "number" ? pt[1].toFixed(3) : "0.000";
            return `${x},${y}`;
          })
          .join(";");
        valuesBlock =
          "\n        <values>\n" +
          `          <value>polygon: (${pts})</value>\n` +
          "        </values>";
      }

      return (
        `    <item>\n      <category>${xmlEsc(v.rule)}</category>\n` +
        `      <cell>${xmlEsc(topCell)}</cell>\n      <visited>false</visited>\n` +
        `      <multiplicity>1</multiplicity>\n` +
        `      <comment>${xmlEsc(comment)}</comment>${valuesBlock}\n    </item>`
      );
    })
    .join("\n");

  const cellsXml =
    `  <cells>\n    <cell>\n      <name>${xmlEsc(topCell)}</name>\n` +
    `      <qname>${xmlEsc(topCell)}</qname>\n      <references/>\n    </cell>\n  </cells>`;

  return (
    `<?xml version="1.0" encoding="utf-8"?>\n` +
    `<report-database>\n` +
    `  <description>${xmlEsc(`PhotonLint DRC — ${filename} — ${foundryName} — ${checkedAt}`)}</description>\n` +
    `  <generator>PhotonLint</generator>\n` +
    `  <top-cell>${xmlEsc(topCell)}</top-cell>\n` +
    `  <categories>\n${categoriesXml}\n  </categories>\n` +
    `${cellsXml}\n` +
    `  <items>\n${itemsXml}\n  </items>\n` +
    `</report-database>\n`
  );
}

// ── POST /drc/check — upload GDS + foundryId, run DRC ────────────────────────
router.post(
// POST /drc/check accepts both Clerk sessions (browser) and Bearer API keys (CI pipelines).
  "/drc/check",
  drcCheckLimiter,      // 1. rate-limit before anything — no work on 429
  requireAuthOrApiKey,  // 2. auth check — accepts Clerk session OR Bearer API key
  upload.single("file"), // 3. multipart parse
  async (req, res, next): Promise<void> => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No GDS file uploaded. Send multipart/form-data with a 'file' field." });
      return;
    }

    // Always clean up the temp file — regardless of what happens below
    const cleanup = () =>
      fs.unlink(file.path).catch((err: unknown) => {
        req.log.warn({ err, path: file.path }, "Failed to delete temp GDS file — possible disk leak");
      });

    const foundryId = req.body?.foundryId;
    if (!foundryId || typeof foundryId !== "string" || foundryId.length > 100) {
      await cleanup();
      res.status(400).json({ error: "Missing or invalid foundryId field." });
      return;
    }

    const foundry = FOUNDRIES.find((f) => f.id === foundryId);
    if (!foundry) {
      await cleanup();
      res.status(400).json({
        error: `Unknown foundry: "${foundryId}". Call GET /api/foundries for valid IDs.`,
      });
      return;
    }

    // Validate originalname length before spawning DRC — avoids wasting CPU on
    // a request that would be rejected anyway. Multer doesn't cap filename length.
    if (file.originalname.length > 255) {
      await cleanup();
      res.status(400).json({ error: "Filename too long (max 255 characters)." });
      return;
    }

    const startMs = Date.now();
    let drcResult: DrcEngineResult;

    // Build the layer-aware rules payload — use engineer-supplied override if present
    let effectiveRules;
    try {
      effectiveRules = await getEffectiveRules(foundry.id);
    } catch (err) {
      await cleanup();
      next(err);
      return;
    }

    const rulesPayload = {
      gridSize: effectiveRules.gridSize,
      layers: effectiveRules.layers,
    };

    try {
      drcResult = await runPythonDrc(file.path, JSON.stringify(rulesPayload));
    } catch (err) {
      // Log the full error server-side (includes Python stderr / paths) but
      // return a generic message — internal details must not leak to clients.
      req.log.error({ err }, "DRC engine error");
      res.status(500).json({ error: "DRC engine failed. Please try again — if the issue persists the file may be malformed or unsupported." });
      return;
    } finally {
      await cleanup();
    }

    const processingTimeMs = Date.now() - startMs;
    const userId = getEffectiveUserId(req);

    let saved;
    try {
      [saved] = await db
        .insert(drcRunsTable)
        .values({
          userId: userId!,
          foundryId: foundry.id,
          foundryName: foundry.name,
          filename: file.originalname,
          status: drcResult.status,
          violationCount: drcResult.violations.length,
          passedChecks: drcResult.passedChecks,
          totalChecks: drcResult.totalChecks,
          violations: drcResult.violations,
          layoutData: drcResult.layoutData ?? null,
          errorMessage: drcResult.errorMessage ?? null,
          processingTimeMs,
        })
        .returning();
    } catch (err) {
      req.log.error({ err }, "Failed to persist DRC result to database");
      next(err);
      return;
    }

    res.json({
      id: saved.id,
      foundryId: saved.foundryId,
      foundryName: saved.foundryName,
      filename: saved.filename,
      status: saved.status,
      violationCount: saved.violationCount,
      passedChecks: saved.passedChecks,
      totalChecks: saved.totalChecks,
      violations: saved.violations ?? [],
      layoutData: saved.layoutData ?? null,
      errorMessage: saved.errorMessage,
      checkedAt: saved.checkedAt,
      processingTimeMs: saved.processingTimeMs,
    });
  }
);

// ── POST /drc/runs/import — accept pre-computed results from the local CLI ────
// Authenticated via Bearer API key (or Clerk session). The raw GDS file is
// NOT accepted here — the CLI runs the DRC engine locally and POSTs only the
// structured result JSON. This is the privacy-preserving path for IP-sensitive
// layouts that must never leave the customer's environment.
const importRunLimiter = rateLimit({
  windowMs: 60 * 1_000,
  max: 30, // local runners can be faster than browser uploads
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ error: "Too many import requests. Please wait before retrying." });
  },
});

router.post(
  "/drc/runs/import",
  importRunLimiter,
  requireAuthOrApiKey,
  async (req, res, next): Promise<void> => {
    const body = req.body as Record<string, unknown>;

    // ── Validate required fields ──────────────────────────────────────────────
    const foundryId = body?.foundryId;
    if (!foundryId || typeof foundryId !== "string" || foundryId.length > 100) {
      res.status(400).json({ error: "Missing or invalid foundryId field." });
      return;
    }

    const foundry = FOUNDRIES.find((f) => f.id === foundryId);
    if (!foundry) {
      res.status(400).json({
        error: `Unknown foundry: "${foundryId}". Call GET /api/foundries for valid IDs.`,
      });
      return;
    }

    const filename = body?.filename;
    if (!filename || typeof filename !== "string" || filename.length > 255) {
      res.status(400).json({ error: "Missing or invalid filename field." });
      return;
    }

    const status = body?.status;
    if (status !== "pass" && status !== "fail" && status !== "error") {
      res.status(400).json({ error: "status must be 'pass', 'fail', or 'error'." });
      return;
    }

    const violations = body?.violations;
    if (!Array.isArray(violations)) {
      res.status(400).json({ error: "violations must be an array." });
      return;
    }

    const passedChecks = Number(body?.passedChecks ?? 0);
    const totalChecks  = Number(body?.totalChecks ?? 4);
    const processingTimeMs = Number(body?.processingTimeMs ?? 0);

    if (!Number.isFinite(passedChecks) || !Number.isFinite(totalChecks) || !Number.isFinite(processingTimeMs)) {
      res.status(400).json({ error: "passedChecks, totalChecks, and processingTimeMs must be numbers." });
      return;
    }

    // layoutData is optional — the CLI may omit it to keep the payload small
    // (polygon vertices are derived from GDS but some customers still prefer not to upload them).
    const layoutData = (body?.layoutData != null && typeof body.layoutData === "object")
      ? body.layoutData as object
      : null;

    const errorMessage = (typeof body?.errorMessage === "string") ? body.errorMessage : null;

    const userId = getEffectiveUserId(req);

    let saved;
    try {
      [saved] = await db
        .insert(drcRunsTable)
        .values({
          userId: userId!,
          foundryId: foundry.id,
          foundryName: foundry.name,
          filename,
          status,
          violationCount: violations.length,
          passedChecks,
          totalChecks,
          violations,
          layoutData,
          errorMessage,
          processingTimeMs,
        })
        .returning();
    } catch (err) {
      req.log.error({ err }, "Failed to persist imported DRC result to database");
      next(err);
      return;
    }

    res.status(201).json({
      id: saved.id,
      foundryId: saved.foundryId,
      foundryName: saved.foundryName,
      filename: saved.filename,
      status: saved.status,
      violationCount: saved.violationCount,
      passedChecks: saved.passedChecks,
      totalChecks: saved.totalChecks,
      violations: saved.violations ?? [],
      layoutData: saved.layoutData ?? null,
      errorMessage: saved.errorMessage,
      checkedAt: saved.checkedAt,
      processingTimeMs: saved.processingTimeMs,
    });
  }
);

// ── GET /drc/runs — list recent runs ─────────────────────────────────────────
router.get("/drc/runs", requireAuth, async (req, res, next): Promise<void> => {
  const { userId } = getAuth(req);
  const rawLimit = Number(req.query.limit ?? 20);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 20;

  let runs;
  try {
    runs = await db
      .select({
        id: drcRunsTable.id,
        foundryId: drcRunsTable.foundryId,
        foundryName: drcRunsTable.foundryName,
        filename: drcRunsTable.filename,
        status: drcRunsTable.status,
        violationCount: drcRunsTable.violationCount,
        checkedAt: drcRunsTable.checkedAt,
        processingTimeMs: drcRunsTable.processingTimeMs,
      })
      .from(drcRunsTable)
      .where(eq(drcRunsTable.userId, userId!))
      .orderBy(desc(drcRunsTable.checkedAt))
      .limit(limit);
  } catch (err) {
    next(err);
    return;
  }

  res.json(runs);
});

// ── GET /drc/stats — aggregate statistics ────────────────────────────────────
router.get("/drc/stats", requireAuth, async (req, res, next): Promise<void> => {
  const { userId } = getAuth(req);
  let summary, allRuns;
  try {
    [summary] = await db
      .select({
        totalRuns: count(),
        passCount:       sql<number>`count(*) filter (where status = 'pass')`.mapWith(Number),
        failCount:       sql<number>`count(*) filter (where status = 'fail')`.mapWith(Number),
        errorCount:      sql<number>`count(*) filter (where status = 'error')`.mapWith(Number),
        totalViolations: sql<number>`coalesce(sum(violation_count), 0)`.mapWith(Number),
      })
      .from(drcRunsTable)
      .where(eq(drcRunsTable.userId, userId!));

    allRuns = await db
      .select({ violations: drcRunsTable.violations })
      .from(drcRunsTable)
      .where(eq(drcRunsTable.userId, userId!))
      .orderBy(desc(drcRunsTable.checkedAt))
      .limit(200);
  } catch (err) {
    next(err);
    return;
  }

  const totalRuns       = Number(summary?.totalRuns ?? 0);
  const passCount       = Number(summary?.passCount ?? 0);
  const failCount       = Number(summary?.failCount ?? 0);
  const errorCount      = Number(summary?.errorCount ?? 0);
  const totalViolations = Number(summary?.totalViolations ?? 0);
  const passRate        = totalRuns > 0 ? Math.round((passCount / totalRuns) * 1000) / 10 : 0;
  const avgViolationsPerRun = totalRuns > 0 ? Math.round((totalViolations / totalRuns) * 10) / 10 : 0;

  const ruleCounts: Record<string, number> = {};
  let totalViolationItems = 0;

  // Note: commonViolations is derived from the most-recent 200 runs while the
  // aggregate totals (totalRuns, passCount, etc.) cover all runs. The 200-run
  // sample is intentional to keep this query fast; the percentage shown is
  // "proportion of violations in recent history", not "proportion of all runs".
  for (const run of allRuns) {
    const violations = (run.violations ?? []) as Array<unknown>;
    for (const v of violations) {
      if (v && typeof v === "object" && typeof (v as Record<string, unknown>)["rule"] === "string") {
        const rule = (v as Record<string, unknown>)["rule"] as string;
        ruleCounts[rule] = (ruleCounts[rule] ?? 0) + 1;
        totalViolationItems++;
      }
    }
  }

  const commonViolations = Object.entries(ruleCounts)
    .map(([rule, c]) => ({
      rule,
      count: c,
      percentage: totalViolationItems > 0
        ? Math.round((c / totalViolationItems) * 1000) / 10
        : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  res.json({
    totalRuns,
    passCount,
    failCount,
    errorCount,
    passRate,
    totalViolations,
    avgViolationsPerRun,
    commonViolations,
  });
});

// ── GET /drc/runs/:id — get single run ───────────────────────────────────────
router.get("/drc/runs/:id", requireAuth, async (req, res, next): Promise<void> => {
  const id = String(req.params.id);
  const { userId } = getAuth(req);

  if (!UUID_RE.test(id)) {
    res.status(400).json({ error: "Invalid run ID format." });
    return;
  }

  let run;
  try {
    [run] = await db
      .select()
      .from(drcRunsTable)
      .where(and(eq(drcRunsTable.id, id), eq(drcRunsTable.userId, userId!)))
      .limit(1);
  } catch (err) {
    next(err);
    return;
  }

  if (!run) {
    res.status(404).json({ error: "DRC run not found." });
    return;
  }

  res.json({
    id: run.id,
    foundryId: run.foundryId,
    foundryName: run.foundryName,
    filename: run.filename,
    status: run.status,
    violationCount: run.violationCount,
    passedChecks: run.passedChecks,
    totalChecks: run.totalChecks,
    violations: run.violations ?? [],
    layoutData: run.layoutData ?? null,
    errorMessage: run.errorMessage,
    checkedAt: run.checkedAt,
    processingTimeMs: run.processingTimeMs,
  });
});

// ── GET /drc/runs/:id/report.pdf — generate and stream PDF report ─────────────
router.get("/drc/runs/:id/report.pdf", requireAuth, async (req, res, next): Promise<void> => {
  const id = String(req.params.id);
  const { userId } = getAuth(req);

  if (!UUID_RE.test(id)) {
    res.status(400).json({ error: "Invalid run ID format." });
    return;
  }

  let run;
  try {
    [run] = await db
      .select()
      .from(drcRunsTable)
      .where(and(eq(drcRunsTable.id, id), eq(drcRunsTable.userId, userId!)))
      .limit(1);
  } catch (err) {
    next(err);
    return;
  }

  if (!run) {
    res.status(404).json({ error: "DRC run not found." });
    return;
  }

  const runPayload = JSON.stringify({
    id: run.id,
    foundryId: run.foundryId,
    foundryName: run.foundryName,
    filename: run.filename,
    status: run.status,
    violationCount: run.violationCount,
    passedChecks: run.passedChecks,
    totalChecks: run.totalChecks,
    violations: run.violations,
    errorMessage: run.errorMessage,
    checkedAt: run.checkedAt,
    processingTimeMs: run.processingTimeMs,
  });

  // detached:true + killGroup ensures the whole Python process group is reaped on timeout.
  const py = spawn("python3", [REPORT_SCRIPT], { detached: true });

  const chunks: Buffer[] = [];
  let pdfBytes = 0;
  const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB — normal reports are < 1 MB
  let stderr = "";
  let stderrBytes = 0;
  const MAX_PDF_STDERR = 64 * 1024;
  let responded = false;

  const sendError = (msg: string) => {
    if (!responded && !res.headersSent) {
      responded = true;
      res.status(500).json({ error: msg });
    }
  };

  // Kill the entire process group and respond with a generic error on timeout.
  const timeout = setTimeout(() => {
    try { process.kill(-py.pid!, "SIGKILL"); } catch { /* already dead */ }
    req.log.error({ id }, "PDF report generation timed out");
    sendError("PDF generation timed out. Please try again.");
  }, REPORT_TIMEOUT_MS);

  py.stdout.on("data", (d: Buffer) => {
    pdfBytes += d.length;
    if (pdfBytes > MAX_PDF_BYTES) {
      try { process.kill(-py.pid!, "SIGKILL"); } catch { /* already dead */ }
      clearTimeout(timeout);
      req.log.error({ id, pdfBytes }, "PDF output exceeded size limit");
      sendError("PDF output exceeded size limit.");
      return;
    }
    chunks.push(d);
  });
  py.stdout.on("error", (err) => {
    clearTimeout(timeout);
    req.log.error({ err }, "PDF stdout stream error");
    sendError("Failed to read PDF output. Please try again.");
  });

  py.stderr.on("data", (d: Buffer) => {
    stderrBytes += d.length;
    if (stderrBytes <= MAX_PDF_STDERR) stderr += d.toString();
  });
  py.stderr.on("error", () => { /* non-fatal */ });

  py.on("error", (err) => {
    clearTimeout(timeout);
    req.log.error({ err }, "Failed to start PDF report process");
    // Do not send err.message to client — it may contain filesystem paths.
    sendError("Failed to start report generator. Please try again.");
  });

  py.on("close", (code) => {
    clearTimeout(timeout);
    if (responded) return;
    if (code !== 0 || chunks.length === 0) {
      req.log.error({ code, stderr: stderr.slice(0, 500) }, "PDF report generation failed");
      // Return a generic message — stderr can contain Python internals / paths.
      sendError("PDF generation failed. Please try again.");
      return;
    }
    responded = true;
    const pdf = Buffer.concat(chunks);
    const safeFilename = run.filename
      .replace(/[^a-z0-9_.-]/gi, "_")
      .replace(/\.gds(ii)?$/i, "");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="photonlint_${safeFilename}.pdf"`,
    );
    res.setHeader("Content-Length", pdf.length);
    res.send(pdf);
  });

  // Write stdin after attaching listeners so we don't miss the 'error' event
  py.stdin.on("error", (err) => {
    clearTimeout(timeout);
    req.log.error({ err }, "PDF stdin write error");
    sendError(`Failed to write to report generator: ${err.message}`);
  });
  py.stdin.write(runPayload);
  py.stdin.end();
});

// ── GET /drc/runs/:id/report.lyrdb — KLayout marker database ─────────────────
// Generates a KLayout-native .lyrdb marker file in-memory (no subprocess).
// Designers open this file in KLayout via Tools → Marker Browser → Load and
// every violation is a clickable, highlighted region on the layout canvas.
router.get("/drc/runs/:id/report.lyrdb", requireAuth, async (req, res, next): Promise<void> => {
  const id = String(req.params.id);
  const { userId } = getAuth(req);

  if (!UUID_RE.test(id)) {
    res.status(400).json({ error: "Invalid run ID format." });
    return;
  }

  let run;
  try {
    [run] = await db
      .select()
      .from(drcRunsTable)
      .where(and(eq(drcRunsTable.id, id), eq(drcRunsTable.userId, userId!)))
      .limit(1);
  } catch (err) {
    next(err);
    return;
  }

  if (!run) {
    res.status(404).json({ error: "DRC run not found." });
    return;
  }

  // Cast stored JSON — items are validated on write; guard null/malformed entries defensively.
  const rawViolations = Array.isArray(run.violations) ? run.violations : [];
  const violations: LyrdbViolation[] = rawViolations.flatMap((v) => {
    if (!v || typeof v !== "object") return [];
    const o = v as Record<string, unknown>;
    const rule        = typeof o["rule"]        === "string" ? o["rule"]        : "UNKNOWN";
    const requirement = typeof o["requirement"] === "string" ? o["requirement"] : "";
    const location    = typeof o["location"]    === "string" ? o["location"]    : "";
    const severity    = typeof o["severity"]    === "string" ? o["severity"]    : "warning";
    const details     = typeof o["details"]     === "string" ? o["details"]     : "";
    const geometry    = Array.isArray(o["geometry"]) ? (o["geometry"] as number[][]) : null;
    return [{ rule, requirement, location, severity, details, geometry }];
  });

  const checkedAt =
    run.checkedAt instanceof Date
      ? run.checkedAt.toISOString()
      : String(run.checkedAt);

  // Extract the GDS top-cell name persisted by the DRC engine. Older runs
  // pre-dating this field fall back to the conventional "TOP" name. KLayout
  // uses the cell name to navigate the marker browser to the right cell.
  const storedLayout =
    run.layoutData && typeof run.layoutData === "object"
      ? (run.layoutData as Record<string, unknown>)
      : {};
  const topCell =
    typeof storedLayout["topCell"] === "string" && storedLayout["topCell"].length > 0
      ? storedLayout["topCell"]
      : "TOP";

  const xml = buildLyrdb({
    filename:    run.filename,
    foundryName: run.foundryName,
    checkedAt,
    topCell,
    violations,
  });

  const safeFilename = run.filename
    .replace(/[^a-z0-9_.-]/gi, "_")
    .replace(/\.gds(ii)?$/i, "");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="photonlint_${safeFilename}.lyrdb"`,
  );
  res.setHeader("Content-Length", Buffer.byteLength(xml, "utf-8"));
  res.send(xml);
});

export default router;
