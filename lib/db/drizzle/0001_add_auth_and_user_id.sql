-- Migration: add Replit Auth tables and per-user isolation for DRC runs
-- Adds: users, sessions tables required by Replit Auth
--       user_id column on drc_runs for per-user data isolation
-- All additions are non-destructive (IF NOT EXISTS / nullable column).

CREATE TABLE IF NOT EXISTS "users" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar UNIQUE,
  "first_name" varchar,
  "last_name" varchar,
  "profile_image_url" varchar,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" varchar PRIMARY KEY NOT NULL,
  "sess" jsonb NOT NULL,
  "expire" timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire");

-- Nullable so existing rows (pre-auth) remain valid
ALTER TABLE "drc_runs" ADD COLUMN IF NOT EXISTS "user_id" text;

CREATE INDEX IF NOT EXISTS "drc_runs_user_id_idx" ON "drc_runs" ("user_id");
