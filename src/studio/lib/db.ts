import { Pool } from "pg";

/**
 * Direct Postgres access for the custom studio admin — deliberately independent of
 * Payload. It talks to the same database Payload writes to, so the two can run side
 * by side during the migration; when the studio covers everything, Payload goes.
 *
 * A single Pool is cached on globalThis so Next's dev HMR doesn't open a new pool on
 * every reload.
 */
const connectionString = process.env.DATABASE_URI_POOLED || process.env.DATABASE_URI || "";
const needsSsl = /sslmode=require/.test(connectionString) || !/localhost|127\.0\.0\.1/.test(connectionString);

const globalForPool = globalThis as unknown as { studioPool?: Pool };

export const pool =
  globalForPool.studioPool ??
  new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") globalForPool.studioPool = pool;

/** Thin tagged helper: query<T>(`select ...`, [args]) → rows. */
export async function query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]> {
  const res = await pool.query(text, params as never[]);
  return res.rows as T[];
}
