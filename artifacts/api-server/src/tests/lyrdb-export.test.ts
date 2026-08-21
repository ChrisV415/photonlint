/**
 * Integration tests — KLayout marker database (.lyrdb) export
 *
 * Verifies GET /api/drc/runs/:id/report.lyrdb:
 *   • Response headers (Content-Type, Content-Disposition, 200)
 *   • Valid XML structure
 *   • Correct <top-cell> / <cell> / <item> cell references (non-"TOP" name)
 *   • KLayout polygon text format:  polygon: (x.xxx,y.xxx;...)
 *   • Coordinates kept in µm (not scaled to nm)
 *   • XML metacharacter escaping in rule / details fields
 *   • Empty-violations run → valid XML with zero <item> elements
 *   • Auth scoping: unauthenticated → 401, wrong user → 404, bad ID → 400
 */

import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";

vi.mock("@clerk/express", () => ({
  clerkMiddleware:
    () =>
    (_req: unknown, _res: unknown, next: () => void) =>
      next(),
  getAuth: (req: { headers: Record<string, string | undefined> }) => ({
    userId: req.headers["x-test-user-id"] ?? null,
  }),
}));

vi.mock("@clerk/shared/keys", () => ({
  publishableKeyFromHost: () => "pk_test_placeholder",
}));

import supertest from "supertest";
import app from "../app.js";
import { db, drcRunsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SUFFIX = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const USER_A = `test-user-lyrdb-a-${SUFFIX}`;
const USER_B = `test-user-lyrdb-b-${SUFFIX}`;

/** Run with violations and a non-"TOP" GDS top-cell name. */
const runWithViolations = {
  userId:          USER_A,
  foundryId:       "sky130",
  foundryName:     "SkyWater SKY130",
  filename:        "photonic_ring.gds",
  status:          "fail" as const,
  violationCount:  2,
  passedChecks:    2,
  totalChecks:     4,
  layoutData: {
    topCell:           "PHOTONIC_CHIP",   // non-default top-cell name
    bounds:            { minX: 0, minY: 0, maxX: 10, maxY: 10 },
    polygons:          [],
    configuredLayers:  [],
  },
  violations: [
    {
      rule:        "MIN_WIDTH",
      requirement: ">= 0.45 um",
      location:    "Layer 1 near (1.500, 2.000)",
      severity:    "critical",
      details:     "Polygon width 0.30 um < 0.45 um",
      // Rectangle with first vertex at (1.0, 1.5) — checked by coordinate test
      geometry:    [[1.0, 1.5], [1.3, 1.5], [1.3, 2.5], [1.0, 2.5]],
    },
    {
      // Rule name and details containing all five XML metacharacters
      rule:        "BEND_RADIUS<&>CHECK",
      requirement: "r >= 5 um",
      location:    "Layer 2 near (3.0, 4.0)",
      severity:    "warning",
      details:     "Radius 3.1 < 5 um — see <note> & 'spec'",
      geometry:    null,   // violation without geometry — no <values> block expected
    },
  ],
  errorMessage:    null,
  processingTimeMs: 120,
};

/** Run with zero violations — should produce valid lyrdb with empty <items>. */
const runNoViolations = {
  userId:          USER_A,
  foundryId:       "sky130",
  foundryName:     "SkyWater SKY130",
  filename:        "clean_layout.gds",
  status:          "pass" as const,
  violationCount:  0,
  passedChecks:    4,
  totalChecks:     4,
  layoutData: {
    topCell: "CLEAN_TOP",
    bounds:  { minX: 0, minY: 0, maxX: 5, maxY: 5 },
    polygons: [],
    configuredLayers: [],
  },
  violations:       [],
  errorMessage:     null,
  processingTimeMs: 80,
};

const insertedIds: string[] = [];
let violationRunId: string;
let noViolationRunId: string;

// ── Lifecycle ─────────────────────────────────────────────────────────────────

beforeAll(async () => {
  const [rowA] = await db.insert(drcRunsTable).values(runWithViolations).returning({ id: drcRunsTable.id });
  const [rowB] = await db.insert(drcRunsTable).values(runNoViolations).returning({ id: drcRunsTable.id });
  violationRunId   = rowA.id;
  noViolationRunId = rowB.id;
  insertedIds.push(rowA.id, rowB.id);
});

afterAll(async () => {
  for (const id of insertedIds) {
    await db.delete(drcRunsTable).where(eq(drcRunsTable.id, id));
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** supertest's .set() must be called after specifying the HTTP method. */
function lyrdbGet(runId: string, userId: string) {
  return supertest(app)
    .get(`/api/drc/runs/${runId}/report.lyrdb`)
    .set("x-test-user-id", userId);
}

function assertWellFormedXml(body: string) {
  expect(body).toMatch(/^<\?xml version="1\.0"/);
  expect(body).toMatch(/<report-database>[\s\S]+<\/report-database>/);
  // Bare & (not part of a named/numeric entity) must not be present
  const stripped = body.replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, "");
  expect(stripped).not.toMatch(/&(?!#)/);
}

function countTag(haystack: string, tag: string): number {
  return (haystack.split(`<${tag}>`).length - 1);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("GET /api/drc/runs/:id/report.lyrdb", () => {
  it("returns 401 when unauthenticated", async () => {
    const res = await supertest(app)
      .get(`/api/drc/runs/${violationRunId}/report.lyrdb`);
    expect(res.status).toBe(401);
  });

  it("returns 404 for a different user (run isolation)", async () => {
    const res = await lyrdbGet(violationRunId, USER_B);
    expect(res.status).toBe(404);
  });

  it("returns 400 for a non-UUID run ID", async () => {
    const res = await supertest(app)
      .get("/api/drc/runs/not-a-valid-uuid/report.lyrdb")
      .set("x-test-user-id", USER_A);
    expect(res.status).toBe(400);
  });

  it("returns 200 with application/xml content-type", async () => {
    const res = await lyrdbGet(violationRunId, USER_A);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/xml/);
  });

  it("returns a Content-Disposition attachment header with .lyrdb filename", async () => {
    const res = await lyrdbGet(violationRunId, USER_A);
    expect(res.headers["content-disposition"]).toMatch(/attachment/);
    expect(res.headers["content-disposition"]).toMatch(/\.lyrdb"/);
  });

  it("produces well-formed XML with a <report-database> root", async () => {
    const res = await lyrdbGet(violationRunId, USER_A);
    assertWellFormedXml(res.text);
    expect(res.text).toContain("<report-database>");
    expect(res.text).toContain("</report-database>");
  });

  it("uses the stored GDS top-cell name in <top-cell> and each item's <cell>", async () => {
    const res = await lyrdbGet(violationRunId, USER_A);
    const body = res.text;
    // Report-level top-cell declaration
    expect(body).toContain("<top-cell>PHOTONIC_CHIP</top-cell>");
    // Each <item> carries its own <cell>NAME</cell> — 2 violations = 2 occurrences
    const itemCellRefs = body.split("<cell>PHOTONIC_CHIP</cell>").length - 1;
    expect(itemCellRefs).toBeGreaterThanOrEqual(2);
    // Must NOT fall back to "TOP" when a real name is stored
    expect(body).not.toContain("<top-cell>TOP</top-cell>");
  });

  it("serializes geometry in KLayout polygon text format — not a nested XML element", async () => {
    const res = await lyrdbGet(violationRunId, USER_A);
    const body = res.text;
    // KLayout RDB polygon value format: "polygon: (x.ddd,y.ddd;...)"
    expect(body).toMatch(/polygon: \(\d+\.\d+,\d+\.\d+;/);
    // Old wrong format would have been a bare <polygon> element
    expect(body).not.toContain("<polygon>");
  });

  it("keeps coordinates in µm — does not scale to nm", async () => {
    const res = await lyrdbGet(violationRunId, USER_A);
    const body = res.text;
    // First vertex of the geometry rectangle is [1.0, 1.5] → "1.000,1.500"
    expect(body).toContain("1.000,1.500");
    // If wrongly scaled ×1000 the value would be "1000,1500"
    expect(body).not.toMatch(/\b1000,1500\b/);
  });

  it("writes item labels to <comment>, not <description>", async () => {
    const res = await lyrdbGet(violationRunId, USER_A);
    const body = res.text;
    // Item labels must be in <comment> elements
    expect(body).toMatch(/<comment>\[CRITICAL\] MIN_WIDTH:/);
    // Within the <items> section, labels must not appear in <description> elements
    const itemsSection = body.split("<items>")[1] ?? "";
    expect(itemsSection).not.toMatch(/<description>\[/);
  });

  it("escapes XML metacharacters in rule names and details", async () => {
    const res = await lyrdbGet(violationRunId, USER_A);
    const body = res.text;
    // "BEND_RADIUS<&>CHECK" → "BEND_RADIUS&lt;&amp;&gt;CHECK"
    expect(body).toContain("BEND_RADIUS&lt;&amp;&gt;CHECK");
    // "<note>" in details → "&lt;note&gt;"
    expect(body).toContain("&lt;note&gt;");
    // "& 'spec'" in details → "&amp; &apos;spec&apos;"
    expect(body).toContain("&amp;");
  });

  it("omits <values> for violations that have no geometry", async () => {
    const res = await lyrdbGet(violationRunId, USER_A);
    // Fixture has 2 violations: 1 with geometry, 1 without → exactly 1 <values> block
    expect(countTag(res.text, "values")).toBe(1);
  });

  it("produces valid XML with zero <item> elements for a passing run", async () => {
    const res = await lyrdbGet(noViolationRunId, USER_A);
    expect(res.status).toBe(200);
    assertWellFormedXml(res.text);
    expect(countTag(res.text, "item")).toBe(0);
    expect(res.text).toContain("<top-cell>CLEAN_TOP</top-cell>");
  });
});
