import crypto from "crypto";
import { pool, query } from "./db";
import type {
  Locale,
  TestimonialDoc, TestimonialFields, TestimonialListItem,
  CaseDoc, CaseFields, CaseListItem,
  ServiceDoc, ServiceFields, ServiceBlock, ServiceLocaleData, ServiceListItem,
} from "./content-schema";

export type { TestimonialDoc, TestimonialFields, TestimonialListItem, CaseDoc, CaseFields, CaseListItem, ServiceDoc, ServiceListItem } from "./content-schema";

const genId = () => crypto.randomBytes(12).toString("hex");

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

/* ── Cases (portfolio) ──────────────────────────────── */

const emptyCaseFields = (): CaseFields => ({ title: "", tag: "", client: "", result: "", summary: "" });
const emptyCaseLoc = () => ({ fields: emptyCaseFields(), body: [] as string[], services: [] as string[] });

export async function listCases(): Promise<CaseListItem[]> {
  const rows = await query<{ id: number; slug: string; ord: string; title: string | null; tag: string | null }>(
    `SELECT c.id, c.slug, c."order" AS ord, l.title, l.tag
       FROM cases c
       LEFT JOIN cases_locales l ON l._parent_id = c.id AND l._locale::text = 'ru'
      ORDER BY c."order" ASC, c.id ASC`,
  );
  return rows.map((r) => ({ id: r.id, slug: r.slug, order: Number(r.ord ?? 0), title: r.title ?? "", tag: r.tag ?? "" }));
}

export async function getCase(id: number): Promise<CaseDoc | null> {
  const head = (await query<{ slug: string; ord: string }>(`SELECT slug, "order" AS ord FROM cases WHERE id=$1`, [id]))[0];
  if (!head) return null;
  const [locRows, bodyRows, svcRows] = await Promise.all([
    query<{ loc: string; title: string | null; tag: string | null; client: string | null; result: string | null; summary: string | null }>(
      `SELECT _locale::text AS loc, title, tag, client, result, summary FROM cases_locales WHERE _parent_id=$1`, [id]),
    query<{ loc: string; text: string | null }>(`SELECT _locale::text AS loc, text FROM cases_body WHERE _parent_id=$1 ORDER BY _locale, _order`, [id]),
    query<{ loc: string; text: string | null }>(`SELECT _locale::text AS loc, text FROM cases_services WHERE _parent_id=$1 ORDER BY _locale, _order`, [id]),
  ]);

  const locales: Record<Locale, ReturnType<typeof emptyCaseLoc>> = { en: emptyCaseLoc(), ru: emptyCaseLoc(), he: emptyCaseLoc() };
  for (const r of locRows) {
    if (!(r.loc in locales)) continue;
    locales[r.loc as Locale].fields = { title: r.title ?? "", tag: r.tag ?? "", client: r.client ?? "", result: r.result ?? "", summary: r.summary ?? "" };
  }
  for (const r of bodyRows) if (r.loc in locales && r.text) locales[r.loc as Locale].body.push(r.text);
  for (const r of svcRows) if (r.loc in locales && r.text) locales[r.loc as Locale].services.push(r.text);
  return { id, slug: head.slug, order: Number(head.ord ?? 0), locales };
}

export async function createCase(): Promise<number> {
  const slug = `case-${genId().slice(0, 8)}`;
  const maxOrd = (await query<{ m: string }>(`SELECT COALESCE(MAX("order"), 0) AS m FROM cases`))[0]?.m ?? "0";
  const row = (await query<{ id: number }>(
    `INSERT INTO cases (slug, "order", _status, updated_at, created_at) VALUES ($1, $2, 'published', now(), now()) RETURNING id`,
    [slug, Number(maxOrd) + 1],
  ))[0];
  for (const loc of LOCS) {
    await query(`INSERT INTO cases_locales (_parent_id, _locale, title, tag, client, result, summary) VALUES ($1, $2::_locales, '', '', '', '', '')`, [row.id, loc]);
  }
  return row.id;
}

/** Throws an Error with code 'SLUG_TAKEN' if the slug collides. */
export async function updateCase(doc: CaseDoc): Promise<void> {
  const slug = (doc.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || `case-${genId().slice(0, 8)}`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    try {
      await client.query(`UPDATE cases SET slug=$1, "order"=$2, updated_at=now() WHERE id=$3`, [slug, doc.order || 0, doc.id]);
    } catch (e) {
      if ((e as { code?: string })?.code === "23505") { const err = new Error("SLUG_TAKEN"); throw err; }
      throw e;
    }
    for (const loc of LOCS) {
      const d = doc.locales[loc];
      const f = d.fields;
      await client.query(
        `INSERT INTO cases_locales (_parent_id, _locale, title, tag, client, result, summary)
         VALUES ($1, $2::_locales, $3, $4, $5, $6, $7)
         ON CONFLICT (_locale, _parent_id) DO UPDATE SET title=EXCLUDED.title, tag=EXCLUDED.tag, client=EXCLUDED.client, result=EXCLUDED.result, summary=EXCLUDED.summary`,
        [doc.id, loc, clip(f.title), clip(f.tag), clip(f.client), clip(f.result), clip(f.summary)],
      );
      for (const [table, items] of [["cases_body", d.body], ["cases_services", d.services]] as const) {
        const clean = items.map((t) => clip(t).trim()).filter(Boolean).slice(0, 30);
        await client.query(`DELETE FROM ${table} WHERE _parent_id=$1 AND _locale::text=$2`, [doc.id, loc]);
        for (let i = 0; i < clean.length; i++) {
          await client.query(`INSERT INTO ${table} (id, _order, _parent_id, _locale, text) VALUES ($1, $2, $3, $4::_locales, $5)`, [genId(), i + 1, doc.id, loc, clean[i]]);
        }
      }
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function deleteCase(id: number): Promise<void> {
  await query(`DELETE FROM cases WHERE id=$1`, [id]);
}

/* ── Services (edit-only) ───────────────────────────── */
// Slug is bound to shipped routes, so it is read-only here and new/delete are not
// exposed. Blocks are a localized array with a nested list; both cascade-delete,
// so a locale's blocks are replaced wholesale on save.

const emptyServiceFields = (): ServiceFields => ({ label: "", h1: "", cta: "", indexTitle: "", indexTeaser: "", metaTitle: "", metaDescription: "" });
const emptyServiceLoc = (): ServiceLocaleData => ({ fields: emptyServiceFields(), body: [], blocks: [] });

export async function listServices(): Promise<ServiceListItem[]> {
  const rows = await query<{ id: number; slug: string; ord: string; label: string | null; h1: string | null }>(
    `SELECT s.id, s.slug, s."order" AS ord, l.label, l.h1
       FROM services s
       LEFT JOIN services_locales l ON l._parent_id = s.id AND l._locale::text = 'ru'
      ORDER BY s."order" ASC, s.id ASC`,
  );
  return rows.map((r) => ({ id: r.id, slug: r.slug, order: Number(r.ord ?? 0), label: r.label ?? "", h1: r.h1 ?? "" }));
}

export async function getService(id: number): Promise<ServiceDoc | null> {
  const head = (await query<{ slug: string; ord: string }>(`SELECT slug, "order" AS ord FROM services WHERE id=$1`, [id]))[0];
  if (!head) return null;

  const [locRows, bodyRows, blockRows, listRows] = await Promise.all([
    query<{ loc: string; label: string | null; h1: string | null; cta: string | null; index_title: string | null; index_teaser: string | null; meta_title: string | null; meta_description: string | null }>(
      `SELECT _locale::text AS loc, label, h1, cta, index_title, index_teaser, meta_title, meta_description FROM services_locales WHERE _parent_id=$1`, [id]),
    query<{ loc: string; text: string | null }>(`SELECT _locale::text AS loc, text FROM services_body WHERE _parent_id=$1 ORDER BY _locale, _order`, [id]),
    query<{ block_id: string; loc: string; heading: string | null; intro: string | null; ordered: boolean | null }>(
      `SELECT id AS block_id, _locale::text AS loc, heading, intro, ordered FROM services_blocks WHERE _parent_id=$1 ORDER BY _locale, _order`, [id]),
    query<{ block_id: string; text: string | null }>(
      `SELECT bl._parent_id AS block_id, bl.text FROM services_blocks_list bl JOIN services_blocks b ON b.id = bl._parent_id WHERE b._parent_id=$1 ORDER BY bl._order`, [id]),
  ]);

  const listByBlock: Record<string, string[]> = {};
  for (const r of listRows) { (listByBlock[r.block_id] ??= []).push(r.text ?? ""); }

  const locales: Record<Locale, ServiceLocaleData> = { en: emptyServiceLoc(), ru: emptyServiceLoc(), he: emptyServiceLoc() };
  for (const r of locRows) {
    if (!(r.loc in locales)) continue;
    locales[r.loc as Locale].fields = {
      label: r.label ?? "", h1: r.h1 ?? "", cta: r.cta ?? "",
      indexTitle: r.index_title ?? "", indexTeaser: r.index_teaser ?? "",
      metaTitle: r.meta_title ?? "", metaDescription: r.meta_description ?? "",
    };
  }
  for (const r of bodyRows) if (r.loc in locales && r.text) locales[r.loc as Locale].body.push(r.text);
  for (const r of blockRows) {
    if (!(r.loc in locales)) continue;
    locales[r.loc as Locale].blocks.push({ heading: r.heading ?? "", intro: r.intro ?? "", ordered: Boolean(r.ordered), list: listByBlock[r.block_id] ?? [] });
  }
  return { id, slug: head.slug, order: Number(head.ord ?? 0), locales };
}

export async function updateService(doc: ServiceDoc): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`UPDATE services SET "order"=$1, updated_at=now() WHERE id=$2`, [doc.order || 0, doc.id]);
    for (const loc of LOCS) {
      const d = doc.locales[loc];
      const f = d.fields;
      await client.query(
        `INSERT INTO services_locales (_parent_id, _locale, label, h1, cta, index_title, index_teaser, meta_title, meta_description)
         VALUES ($1, $2::_locales, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (_locale, _parent_id) DO UPDATE SET label=EXCLUDED.label, h1=EXCLUDED.h1, cta=EXCLUDED.cta,
           index_title=EXCLUDED.index_title, index_teaser=EXCLUDED.index_teaser, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description`,
        [doc.id, loc, clip(f.label), clip(f.h1), clip(f.cta), clip(f.indexTitle), clip(f.indexTeaser), clip(f.metaTitle), clip(f.metaDescription)],
      );

      // body list
      const body = d.body.map((t) => clip(t).trim()).filter(Boolean).slice(0, 30);
      await client.query(`DELETE FROM services_body WHERE _parent_id=$1 AND _locale::text=$2`, [doc.id, loc]);
      for (let i = 0; i < body.length; i++) {
        await client.query(`INSERT INTO services_body (id, _order, _parent_id, _locale, text) VALUES ($1,$2,$3,$4::_locales,$5)`, [genId(), i + 1, doc.id, loc, body[i]]);
      }

      // blocks (+ nested list) — delete cascades the nested list, then reinsert.
      const blocks = d.blocks.filter((b) => (b.heading ?? "").trim() || (b.list ?? []).some((x) => x.trim())).slice(0, 12);
      await client.query(`DELETE FROM services_blocks WHERE _parent_id=$1 AND _locale::text=$2`, [doc.id, loc]);
      for (let bi = 0; bi < blocks.length; bi++) {
        const b: ServiceBlock = blocks[bi];
        const blockId = genId();
        await client.query(
          `INSERT INTO services_blocks (id, _order, _parent_id, _locale, heading, intro, ordered) VALUES ($1,$2,$3,$4::_locales,$5,$6,$7)`,
          [blockId, bi + 1, doc.id, loc, clip(b.heading), clip(b.intro), Boolean(b.ordered)],
        );
        const items = (b.list ?? []).map((t) => clip(t).trim()).filter(Boolean).slice(0, 20);
        for (let li = 0; li < items.length; li++) {
          await client.query(`INSERT INTO services_blocks_list (id, _order, _parent_id, _locale, text) VALUES ($1,$2,$3,$4::_locales,$5)`, [genId(), li + 1, blockId, loc, items[li]]);
        }
      }
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
