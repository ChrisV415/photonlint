import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

/**
 * Requires a valid Clerk session. Returns 401 if the request is unauthenticated.
 * Use on any route that should only be accessible to signed-in users.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }
  next();
}
