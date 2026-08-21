import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db, termsAcceptancesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

// The terms version that must be accepted. Bump this string whenever the
// terms text changes materially — existing users will be shown the new
// version and must re-accept before they can continue using the app.
const CURRENT_VERSION = "1.0";

// ── GET /terms/status — has the current user accepted the current version? ────
router.get("/terms/status", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized." }); return; }
  try {
    const [row] = await db
      .select()
      .from(termsAcceptancesTable)
      .where(eq(termsAcceptancesTable.userId, userId))
      .limit(1);

    const accepted = !!row && row.version === CURRENT_VERSION;
    res.json({ accepted, version: CURRENT_VERSION });
  } catch (err) {
    next(err);
  }
});

// ── POST /terms/accept — record acceptance for the current version ─────────────
router.post("/terms/accept", requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized." }); return; }
  try {
    await db
      .insert(termsAcceptancesTable)
      .values({ userId, version: CURRENT_VERSION })
      .onConflictDoUpdate({
        target: termsAcceptancesTable.userId,
        set: { version: CURRENT_VERSION, acceptedAt: new Date() },
      });
    res.json({ accepted: true, version: CURRENT_VERSION });
  } catch (err) {
    next(err);
  }
});

export default router;
