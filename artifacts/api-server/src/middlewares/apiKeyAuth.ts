import { createHash } from "crypto";
import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db, apiKeysTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// Extend Express Request to carry the resolved userId from an API key,
// so downstream handlers can call getEffectiveUserId() without caring
// whether the caller used Clerk or an API key.
declare global {
  namespace Express {
    interface Request {
      apiKeyUserId?: string;
    }
  }
}

/**
 * Returns the authenticated userId regardless of whether the request
 * was authenticated via Clerk session or a Bearer API key.
 *
 * Call only after requireAuthOrApiKey has run.
 */
export function getEffectiveUserId(req: Request): string | null {
  return req.apiKeyUserId ?? getAuth(req).userId ?? null;
}

/**
 * Middleware that accepts EITHER a valid Clerk session OR a Bearer API key
 * (Authorization: Bearer plk_…). Returns 401 if neither is present/valid.
 *
 * Use on endpoints that should be reachable from CI pipelines as well as
 * the browser. For browser-only endpoints, keep using requireAuth instead.
 */
export async function requireAuthOrApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // ── 1. Try Bearer API key ────────────────────────────────────────────────
  const authHeader = req.headers["authorization"];
  if (authHeader?.startsWith("Bearer plk_")) {
    const raw = authHeader.slice("Bearer ".length);
    const hash = createHash("sha256").update(raw).digest("hex");

    try {
      const [row] = await db
        .select({ id: apiKeysTable.id, userId: apiKeysTable.userId })
        .from(apiKeysTable)
        .where(eq(apiKeysTable.keyHash, hash))
        .limit(1);

      if (!row) {
        res.status(401).json({ error: "Invalid API key." });
        return;
      }

      // Attach userId and fire-and-forget lastUsedAt update
      req.apiKeyUserId = row.userId;
      db.update(apiKeysTable)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeysTable.id, row.id))
        .catch(() => {/* non-fatal */});

      next();
      return;
    } catch (err) {
      next(err);
      return;
    }
  }

  // ── 2. Fall back to Clerk session ────────────────────────────────────────
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }
  next();
}
