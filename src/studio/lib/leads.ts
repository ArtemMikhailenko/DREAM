import { query } from "./db";
import type { Lead, LeadStatus } from "./leads-schema";

// Types and STATUSES live in ./leads-schema (client-safe) — re-exported here for
// server callers. Client components must import them from the schema directly.
export { STATUSES } from "./leads-schema";
export type { Lead, LeadStatus } from "./leads-schema";

const COLS =
  "id, name, phone, email, city, business, service, status, note, page, locale, whatsapp_opt_in, utm, crm_forwarded, created_at, updated_at";

/** Newest first; optional status filter. */
export async function listLeads(status?: LeadStatus): Promise<Lead[]> {
  if (status) {
    return query<Lead>(`SELECT ${COLS} FROM leads WHERE status::text = $1 ORDER BY created_at DESC`, [status]);
  }
  return query<Lead>(`SELECT ${COLS} FROM leads ORDER BY created_at DESC`);
}

/** Count per status, plus a total — drives the filter tabs and the dashboard. */
export async function countByStatus(): Promise<Record<string, number> & { total: number }> {
  const rows = await query<{ status: string | null; n: string }>(
    `SELECT status, count(*)::int AS n FROM leads GROUP BY status`,
  );
  const out: Record<string, number> & { total: number } = { total: 0 } as never;
  for (const r of rows) {
    const key = r.status ?? "new";
    out[key] = (out[key] ?? 0) + Number(r.n);
    out.total += Number(r.n);
  }
  return out;
}

export async function getLead(id: number): Promise<Lead | null> {
  const rows = await query<Lead>(`SELECT ${COLS} FROM leads WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ?? null;
}

export async function setStatus(id: number, status: LeadStatus): Promise<void> {
  await query(`UPDATE leads SET status = $1::enum_leads_status, updated_at = now() WHERE id = $2`, [status, id]);
}

export async function setNote(id: number, note: string): Promise<void> {
  await query(`UPDATE leads SET note = $1, updated_at = now() WHERE id = $2`, [note, id]);
}
