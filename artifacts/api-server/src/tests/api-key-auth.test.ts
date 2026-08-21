/**
 * Integration tests — API key authentication and DRC endpoint auth enforcement
 *
 * Covers:
 *   • POST /api/drc/check rejects requests with no credentials (401)
 *   • POST /api/drc/check rejects an invalid/garbage Bearer token (401)
 *   • POST /api/drc/check accepts a valid plk_ API key (passes auth → 400 missing file, not 401)
 *   • GET  /api/api-keys rejects unauthenticated requests (401)
 *   • POST /api/api-keys rejects unauthenticated requests (401)
 *   • DELETE /api/api-keys/:id rejects unauthenticated requests (401)
 *
 * Clerk is mocked identically to drc-isolation.test.ts so that getAuth()
 * reads from the X-Test-User-Id header. API key auth uses the real DB lookup
 * (requireAuthOrApiKey hits the api_keys table directly).
 */

import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";
import { createHash, randomBytes } from "crypto";

// ── Mock @clerk/express BEFORE any module that imports it ─────────────────────
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
import { db, apiKeysTable, termsAcceptancesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// ── Test fixtures ─────────────────────────────────────────────────────────────

const RUN_SUFFIX = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const API_KEY_OWNER = `test-user-apikey-${RUN_SUFFIX}`;

// Raw key and its hash — inserted into DB in beforeAll, used in tests
const RAW_KEY = "plk_" + randomBytes(32).toString("hex");
const KEY_HASH = createHash("sha256").update(RAW_KEY).digest("hex");

let insertedKeyId: string;

// ── Lifecycle ─────────────────────────────────────────────────────────────────

beforeAll(async () => {
  const [row] = await db
    .insert(apiKeysTable)
    .values({ userId: API_KEY_OWNER, keyHash: KEY_HASH, label: "test-key" })
    .returning({ id: apiKeysTable.id });
  insertedKeyId = row.id;
  await db
    .insert(termsAcceptancesTable)
    .values({ userId: API_KEY_OWNER, version: "1.0" });
});

afterAll(async () => {
  if (insertedKeyId) {
    await db.delete(apiKeysTable).where(eq(apiKeysTable.id, insertedKeyId));
  }
  await db.delete(termsAcceptancesTable).where(eq(termsAcceptancesTable.userId, API_KEY_OWNER));
});

// ── Tests: POST /api/drc/check auth enforcement ───────────────────────────────

describe("POST /api/drc/check — auth enforcement", () => {
  it("returns 401 with no credentials at all", async () => {
    const res = await supertest(app).post("/api/drc/check");
    expect(res.status).toBe(401);
  });

  it("returns 401 with a garbage Bearer token", async () => {
    const res = await supertest(app)
      .post("/api/drc/check")
      .set("Authorization", "Bearer plk_thisisnotavalidkey00000000000000000000000000000000000000000000000");
    expect(res.status).toBe(401);
  });

  it("returns 401 with a non-plk_ Bearer token", async () => {
    // Ensure we don't accidentally accept JWT-style tokens that happen to start with Bearer
    const res = await supertest(app)
      .post("/api/drc/check")
      .set("Authorization", "Bearer eyJhbGciOiJSUzI1NiJ9.fake.jwt");
    expect(res.status).toBe(401);
  });

  it("passes auth with a valid API key and returns 400 (missing file — not 401)", async () => {
    // Auth succeeds → multer runs → handler finds no file → 400
    // A 401 here would mean the API key was rejected.
    const res = await supertest(app)
      .post("/api/drc/check")
      .set("Authorization", `Bearer ${RAW_KEY}`);
    expect(res.status).not.toBe(401);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/No GDS file/i);
  });

  it("passes auth with a Clerk session (X-Test-User-Id) and returns 400 (missing file)", async () => {
    const res = await supertest(app)
      .post("/api/drc/check")
      .set("x-test-user-id", API_KEY_OWNER);
    expect(res.status).not.toBe(401);
    expect(res.status).toBe(400);
  });
});

// ── Tests: /api/api-keys endpoint auth enforcement ────────────────────────────

describe("GET /api/api-keys — auth enforcement", () => {
  it("returns 401 with no credentials", async () => {
    const res = await supertest(app).get("/api/api-keys");
    expect(res.status).toBe(401);
  });

  it("returns 200 for an authenticated user", async () => {
    const res = await supertest(app)
      .get("/api/api-keys")
      .set("x-test-user-id", API_KEY_OWNER);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.keys)).toBe(true);
  });

  it("only returns keys belonging to the authenticated user", async () => {
    const otherUser = `other-user-${RUN_SUFFIX}`;
    const res = await supertest(app)
      .get("/api/api-keys")
      .set("x-test-user-id", otherUser);
    expect(res.status).toBe(200);
    // otherUser has no keys — list must be empty
    expect(res.body.keys).toHaveLength(0);
  });
});

describe("POST /api/api-keys — auth enforcement", () => {
  it("returns 401 with no credentials", async () => {
    const res = await supertest(app)
      .post("/api/api-keys")
      .send({ label: "test" });
    expect(res.status).toBe(401);
  });

  it("returns 400 when label is missing", async () => {
    const res = await supertest(app)
      .post("/api/api-keys")
      .set("x-test-user-id", API_KEY_OWNER)
      .set("Content-Type", "application/json")
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/label/i);
  });
});

describe("DELETE /api/api-keys/:id — auth enforcement", () => {
  it("returns 401 with no credentials", async () => {
    const res = await supertest(app).delete("/api/api-keys/some-id");
    expect(res.status).toBe(401);
  });

  it("returns 404 when trying to delete another user's key", async () => {
    const otherUser = `other-user-${RUN_SUFFIX}`;
    const res = await supertest(app)
      .delete(`/api/api-keys/${insertedKeyId}`)
      .set("x-test-user-id", otherUser);
    // insertedKeyId belongs to API_KEY_OWNER, not otherUser → 404
    expect(res.status).toBe(404);
  });
});
