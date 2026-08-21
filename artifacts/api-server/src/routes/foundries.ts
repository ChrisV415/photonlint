import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { load as yamlLoad } from "js-yaml";
import { db, foundryOverridesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";

// When FOUNDRY_OVERRIDE_KEY is set, PUT/DELETE /foundries/:id/override require
// the caller to supply it as an X-Override-Key request header.
// Without the env var the routes are open (dev fallback — set the secret for prod/demo).
const OVERRIDE_KEY = process.env["FOUNDRY_OVERRIDE_KEY"] ?? null;

if (!OVERRIDE_KEY) {
  // Emit once at startup so it's visible in logs — not a hard failure because
  // dev environments intentionally omit the secret. In production, set
  // FOUNDRY_OVERRIDE_KEY or the PUT/DELETE override routes are unprotected.
  logger.warn(
    "FOUNDRY_OVERRIDE_KEY is not set — PUT/DELETE /foundries/:id/override are unprotected. " +
    "Set the secret before exposing this server publicly."
  );
}

function requireOverrideKey(req: Request, res: Response, next: NextFunction): void {
  if (!OVERRIDE_KEY) {
    // Key not configured — allow through (dev fallback).
    // A startup warning was already emitted above.
    next();
    return;
  }
  const provided = req.headers["x-override-key"];
  if (!provided || provided !== OVERRIDE_KEY) {
    res.status(401).json({
      error: "Missing or invalid X-Override-Key header. Contact your administrator.",
    });
    return;
  }
  next();
}

// Resolve the package root robustly for both execution contexts:
// • Bundled (dist/index.mjs):          __fileDir = <pkg>/dist/    → root is one level up
// • Source / tests (src/routes/…):     __fileDir = <pkg>/src/routes/ → root is two levels up
const __fileDir = path.dirname(fileURLToPath(import.meta.url));
const __rootDir = path.basename(__fileDir) === "dist"
  ? path.resolve(__fileDir, "..")
  : path.resolve(__fileDir, "../..");

const router: IRouter = Router();

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FoundryLayer {
  layer: number;
  datatype: number;
  name: string;
  minWidth: number;      // µm
  minSpacing: number;    // µm
  minBendRadius: number; // µm
}

export interface Foundry {
  id: string;
  name: string;
  description: string;
  technology: string;
  gridSize: number;      // µm — global manufacturing grid
  layers: FoundryLayer[];
}

// ── YAML loader ───────────────────────────────────────────────────────────────

interface RawFoundryYaml {
  id: string;
  name: string;
  description: string;
  technology: string;
  gridSize: number;
  layers: FoundryLayer[];
}

function loadFoundry(filename: string): Foundry {
  const filePath = path.resolve(__rootDir, "src", "foundries", filename);
  const raw = yamlLoad(fs.readFileSync(filePath, "utf8")) as RawFoundryYaml;

  if (!raw?.id || !Array.isArray(raw.layers) || raw.layers.length === 0) {
    throw new Error(`Invalid foundry config in ${filename}: missing id or layers`);
  }

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    technology: raw.technology,
    gridSize: raw.gridSize,
    layers: raw.layers,
  };
}

// Load all foundry configs at startup — fail fast if any YAML is malformed
export const FOUNDRIES: Foundry[] = [
  loadFoundry("gf-45spclo.yaml"),
  loadFoundry("aim-photonics.yaml"),
  loadFoundry("tower-semi.yaml"),
  loadFoundry("imec-isipp50g.yaml"),
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Validate that a layers array contains well-formed FoundryLayer objects with sane numeric ranges. */
function validateLayers(layers: unknown): layers is FoundryLayer[] {
  if (!Array.isArray(layers) || layers.length === 0) return false;
  for (const l of layers) {
    if (typeof l !== "object" || l === null) return false;
    const { layer, datatype, name, minWidth, minSpacing, minBendRadius } = l as FoundryLayer;
    if (
      typeof layer !== "number" || !Number.isInteger(layer) || layer < 0 ||
      typeof datatype !== "number" || !Number.isInteger(datatype) || datatype < 0 ||
      typeof name !== "string" || name.trim().length === 0 ||
      typeof minWidth !== "number" || !Number.isFinite(minWidth) || minWidth <= 0 ||
      typeof minSpacing !== "number" || !Number.isFinite(minSpacing) || minSpacing <= 0 ||
      typeof minBendRadius !== "number" || !Number.isFinite(minBendRadius) || minBendRadius < 0
    ) return false;
  }
  return true;
}

/**
 * Return the effective rules for a foundry — DB override if present, YAML defaults otherwise.
 * Used by both the foundries route (for display) and the DRC route (for checking).
 */
export async function getEffectiveRules(
  foundryId: string
): Promise<{ gridSize: number; layers: FoundryLayer[]; hasOverride: boolean }> {
  const [override] = await db
    .select()
    .from(foundryOverridesTable)
    .where(eq(foundryOverridesTable.foundryId, foundryId));

  if (override) {
    return {
      gridSize: override.gridSize as number,
      layers: override.layers as FoundryLayer[],
      hasOverride: true,
    };
  }

  const foundry = FOUNDRIES.find((f) => f.id === foundryId);
  if (!foundry) throw new Error(`Unknown foundry: ${foundryId}`);

  return { gridSize: foundry.gridSize, layers: foundry.layers, hasOverride: false };
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /foundries — list all foundries, merging any DB overrides into the response
router.get("/foundries", async (req, res, next): Promise<void> => {
  let overrides;
  try {
    overrides = await db.select().from(foundryOverridesTable);
  } catch (err) {
    req.log.error({ err }, "Failed to load foundry overrides from DB");
    next(err);
    return;
  }

  const overrideMap = new Map(overrides.map((o) => [o.foundryId, o]));

  const response = FOUNDRIES.map((f) => {
    const override = overrideMap.get(f.id);
    if (override) {
      return {
        ...f,
        gridSize: override.gridSize as number,
        layers: override.layers as FoundryLayer[],
        hasOverride: true,
        // Include YAML defaults so the frontend can highlight which values differ
        defaults: { gridSize: f.gridSize, layers: f.layers },
      };
    }
    return { ...f, hasOverride: false };
  });

  res.json(response);
});

// PUT /foundries/:id/override — upsert custom PDK rule values
router.put("/foundries/:id/override", requireOverrideKey, async (req, res, next): Promise<void> => {
  const id = String(req.params.id);

  const foundry = FOUNDRIES.find((f) => f.id === id);
  if (!foundry) {
    res.status(404).json({ error: `Unknown foundry: "${id}"` });
    return;
  }

  const { gridSize, layers } = req.body as { gridSize?: unknown; layers?: unknown };

  if (typeof gridSize !== "number" || !Number.isFinite(gridSize) || gridSize <= 0) {
    res.status(400).json({ error: "gridSize must be a positive finite number (in microns)" });
    return;
  }
  if (!validateLayers(layers)) {
    res.status(400).json({
      error:
        "layers must be a non-empty array of { layer, datatype, name, minWidth, minSpacing, minBendRadius } with positive finite values",
    });
    return;
  }

  try {
    await db
      .insert(foundryOverridesTable)
      .values({ foundryId: id, gridSize, layers })
      .onConflictDoUpdate({
        target: foundryOverridesTable.foundryId,
        set: { gridSize, layers, updatedAt: new Date() },
      });
  } catch (err) {
    req.log.error({ err, foundryId: id }, "Failed to upsert foundry override");
    next(err);
    return;
  }

  res.json({
    ...foundry,
    gridSize,
    layers,
    hasOverride: true,
    defaults: { gridSize: foundry.gridSize, layers: foundry.layers },
  });
});

// DELETE /foundries/:id/override — remove custom rules, revert to YAML defaults
router.delete("/foundries/:id/override", requireOverrideKey, async (req, res, next): Promise<void> => {
  const id = String(req.params.id);

  const foundry = FOUNDRIES.find((f) => f.id === id);
  if (!foundry) {
    res.status(404).json({ error: `Unknown foundry: "${id}"` });
    return;
  }

  try {
    await db
      .delete(foundryOverridesTable)
      .where(eq(foundryOverridesTable.foundryId, id));
  } catch (err) {
    req.log.error({ err, foundryId: id }, "Failed to delete foundry override");
    next(err);
    return;
  }

  res.json({ ...foundry, hasOverride: false });
});

export default router;
