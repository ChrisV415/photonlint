-- Migration: add layout_data column to drc_runs
-- This column stores polygon geometry for the layout viewer; nullable so existing rows remain valid.
ALTER TABLE "drc_runs" ADD COLUMN IF NOT EXISTS "layout_data" jsonb;
