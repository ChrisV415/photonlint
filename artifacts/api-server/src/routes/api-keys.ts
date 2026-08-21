import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { randomBytes, createHash } from "crypto";
import { getAuth } from "@clerk/express";
import { db, apiKeysTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

// Key prefix — lets users recognise PhotonLint keys in their secrets managers
const KEY_PREFIX = "plk_";

function generateRawKey(): string {
  return KEY_PREFIX + randomBytes(32).toString("hex");
}

function hashKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

// UUID v4 — same pattern used in drc.ts; prevents garbage strings from reaching the DB.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Control-character regex — rejects labels containing ASCII control codes (0x00-0x1F, 0x7F).
// These have no legitimate use in a key label and can corrupt logs.
const CTRL_RE = /[\x00-\x1F\x7F]/;

// ── GET /api-keys — list all keys for the current user (no hashes) ───────────
router.get("/api-keys", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized." }); return; }
  try {
    const rows = await db
      .select({
        id: apiKeysTable.id,
        label: apiKeysTable.label,
        createdAt: apiKeysTable.createdAt,
        lastUsedAt: apiKeysTable.lastUsedAt,
      })
      .from(apiKeysTable)
      .where(eq(apiKeysTable.userId, userId));

    res.json({ keys: rows });
  } catch (err) {
    req.log.error({ err }, "Failed to list API keys");
    next(err);
  }
});

// ── POST /api-keys — create a new key ────────────────────────────────────────
// The raw key is returned ONCE here and never stored. Only the hash is saved.
router.post("/api-keys", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized." }); return; }
  const rawLabel = typeof req.body?.label === "string" ? req.body.label.trim() : "";

  if (!rawLabel) {
    res.status(400).json({ error: "A label is required (e.g. 'GitHub Actions – my-repo')." });
    return;
  }
  // Reject (not silently truncate) oversized labels — callers should know their label was rejected.
  if (rawLabel.length > 100) {
    res.status(400).json({ error: "Label must be 100 characters or fewer." });
    return;
  }
  // Control characters in labels corrupt log entries and can mislead log parsers.
  if (CTRL_RE.test(rawLabel)) {
    res.status(400).json({ error: "Label must not contain control characters." });
    return;
  }
  const label = rawLabel;

  const raw = generateRawKey();
  const hash = hashKey(raw);

  try {
    const [row] = await db
      .insert(apiKeysTable)
      .values({ userId, keyHash: hash, label })
      .returning({
        id: apiKeysTable.id,
        label: apiKeysTable.label,
        createdAt: apiKeysTable.createdAt,
      });

    if (!row) {
      req.log.error("API key insert returned no row — unexpected DB state");
      res.status(500).json({ error: "Failed to create API key. Please try again." });
      return;
    }

    // Return the raw key — this is the only time it will ever be shown.
    res.status(201).json({ key: raw, id: row.id, label: row.label, createdAt: row.createdAt });
  } catch (err) {
    req.log.error({ err }, "Failed to create API key");
    next(err);
  }
});

// ── DELETE /api-keys/:id — revoke a key ──────────────────────────────────────
router.delete("/api-keys/:id", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized." }); return; }
  const id = String(req.params.id);

  // Validate UUID format before hitting the DB — a non-UUID string causes a
  // Postgres cast error that becomes a noisy 500 instead of a clean 404.
  if (!UUID_RE.test(id)) {
    res.status(404).json({ error: "API key not found." });
    return;
  }

  try {
    const result = await db
      .delete(apiKeysTable)
      .where(and(eq(apiKeysTable.id, id), eq(apiKeysTable.userId, userId!)))
      .returning({ id: apiKeysTable.id });

    if (result.length === 0) {
      res.status(404).json({ error: "API key not found." });
      return;
    }
    res.json({ deleted: true });
  } catch (err) {
    req.log.error({ err, keyId: id }, "Failed to delete API key");
    next(err);
  }
});

export default router;
