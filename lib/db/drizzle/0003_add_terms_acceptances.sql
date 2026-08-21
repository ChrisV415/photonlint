-- Migration: add terms_acceptances table with versioned acceptance tracking
-- Creates the table if it does not exist yet, with a version column so users
-- can be re-gated whenever the terms text changes materially.
-- If the table already exists from an earlier (boolean-only) schema, the
-- ADD COLUMN IF NOT EXISTS safely adds the version column and backfills all
-- existing rows to "1.0" so no current tester is immediately re-gated.

CREATE TABLE IF NOT EXISTS "terms_acceptances" (
  "user_id" text PRIMARY KEY NOT NULL,
  "version" text NOT NULL DEFAULT '1.0',
  "accepted_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Upgrade path: if the table existed without the version column, add it.
ALTER TABLE "terms_acceptances" ADD COLUMN IF NOT EXISTS "version" text NOT NULL DEFAULT '1.0';
