import type { NextFunction, Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db, termsAcceptancesTable } from "@workspace/db";
import { CURRENT_TERMS_VERSION } from "../lib/terms.js";
import { getEffectiveUserId } from "./apiKeyAuth.js";

/**
 * Requires current Terms acceptance after requireAuthOrApiKey has resolved the
 * caller. This protects both browser sessions and local CLI/API-key clients.
 */
export async function requireTermsAcceptance(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = getEffectiveUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    const [acceptance] = await db
      .select({ userId: termsAcceptancesTable.userId })
      .from(termsAcceptancesTable)
      .where(
        and(
          eq(termsAcceptancesTable.userId, userId),
          eq(termsAcceptancesTable.version, CURRENT_TERMS_VERSION),
        ),
      )
      .limit(1);

    if (!acceptance) {
      res.status(403).json({
        error: "Accept the current Terms of Service before submitting a DRC run.",
        code: "TERMS_ACCEPTANCE_REQUIRED",
        version: CURRENT_TERMS_VERSION,
      });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
}