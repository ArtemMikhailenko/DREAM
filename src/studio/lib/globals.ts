import crypto from "crypto";
import { pool, query } from "./db";
import type { Locale } from "./content-schema";
import type { GlobalContent, GlobalLocaleData } from "./globals-schema";

export type { GlobalContent } from "./globals-schema";

/**
 * Generic read/write for the simple "page" globals. Each spec maps a global's
 * parent + locales tables and its list sub-tables to studio keys. All SQL
 * identifiers are quoted so reserved column names (order, trigger, desc…) are
 * safe. Client code must never import this file (it pulls pg) — see globals-schema.
 */

const LOCS: Locale[] = ["en", "ru", "he"];
const genId = () => crypto.randomBytes(12).toString("hex");
const clip = (s: string) => (s ?? "").slice(0, 2000);

type ColMap = { col: string; key: string };
type ListSpec = { id: string; table: string; kind: "string" | "object"; cols: ColMap[] };
type GlobalSpec = { table: string; localesTable: string; cols: ColMap[]; lists: ListSpec[] };

const cols = (pairs: [string, string][]): ColMap[] => pairs.map(([col, key]) => ({ col, key }));

const SPECS: Record<string, GlobalSpec> = {
  "services-index": {
    table: "services_index",
    localesTable: "services_index_locales",
    cols: cols([["meta_title", "metaTitle"], ["meta_description", "metaDescription"], ["label", "label"], ["h1", "h1"], ["sub", "sub"], ["more", "more"], ["other", "other"], ["cta_heading", "ctaHeading"], ["cta_text", "ctaText"], ["cta_btn", "ctaBtn"]]),
    lists: [{ id: "stats", table: "services_index_stats", kind: "string", cols: cols([["text", "text"]]) }],
  },
  "portfolio-page": {
    table: "portfolio_page",
    localesTable: "portfolio_page_locales",
    cols: cols([["meta_title", "metaTitle"], ["meta_description", "metaDescription"], ["hero_label", "heroLabel"], ["hero_heading", "heroHeading"], ["hero_heading_em", "heroHeadingEm"], ["hero_sub", "heroSub"], ["cta_label", "ctaLabel"], ["cta_heading", "ctaHeading"], ["cta_heading_em", "ctaHeadingEm"], ["cta_cta_brief", "ctaCtaBrief"], ["cta_cta_about", "ctaCtaAbout"], ["ui_back", "uiBack"], ["ui_overview", "uiOverview"], ["ui_next", "uiNext"], ["ui_client_label", "uiClientLabel"], ["ui_result_label", "uiResultLabel"], ["ui_services_label", "uiServicesLabel"], ["ui_cta", "uiCta"], ["ui_cta_all", "uiCtaAll"]]),
    lists: [{ id: "categories", table: "portfolio_page_categories", kind: "string", cols: cols([["text", "text"]]) }],
  },
  "testimonials-page": {
    table: "testimonials_page",
    localesTable: "testimonials_page_locales",
    cols: cols([["meta_title", "metaTitle"], ["meta_description", "metaDescription"], ["hero_label", "heroLabel"], ["hero_heading", "heroHeading"], ["hero_heading_em", "heroHeadingEm"], ["hero_sub", "heroSub"], ["featured_label", "featuredLabel"], ["all_label", "allLabel"], ["all_heading", "allHeading"], ["all_heading_em", "allHeadingEm"], ["cta_label", "ctaLabel"], ["cta_heading", "ctaHeading"], ["cta_heading_em", "ctaHeadingEm"], ["cta_cta_brief", "ctaCtaBrief"]]),
    lists: [],
  },
  showreel: {
    table: "showreel",
    localesTable: "showreel_locales",
    cols: cols([["label", "label"], ["heading", "heading"], ["heading_em", "headingEm"], ["lead", "lead"], ["trigger", "trigger"], ["book", "book"], ["play", "play"], ["close", "close"]]),
    lists: [
      { id: "orbit", table: "showreel_orbit", kind: "string", cols: cols([["text", "text"]]) },
      { id: "feats", table: "showreel_feats", kind: "object", cols: cols([["t", "t"], ["s", "s"], ["d", "d"]]) },
    ],
  },
};

export function isGlobalKey(key: string): boolean {
  return key in SPECS;
}

const emptyLoc = (spec: GlobalSpec): GlobalLocaleData => ({
  fields: Object.fromEntries(spec.cols.map((c) => [c.key, ""])),
  lists: Object.fromEntries(spec.lists.map((l) => [l.id, [] as string[] | Record<string, string>[]])),
});

export async function getGlobal(key: string): Promise<GlobalContent | null> {
  const spec = SPECS[key];
  if (!spec) return null;

  const colSql = spec.cols.map((c) => `"${c.col}"`).join(", ");
  const locRows = await query<Record<string, unknown>>(`SELECT _locale::text AS loc, ${colSql} FROM "${spec.localesTable}"`);

  const out = { en: emptyLoc(spec), ru: emptyLoc(spec), he: emptyLoc(spec) } as GlobalContent;
  for (const r of locRows) {
    const loc = r.loc as Locale;
    if (!(loc in out)) continue;
    for (const c of spec.cols) out[loc].fields[c.key] = (r[c.col] as string) ?? "";
  }

  for (const list of spec.lists) {
    const lc = list.cols.map((c) => `"${c.col}"`).join(", ");
    const rows = await query<Record<string, unknown>>(`SELECT _locale::text AS loc, ${lc} FROM "${list.table}" ORDER BY _locale, _order`);
    for (const r of rows) {
      const loc = r.loc as Locale;
      if (!(loc in out)) continue;
      if (list.kind === "string") {
        (out[loc].lists[list.id] as string[]).push((r[list.cols[0].col] as string) ?? "");
      } else {
        (out[loc].lists[list.id] as Record<string, string>[]).push(
          Object.fromEntries(list.cols.map((c) => [c.key, (r[c.col] as string) ?? ""])),
        );
      }
    }
  }
  return out;
}

export async function saveGlobal(key: string, content: GlobalContent): Promise<void> {
  const spec = SPECS[key];
  if (!spec) throw new Error("unknown global");
  const parent = (await query<{ id: number }>(`SELECT id FROM "${spec.table}" ORDER BY id LIMIT 1`))[0];
  if (!parent) throw new Error(`${spec.table} parent row missing`);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const loc of LOCS) {
      const data = content[loc];
      const setSql = spec.cols.map((c, i) => `"${c.col}"=$${i + 1}`).join(", ");
      const vals = spec.cols.map((c) => clip(data.fields[c.key] ?? ""));
      await client.query(
        `UPDATE "${spec.localesTable}" SET ${setSql} WHERE _parent_id=$${spec.cols.length + 1} AND _locale::text=$${spec.cols.length + 2}`,
        [...vals, parent.id, loc],
      );

      for (const list of spec.lists) {
        await client.query(`DELETE FROM "${list.table}" WHERE _parent_id=$1 AND _locale::text=$2`, [parent.id, loc]);
        const items = (data.lists[list.id] ?? []) as (string | Record<string, string>)[];
        const colNames = list.cols.map((c) => `"${c.col}"`).join(", ");
        const ph = list.cols.map((_, i) => `$${5 + i}`).join(", ");
        let order = 1;
        for (const item of items.slice(0, 30)) {
          const rowVals = list.kind === "string"
            ? [clip(String(item)).trim()]
            : list.cols.map((c) => clip(String((item as Record<string, string>)[c.key] ?? "")).trim());
          if (rowVals.every((v) => !v)) continue;
          await client.query(
            `INSERT INTO "${list.table}" (id, _order, _parent_id, _locale, ${colNames}) VALUES ($1, $2, $3, $4::_locales, ${ph})`,
            [genId(), order++, parent.id, loc, ...rowVals],
          );
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
