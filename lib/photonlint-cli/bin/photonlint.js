#!/usr/bin/env node
/**
 * photonlint CLI
 *
 * Runs the DRC engine locally (python3 drc_engine.py) so the raw GDS file
 * never leaves the customer's environment. Only the structured violation
 * report is uploaded to the PhotonLint API.
 *
 * Usage:
 *   photonlint --gds-path ./layout.gds --foundry gf-45spclo --api-key plk_…
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// ── Argument parsing ──────────────────────────────────────────────────────────

const KNOWN_FLAGS = new Set([
  "--help", "-h", "--json", "--no-color", "--include-layout", "--list-foundries",
  "--gds-path", "--foundry", "--api-key", "--api-url",
]);
const VALUE_FLAGS = new Set(["--gds-path", "--foundry", "--api-key", "--api-url"]);

function parseArgs() {
  const args = process.argv.slice(2);
  const o = {};
  const unknown = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--help" || a === "-h") { o.help = true; }
    else if (a === "--json")           { o.json = true; }
    else if (a === "--no-color")       { o.noColor = true; }
    else if (a === "--include-layout") { o.includeLayout = true; }
    else if (a === "--list-foundries") { o.listFoundries = true; }
    else if (a === "--gds-path")    { o.gdsPath = args[++i]; }
    else if (a === "--foundry")     { o.foundry = args[++i]; }
    else if (a === "--api-key")     { o.apiKey = args[++i]; }
    else if (a === "--api-url")     { o.apiUrl = args[++i]; }
    else if (a.startsWith("-"))     { unknown.push(a); if (VALUE_FLAGS.has(a)) i++; }
  }
  if (unknown.length > 0) {
    process.stderr.write(`[photonlint] warning: unknown flag(s): ${unknown.join(", ")} — run --help for usage.\n`);
  }
  return o;
}

const opts = parseArgs();

// ── Helpers ───────────────────────────────────────────────────────────────────

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ENGINE_PY = path.resolve(__dir, "..", "engine", "drc_engine.py");

function die(msg, code = 3) {
  process.stderr.write(`\n[photonlint] error: ${msg}\n`);
  process.exit(code);
}

function info(msg) {
  if (!opts.json) process.stderr.write(`[photonlint] ${msg}\n`);
}

/** Colour helpers — falls back gracefully if the terminal doesn't support ANSI. */
const NO_COLOR = process.env["NO_COLOR"] || opts.noColor;
const c = {
  red:    (s) => NO_COLOR ? s : `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => NO_COLOR ? s : `\x1b[33m${s}\x1b[0m`,
  green:  (s) => NO_COLOR ? s : `\x1b[32m${s}\x1b[0m`,
  bold:   (s) => NO_COLOR ? s : `\x1b[1m${s}\x1b[0m`,
  dim:    (s) => NO_COLOR ? s : `\x1b[2m${s}\x1b[0m`,
};

// ── Help ──────────────────────────────────────────────────────────────────────

if (opts.help) {
  process.stdout.write(`
photonlint — run PhotonLint DRC checks locally

Usage:
  photonlint --gds-path <file> --foundry <id> [options]

Options:
  --gds-path <path>    Path to the GDS or GDSII file to check   [required]
  --foundry  <id>      Foundry ID (use --list-foundries to see all)  [required]
  --api-key  <key>     PhotonLint API key (plk_…)  [or PHOTONLINT_API_KEY env]
  --api-url  <url>     API base URL  [default: https://photonlint.com/api]
  --include-layout     Upload polygon layout data (off by default)
  --list-foundries     Print available foundry IDs and exit
  --json               Print machine-readable JSON to stdout
  --no-color           Disable colour output
  --help               Show this message

Exit codes:
  0  DRC passed
  1  DRC failed (critical violations found)
  2  DRC engine error
  3  API / configuration error

Examples:
  photonlint --gds-path ./ring.gds --foundry gf-45spclo --api-key plk_…
  photonlint --gds-path ./mzi.gds  --foundry aim-photonics --json
  PHOTONLINT_API_KEY=plk_… photonlint --gds-path ./layout.gds --foundry tower-semi
`);
  process.exit(0);
}

// ── Configuration ─────────────────────────────────────────────────────────────

const API_URL = (opts.apiUrl || process.env["PHOTONLINT_API_URL"] || "https://photonlint.com/api").replace(/\/$/, "");
const API_KEY = opts.apiKey || process.env["PHOTONLINT_API_KEY"] || "";

// ── Fetch helpers ─────────────────────────────────────────────────────────────

// Warn if --api-url points somewhere unexpected — a typo here would send the
// API key to an unintended server.
const TRUSTED_URL_RE = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|photonlint\.com)(:\d+)?(\/|$)/i;
if (opts.apiUrl && !TRUSTED_URL_RE.test(API_URL)) {
  process.stderr.write(
    `[photonlint] warning: --api-url "${API_URL}" does not look like a PhotonLint server.\n` +
    `             Your API key will be sent to this host. Press Ctrl-C to abort.\n`
  );
}

const FETCH_TIMEOUT_MS = 30_000; // 30 s — enough for a cold-start API response

async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(API_KEY ? { "Authorization": `Bearer ${API_KEY}` } : {}),
    ...options.headers,
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, { ...options, headers, signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      die(`Request to API timed out after ${FETCH_TIMEOUT_MS / 1000}s. Check your network and --api-url.`, 3);
    }
    die(`Network error contacting API: ${err.message}`, 3);
  } finally {
    clearTimeout(timer);
  }
  return res;
}

// ── List foundries ────────────────────────────────────────────────────────────

if (opts.listFoundries) {
  const res = await apiFetch("/foundries");
  if (!res.ok) die(`Failed to fetch foundries: HTTP ${res.status}`, 3);
  const data = await res.json();
  const foundries = Array.isArray(data) ? data : data.foundries ?? [];
  if (opts.json) {
    process.stdout.write(JSON.stringify(foundries, null, 2) + "\n");
  } else {
    process.stdout.write("\nAvailable foundries:\n\n");
    for (const f of foundries) {
      process.stdout.write(`  ${c.bold(f.id.padEnd(22))}  ${f.name}\n`);
    }
    process.stdout.write("\n");
  }
  process.exit(0);
}

// ── Validate required args ────────────────────────────────────────────────────

if (!opts.gdsPath) die("--gds-path is required. Run --help for usage.", 3);
if (!opts.foundry) die("--foundry is required. Run --help for usage.", 3);
if (!API_KEY)      die("API key required: pass --api-key or set PHOTONLINT_API_KEY.", 3);

const gdsPath = path.resolve(opts.gdsPath);
if (!fs.existsSync(gdsPath)) die(`GDS file not found: ${path.basename(gdsPath)}`, 3);

const ext = path.extname(gdsPath).toLowerCase();
if (ext !== ".gds" && ext !== ".gdsii") {
  die(`File must have .gds or .gdsii extension, got: ${ext}`, 3);
}

// Verify engine is present (should always be true for a correctly installed package)
if (!fs.existsSync(ENGINE_PY)) {
  die(`DRC engine not found at ${ENGINE_PY}. Reinstall the package.`, 2);
}

// ── Fetch foundry rules ───────────────────────────────────────────────────────

info(`Fetching rules for foundry "${opts.foundry}"…`);

const foundriesRes = await apiFetch("/foundries");
if (!foundriesRes.ok) {
  die(`Failed to fetch foundry list (HTTP ${foundriesRes.status}). Check your API key and --api-url.`, 3);
}

const foundriesData = await foundriesRes.json();
const foundries = Array.isArray(foundriesData) ? foundriesData : [];
const foundry = foundries.find((f) => f.id === opts.foundry);

if (!foundry) {
  const ids = foundries.map((f) => f.id).join(", ") || "(none returned)";
  die(`Unknown foundry ID "${opts.foundry}". Available: ${ids}`, 3);
}

const rulesPayload = {
  gridSize: foundry.gridSize,
  layers: foundry.layers,
};

// ── Run DRC engine locally ────────────────────────────────────────────────────

info(`Running DRC engine on ${path.basename(gdsPath)}…`);

const startMs = Date.now();

/** Spawn the DRC engine and return the parsed result object. */
function runEngine(gdsFilePath, rules) {
  return new Promise((resolve, reject) => {
    const py = spawn("python3", [
      ENGINE_PY,
      "--gds-path", gdsFilePath,
      "--rules-json", JSON.stringify(rules),
    ], { detached: false });

    let stdout = "";
    let stdoutBytes = 0;
    const MAX_STDOUT = 10 * 1024 * 1024; // 10 MB
    let stderr = "";
    let settled = false;

    const settle = (fn) => { if (!settled) { settled = true; fn(); } };

    const timer = setTimeout(() => {
      try { py.kill("SIGKILL"); } catch {}
      settle(() => reject(new Error("DRC engine timed out after 5 minutes.")));
    }, 5 * 60 * 1000);

    py.stdout.on("data", (d) => {
      stdoutBytes += d.length;
      if (stdoutBytes > MAX_STDOUT) {
        try { py.kill("SIGKILL"); } catch {}
        settle(() => reject(new Error("DRC engine output exceeded size limit.")));
        return;
      }
      stdout += d.toString();
    });

    py.stderr.on("data", (d) => { stderr += d.toString(); });

    py.on("close", (code) => {
      clearTimeout(timer);
      settle(() => {
        const trimmed = stdout.trim();
        if (!trimmed) {
          const hint = stderr.slice(0, 500);
          reject(new Error(
            `DRC engine exited (code ${code}) with no output.` +
            (hint ? `\n\nEngine stderr:\n${hint}` : "\n\nMake sure python3, gdspy, numpy, and shapely are installed.")
          ));
          return;
        }
        try {
          resolve(JSON.parse(trimmed));
        } catch {
          reject(new Error("DRC engine returned non-JSON output:\n" + trimmed.slice(0, 300)));
        }
      });
    });

    py.on("error", (err) => {
      clearTimeout(timer);
      settle(() => {
        if (err.code === "ENOENT") {
          reject(new Error("python3 not found. Install Python 3.8+ and ensure it is on your PATH."));
        } else {
          reject(new Error(`Failed to start DRC engine: ${err.message}`));
        }
      });
    });
  });
}

let drcResult;
try {
  drcResult = await runEngine(gdsPath, rulesPayload);
} catch (err) {
  process.stderr.write(`\n[photonlint] DRC engine error:\n${err.message}\n`);
  process.exit(2);
}

const processingTimeMs = Date.now() - startMs;
info(`DRC complete in ${processingTimeMs}ms — ${drcResult.violations?.length ?? 0} violation(s)`);

// ── Upload results (no raw GDS) ───────────────────────────────────────────────

info("Uploading results to PhotonLint…");

// Sanitise violations before upload.
// Each violation from the DRC engine may carry a `geometry` field containing
// raw polygon vertex arrays — coordinates derived directly from the GDS file.
// By default we strip these to ensure no proprietary geometry leaves the host.
// Pass --include-layout to retain geometry (enables visual highlighting in the
// dashboard, but does upload coordinate data derived from your layout).
const sanitisedViolations = (drcResult.violations ?? []).map((v) => {
  if (opts.includeLayout) return v;
  // eslint-disable-next-line no-unused-vars
  const { geometry: _geom, ...rest } = v;
  return rest;
});

const importPayload = {
  foundryId: foundry.id,
  filename: path.basename(gdsPath),
  status: drcResult.status,
  violations: sanitisedViolations,
  passedChecks: drcResult.passedChecks ?? 0,
  totalChecks: drcResult.totalChecks ?? 4,
  processingTimeMs,
  errorMessage: drcResult.errorMessage ?? null,
  // layoutData (full polygon mesh) is also omitted unless --include-layout is set.
  ...(opts.includeLayout && drcResult.layoutData
    ? { layoutData: drcResult.layoutData }
    : {}),
};

let importRes;
try {
  importRes = await apiFetch("/drc/runs/import", {
    method: "POST",
    body: JSON.stringify(importPayload),
  });
} catch {
  // apiFetch already calls die() on network errors
}

if (!importRes.ok) {
  let body = "";
  try { body = await importRes.text(); } catch {}
  const msg = (() => {
    try { return JSON.parse(body).error ?? body; } catch { return body; }
  })();
  if (importRes.status === 401) {
    die("API key rejected (401). Check your --api-key or PHOTONLINT_API_KEY.", 3);
  }
  die(`API returned HTTP ${importRes.status}: ${msg}`, 3);
}

const saved = await importRes.json();

// ── Output ────────────────────────────────────────────────────────────────────

const dashboardBase = API_URL.replace(/\/api$/, "");
const runUrl = `${dashboardBase}/runs/${saved.id}`;

if (opts.json) {
  process.stdout.write(JSON.stringify({
    id: saved.id,
    status: saved.status,
    violationCount: saved.violationCount,
    passedChecks: saved.passedChecks,
    totalChecks: saved.totalChecks,
    processingTimeMs: saved.processingTimeMs,
    runUrl,
    violations: saved.violations,
  }, null, 2) + "\n");
} else {
  const statusLine = saved.status === "pass"
    ? c.green("✓ PASS")
    : saved.status === "fail"
      ? c.red("✗ FAIL")
      : c.yellow("⚠ ERROR");

  process.stdout.write(`
${c.bold("PhotonLint DRC Results")}
${"─".repeat(50)}
Status:      ${statusLine}
Violations:  ${saved.violationCount}
Checks:      ${saved.passedChecks}/${saved.totalChecks} passed
Time:        ${processingTimeMs}ms (local)
Run ID:      ${c.dim(saved.id)}
Dashboard:   ${runUrl}
`);

  if (saved.violations?.length > 0) {
    process.stdout.write("\nViolations:\n");
    for (const v of saved.violations) {
      const sev = v.severity === "critical"
        ? c.red("CRITICAL")
        : v.severity === "warning"
          ? c.yellow("WARNING ")
          : c.dim("INFO    ");
      process.stdout.write(`  [${sev}] ${v.rule}: ${v.location}\n`);
    }
    process.stdout.write("\n");
  }
}

// Exit 0 = pass, 1 = fail, 2 = engine error (handled above)
process.exit(saved.status === "pass" ? 0 : saved.status === "error" ? 2 : 1);
