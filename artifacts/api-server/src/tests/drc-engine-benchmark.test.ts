/**
 * DRC Engine Benchmark Suite
 *
 * Runs the DRC Python engine against five labeled synthetic GDS fixtures —
 * one per check type — and validates that status, passedChecks, and violation
 * rule/severity exactly match hand-verified ground truth.
 *
 * This is the regression corpus: any engine change that silently breaks a
 * check will fail here before a beta tester sees it.
 *
 * Ground truth per fixture (all use the same ruleset):
 *   gridSize=0.005 µm, layer 1/0 "WG" minWidth=0.2 µm minSpacing=2.0 µm minBendRadius=5.0 µm
 *
 *   clean       — 10×10 µm square, everything on-grid      → pass, 4/4 checks, 0 violations
 *   grid-snap   — same square, one vertex 1 nm off-grid     → pass, 3/4, Grid Snap warning
 *   min-width   — 0.1×20 µm strip (too narrow)             → fail, 3/4, Min Width critical
 *   min-spacing — two rects 0.5 µm apart (gap < 2 µm)     → fail, 3/4, Min Spacing critical
 *   bend-radius — L-shape with ~3.8 µm inner corners       → pass, 3/4, Bend Radius warning(s)
 */

import { spawn } from "child_process";
import path from "path";
import os from "os";
import fs from "fs";
import { fileURLToPath } from "url";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const __rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  ".."
);
const FIXTURE_GENERATOR = path.resolve(
  __rootDir,
  "src",
  "tests",
  "fixtures",
  "create_fixtures.py"
);
const DRC_SCRIPT = path.resolve(__rootDir, "src", "lib", "drc_engine.py");

// ── Types ─────────────────────────────────────────────────────────────────────

type Manifest = Record<string, { gds_path: string; rules: object }>;

type DrcResult = {
  status: "pass" | "fail" | "error";
  errorMessage: string | null;
  violations: Array<{ rule: string; severity: string; location: string }>;
  passedChecks: number;
  totalChecks: number;
};

type ExpectedViolation = {
  /** Substring that must appear in the violation's `rule` field */
  rule: string;
  severity: "critical" | "warning" | "info";
};

type GroundTruth = {
  status: "pass" | "fail";
  passedChecks: number;
  /** Violations that MUST be present (subset check — extra violations are allowed) */
  violations: ExpectedViolation[];
};

// ── Ground truth ──────────────────────────────────────────────────────────────

const GROUND_TRUTH: Record<string, GroundTruth> = {
  clean: {
    status: "pass",
    passedChecks: 4,
    violations: [],
  },
  "grid-snap": {
    status: "pass", // warnings never flip status to fail
    passedChecks: 3,
    violations: [{ rule: "Grid Snap", severity: "warning" }],
  },
  "min-width": {
    status: "fail",
    passedChecks: 3,
    violations: [{ rule: "Minimum Feature Width", severity: "critical" }],
  },
  "min-spacing": {
    status: "fail",
    passedChecks: 3,
    violations: [{ rule: "Minimum Spacing", severity: "critical" }],
  },
  "bend-radius": {
    status: "pass", // bend radius violations are warnings
    passedChecks: 3,
    violations: [{ rule: "Minimum Bend Radius", severity: "warning" }],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Spawn `cmd args`, collect stdout, parse as JSON.
 * stderr is forwarded to the Node stderr so it appears in test output.
 */
function spawnJson<T>(cmd: string, args: string[]): Promise<T> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);
    const chunks: Buffer[] = [];
    const errChunks: Buffer[] = [];

    proc.stdout.on("data", (d: Buffer) => chunks.push(d));
    proc.stderr.on("data", (d: Buffer) => {
      errChunks.push(d);
      // Forward Python stderr to Node stderr so it's visible in test output
      process.stderr.write(d);
    });

    proc.on("close", (code) => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        const stderr = Buffer.concat(errChunks).toString("utf8").slice(0, 800);
        reject(
          new Error(
            `\`${cmd} ${args[0]}\` exited ${code} with no stdout.\nstderr:\n${stderr}`
          )
        );
        return;
      }
      try {
        resolve(JSON.parse(raw) as T);
      } catch {
        reject(
          new Error(
            `Failed to parse JSON from \`${cmd} ${args[0]}\`:\n${raw.slice(0, 800)}`
          )
        );
      }
    });

    proc.on("error", (err) =>
      reject(new Error(`Failed to start \`${cmd}\`: ${err.message}`))
    );
  });
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe("DRC Engine Benchmark", () => {
  let manifest: Manifest;
  let tmpDir: string;

  // Generate fixture GDS files once before all tests
  beforeAll(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "photonlint-fixtures-"));
    manifest = await spawnJson<Manifest>("python3", [
      FIXTURE_GENERATOR,
      "--output-dir",
      tmpDir,
    ]);

    // Sanity-check the manifest — fail fast with a clear message
    for (const name of Object.keys(GROUND_TRUTH)) {
      if (!manifest[name]) {
        throw new Error(
          `Fixture generator did not produce manifest entry for "${name}". ` +
            `Got keys: ${Object.keys(manifest).join(", ")}`
        );
      }
      if (!fs.existsSync(manifest[name].gds_path)) {
        throw new Error(
          `Fixture "${name}" GDS file not found at: ${manifest[name].gds_path}`
        );
      }
    }
  }, 45_000); // generous timeout — gdspy cold-start can be slow in CI

  // Clean up temp files after all tests
  afterAll(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Non-fatal — OS will clean /tmp anyway
    }
  });

  // ── Data-driven tests — one describe block per fixture ────────────────────

  for (const [fixtureName, truth] of Object.entries(GROUND_TRUTH)) {
    describe(`fixture: ${fixtureName}`, () => {
      let result: DrcResult;

      // Run the DRC engine for this fixture before the inner `it` blocks
      beforeAll(async () => {
        const entry = manifest[fixtureName];
        result = await spawnJson<DrcResult>("python3", [
          DRC_SCRIPT,
          "--gds-path",
          entry.gds_path,
          "--rules-json",
          JSON.stringify(entry.rules),
        ]);
      }, 30_000);

      it("engine exits cleanly (status is not 'error')", () => {
        expect(result.status).not.toBe("error");
        expect(result.errorMessage).toBeNull();
      });

      it(`overall status is "${truth.status}"`, () => {
        expect(result.status).toBe(truth.status);
      });

      it(`passedChecks is ${truth.passedChecks} of 4`, () => {
        expect(result.passedChecks).toBe(truth.passedChecks);
        expect(result.totalChecks).toBe(4);
      });

      if (truth.violations.length === 0) {
        it("produces no violations", () => {
          expect(result.violations).toHaveLength(0);
        });
      } else {
        for (const expected of truth.violations) {
          it(`has a "${expected.rule}" violation at severity "${expected.severity}"`, () => {
            const match = result.violations.find(
              (v) =>
                v.rule.includes(expected.rule) &&
                v.severity === expected.severity
            );
            expect(
              match,
              `Expected a "${expected.rule}" / "${expected.severity}" violation.\n` +
                `Actual violations:\n${JSON.stringify(result.violations, null, 2)}`
            ).toBeDefined();
          });
        }
      }
    });
  }
});
