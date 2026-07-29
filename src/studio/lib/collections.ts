import { pool, query } from "./db";
import type { Locale, TestimonialDoc, TestimonialFields, TestimonialListItem } from "./content-schema";

export type { TestimonialDoc, TestimonialFields, TestimonialListItem } from "./content-schema";

/**
 * CRUD for Payload collections over SQL. Collections are parent rows (with order
 * and _status) plus localized `*_locales` rows. Writes go straight to the main
 * tables (the published data the site reads); the drafts/versions tables are left
 * alone. `order` is a reserved word — always quoted "order".
 */

const LOCS: Locale[] = ["en", "ru", "he"];
const emptyT = (): TestimonialFields => ({ quote: "", name: "", company: "", role: "" });
const clip = (s: string) => (s ?? "").slice(0, 2000);

export async function listTestimonials(): Promise<TestimonialListItem[]> {
  const rows = await query<{ id: number; ord: string; name: string | null; company: string | null }>(
    `SELECT t.id, t."order" AS ord, l.name, l.company
       FROM testimonials t
       LEFT JOIN testimonials_locales l ON l._parent_id = t.id AND l._locale::text = 'ru'
      ORDER BY t."order" ASC, t.id ASC`,
  );
  return rows.map((r) => ({ id: r.id, order: Number(r.ord ?? 0), name: r.name ?? "", company: r.company ?? "" }));
}

export async function getTestimonial(id: number): Promise<TestimonialDoc | null> {
  const head = (await query<{ ord: string }>(`SELECT "order" AS ord FROM testimonials WHERE id=$1`, [id]))[0];
  if (!head) return null;
  const rows = await query<{ loc: string; quote: string | null; name: string | null; company: string | null; role: string | null }>(
    `SELECT _locale::text AS loc, quote, name, company, role FROM testimonials_locales WHERE _parent_id=$1`,
    [id],
  );
  const locales: Record<Locale, TestimonialFields> = { en: emptyT(), ru: emptyT(), he: emptyT() };
  for (const r of rows) {
    if (!(r.loc in locales)) continue;
    locales[r.loc as Locale] = { quote: r.quote ?? "", name: r.name ?? "", company: r.company ?? "", role: r.role ?? "" };
  }
  return { id, order: Number(head.ord ?? 0), locales };
}

export async function createTestimonial(): Promise<number> {
  const maxOrd = (await query<{ m: string }>(`SELECT COALESCE(MAX("order"), 0) AS m FROM testimonials`))[0]?.m ?? "0";
  const row = (await query<{ id: number }>(
    `INSERT INTO testimonials ("order", _status, updated_at, created_at) VALUES ($1, 'published', now(), now()) RETURNING id`,
    [Number(maxOrd) + 1],
  ))[0];
  for (const loc of LOCS) {
    await query(
      `INSERT INTO testimonials_locales (_parent_id, _locale, quote, name, company, role) VALUES ($1, $2::_locales, '', '', '', '')`,
      [row.id, loc],
    );
  }
  return row.id;
}

export async function updateTestimonial(doc: TestimonialDoc): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`UPDATE testimonials SET "order"=$1, updated_at=now() WHERE id=$2`, [doc.order || 0, doc.id]);
    for (const loc of LOCS) {
      const f = doc.locales[loc];
      await client.query(
        `INSERT INTO testimonials_locales (_parent_id, _locale, quote, name, company, role)
         VALUES ($1, $2::_locales, $3, $4, $5, $6)
         ON CONFLICT (_locale, _parent_id) DO UPDATE SET quote=EXCLUDED.quote, name=EXCLUDED.name, company=EXCLUDED.company, role=EXCLUDED.role`,
        [doc.id, loc, clip(f.quote), clip(f.name), clip(f.company), clip(f.role)],
      );
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function deleteTestimonial(id: number): Promise<void> {
  // Locales cascade; version rows are set-null. Main row removal unpublishes it.
  await query(`DELETE FROM testimonials WHERE id=$1`, [id]);
}
