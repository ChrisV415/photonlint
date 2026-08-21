import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Log idle client errors instead of letting them crash the process.
// These occur when a pooled connection is dropped by the server (e.g. network
// blip, DB restart) and a client tries to reuse it.
pool.on("error", (err) => {
  console.error("[db] Idle client error:", err.message);
});

export const db = drizzle(pool, { schema });

export * from "./schema";
