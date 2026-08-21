/**
 * Integration tests — DRC run privacy isolation
 *
 * Verifies that a user can only see their own DRC runs:
 *   • GET /api/drc/runs        → returns an empty array for another user
 *   • GET /api/drc/runs/:id    → returns 404 for another user
 *
 * Clerk is mocked so that `getAuth(req)` returns the value of the
 * X-Test-User-Id request header. This lets each request specify which
 * "user" is authenticated without needing real Clerk tokens.
 */

import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";

// ── Mock @clerk/express BEFORE any module that imports it ─────────────────────
// clerkMiddleware → no-op; getAuth reads a test-only header.
vi.mock("@clerk/express", () => ({
  clerkMiddleware:
    () =>
    (_req: unknown, _res: unknown, next: () => void) =>
      next(),
  getAuth: (req: { headers: Record<string, string | undefined> }) => ({
    userId: req.headers["x-test-user-id"] ?? null,
  }),
}));

// publishableKeyFromHost is called inside app.ts; stub it out.
vi.mock("@clerk/shared/keys", () => ({
  publishableKeyFromHost: () => "pk_test_placeholder",
}));

import supertest from "supertest";
import app from "../app.js";
import { db, drcRunsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// ── Helpers ───────────────────────────────────────────────────────────────────

// Use a unique suffix per test run so parallel CI runs don't interfere with
// each other and so we can assert user B's list is truly empty (no other rows).
const RUN_SUFFIX = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const USER_A = `test-user-a-isolation-${RUN_SUFFIX}`;
const USER_B = `test-user-b-isolation-${RUN_SUFFIX}`;

/** Minimal DRC run row — only required fields. */
const minimalRun = {
  userId: USER_A,
  foundryId: "sky130",
  foundryName: "SkyWater SKY130",
  filename: "test_layout.gds",
  status: "pass" as const,
  violationCount: 0,
  passedChecks: 3,
  totalChecks: 3,
  violations: [],
  layoutData: null,
  errorMessage: null,
  processingTimeMs: 42,
};

// Track inserted IDs for cleanup
const insertedIds: string[] = [];

// ── Lifecycle ─────────────────────────────────────────────────────────────────

beforeAll(async () => {
  // Insert a run owned by user A directly into the DB
  const [row] = await db.insert(drcRunsTable).values(minimalRun).returning({ id: drcRunsTable.id });
  insertedIds.push(row.id);
});

afterAll(async () => {
  // Clean up all rows inserted during this test run
  for (const id of insertedIds) {
    await db.delete(drcRunsTable).where(eq(drcRunsTable.id, id));
  }
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("DRC run privacy isolation", () => {
  it("GET /api/drc/runs — user B sees an empty list (not user A's runs)", async () => {
    const res = await supertest(app)
      .get("/api/drc/runs")
      .set("x-test-user-id", USER_B);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // USER_B is unique to this test run and has no runs at all — the list must be empty.
    expect(res.body).toHaveLength(0);
  });

  it("GET /api/drc/runs/:id — user B gets 404 for user A's run", async () => {
    const runId = insertedIds[0];

    const res = await supertest(app)
      .get(`/api/drc/runs/${runId}`)
      .set("x-test-user-id", USER_B);

    expect(res.status).toBe(404);
  });

  it("GET /api/drc/runs/:id — user A can still access their own run", async () => {
    const runId = insertedIds[0];

    const res = await supertest(app)
      .get(`/api/drc/runs/${runId}`)
      .set("x-test-user-id", USER_A);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(runId);
  });

  it("GET /api/drc/runs — user A can see their own run in the list", async () => {
    const res = await supertest(app)
      .get("/api/drc/runs")
      .set("x-test-user-id", USER_A);

    expect(res.status).toBe(200);
    const ids = (res.body as Array<{ id: string }>).map((r) => r.id);
    expect(ids).toContain(insertedIds[0]);
  });

  it("GET /api/drc/runs — unauthenticated request returns 401", async () => {
    // No x-test-user-id header → getAuth returns null → requireAuth rejects
    const res = await supertest(app).get("/api/drc/runs");
    expect(res.status).toBe(401);
  });

  it("GET /api/drc/runs/:id — unauthenticated request returns 401", async () => {
    const runId = insertedIds[0];
    const res = await supertest(app).get(`/api/drc/runs/${runId}`);
    expect(res.status).toBe(401);
  });
});
