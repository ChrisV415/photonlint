import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";
import { createHash, randomBytes } from "crypto";

vi.mock("@clerk/express", () => ({
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => next(),
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

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const ACCEPTED_USER = `terms-accepted-${suffix}`;
const UNACCEPTED_USER = `terms-unaccepted-${suffix}`;
const acceptedKey = `plk_${randomBytes(32).toString("hex")}`;
const unacceptedKey = `plk_${randomBytes(32).toString("hex")}`;
let keyIds: string[] = [];

beforeAll(async () => {
  const inserted = await db
    .insert(apiKeysTable)
    .values([
      { userId: ACCEPTED_USER, keyHash: createHash("sha256").update(acceptedKey).digest("hex"), label: "accepted" },
      { userId: UNACCEPTED_USER, keyHash: createHash("sha256").update(unacceptedKey).digest("hex"), label: "unaccepted" },
    ])
    .returning({ id: apiKeysTable.id });
  keyIds = inserted.map((key) => key.id);
  await db.insert(termsAcceptancesTable).values({ userId: ACCEPTED_USER, version: "1.0" });
});

afterAll(async () => {
  for (const id of keyIds) {
    await db.delete(apiKeysTable).where(eq(apiKeysTable.id, id));
  }
  await db.delete(termsAcceptancesTable).where(eq(termsAcceptancesTable.userId, ACCEPTED_USER));
});

describe("DRC terms acceptance enforcement", () => {
  it("blocks a Clerk-authenticated caller that has not accepted the current terms", async () => {
    const res = await supertest(app).post("/api/drc/check").set("x-test-user-id", UNACCEPTED_USER);
    expect(res.status).toBe(403);
    expect(res.body.code).toBe("TERMS_ACCEPTANCE_REQUIRED");
  });

  it("blocks an API-key caller whose owner has not accepted the current terms", async () => {
    const res = await supertest(app).post("/api/drc/check").set("Authorization", `Bearer ${unacceptedKey}`);
    expect(res.status).toBe(403);
    expect(res.body.code).toBe("TERMS_ACCEPTANCE_REQUIRED");
  });

  it("allows an accepted API-key caller to reach normal upload validation", async () => {
    const res = await supertest(app).post("/api/drc/check").set("Authorization", `Bearer ${acceptedKey}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/No GDS file/i);
  });
});