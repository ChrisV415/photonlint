import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Personal API keys used for CI/CD pipelines and programmatic access.
 * The raw key is shown once at creation time; only the SHA-256 hash is stored.
 */
export const apiKeysTable = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Clerk userId of the key owner */
  userId: text("user_id").notNull(),
  /** SHA-256 hex digest of the raw key (never store the raw key) */
  keyHash: text("key_hash").notNull().unique(),
  /** Human-readable label, e.g. "GitHub Actions – my-repo" */
  label: text("label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  /** Updated on every successful authenticated request that uses this key */
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
});
