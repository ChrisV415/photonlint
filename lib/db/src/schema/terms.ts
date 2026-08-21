import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Records when a user accepted the beta terms of use.
// One row per user; re-acceptance is required when `version` changes.
export const termsAcceptancesTable = pgTable("terms_acceptances", {
  userId: text("user_id").primaryKey(),
  version: text("version").notNull().default("1.0"),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TermsAcceptance = typeof termsAcceptancesTable.$inferSelect;
