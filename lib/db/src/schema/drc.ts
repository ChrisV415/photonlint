import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// DRC runs table — one row per uploaded GDS file check
export const drcRunsTable = pgTable(
  "drc_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id"),   // nullable: pre-auth rows have no owner; all new rows are tagged
    foundryId: text("foundry_id").notNull(),
    foundryName: text("foundry_name").notNull(),
    filename: text("filename").notNull(),
    status: text("status").notNull(), // 'pass' | 'fail' | 'error'
    violationCount: integer("violation_count").notNull().default(0),
    passedChecks: integer("passed_checks").notNull().default(0),
    totalChecks: integer("total_checks").notNull().default(0),
    violations: jsonb("violations").notNull().default([]),
    layoutData: jsonb("layout_data"),
    errorMessage: text("error_message"),
    processingTimeMs: integer("processing_time_ms").notNull().default(0),
    checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Supports ORDER BY checked_at DESC used by /drc/runs and /drc/stats
    index("drc_runs_checked_at_idx").on(t.checkedAt),
    // Supports filtering runs by foundry in future queries
    index("drc_runs_foundry_id_idx").on(t.foundryId),
    // Supports filtering runs by user (privacy isolation)
    index("drc_runs_user_id_idx").on(t.userId),
  ],
);

export const insertDrcRunSchema = createInsertSchema(drcRunsTable).omit({
  id: true,
  checkedAt: true,
});

export type InsertDrcRun = z.infer<typeof insertDrcRunSchema>;
export type DrcRun = typeof drcRunsTable.$inferSelect;

// ── Foundry overrides ─────────────────────────────────────────────────────────
// Stores engineer-supplied custom PDK rule values that override the bundled YAML.
// One row per foundry; when present, the DRC engine uses these values instead.

export const foundryOverridesTable = pgTable("foundry_overrides", {
  foundryId: text("foundry_id").primaryKey(),
  gridSize: jsonb("grid_size").notNull(), // stored as number in jsonb for precision
  layers: jsonb("layers").notNull(),      // FoundryLayer[]
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type FoundryOverride = typeof foundryOverridesTable.$inferSelect;
