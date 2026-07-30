import { pool } from "@/studio/lib/db";
import type { Locale } from "@/i18n/routing";

/**
 * Builds the next-intl message tree straight from Postgres — the same tree
 * `buildMessages` produced via Payload, so components need no changes. This is
 * what lets the site drop Payload as a read engine.
 *
 * Parity notes vs the Payload version:
 *  - Localized fields fall back to `en` when the locale value is null (Payload's
 *    fallbackLocale: "en"). Empty string counts as a value, not a fallback.
 *  - Text lists drop empty rows (Payload's `flat().filter(Boolean)`).
 *  - Images resolve to the requested size url, falling back to the main url.
 *  - We omit Payload's vestigial junk (nested row `id`s, raw `cardImages`) that no
 *    component reads; the parity check confirms only such junk differs.
 */

type Row = Record<string, unknown>;
const q = async (sql: string, params?: unknown[]): Promise<Row[]> => (await pool.query(sql, params as never[])).rows as Row[];
const s = (v: unknown): string => (v == null ? "" : String(v));
const flat = (rows: Row[], key = "text"): string[] => rows.map((r) => s(r[key])).filter(Boolean);

const SKIP = new Set(["id", "_locale", "_parent_id", "_order"]);

/** One localized row per table, with each null field coalesced to the en value. */
async function scalars(table: string, locale: Locale): Promise<Row> {
  const rows = await q(`SELECT * FROM "${table}" WHERE _locale::text = ANY($1::text[])`, [[locale, "en"]]);
  const loc = rows.find((r) => r._locale === locale) ?? {};
  const en = rows.find((r) => r._locale === "en") ?? {};
  const out: Row = {};
  for (const k of new Set([...Object.keys(en), ...Object.keys(loc)])) {
    if (SKIP.has(k)) continue;
    out[k] = (loc as Row)[k] ?? (en as Row)[k];
  }
  return out;
}

/** Localized list, whole-array fallback to en when the locale has no rows. */
async function list(table: string, locale: Locale, parentId?: number): Promise<Row[]> {
  const where = parentId != null ? `_parent_id=$2 AND ` : "";
  const p = parentId != null ? [locale, parentId] : [locale];
  const rows = await q(`SELECT * FROM "${table}" WHERE ${where}_locale::text=$1 ORDER BY _order`, p);
  if (rows.length) return rows;
  const pe = parentId != null ? ["en", parentId] : ["en"];
  return q(`SELECT * FROM "${table}" WHERE ${where}_locale::text=$1 ORDER BY _order`, pe);
}

export async function buildMessagesFromDb(locale: Locale) {
  // Media map for image resolution (small table, load once).
  const media = new Map<number, Row>();
  for (const m of await q(`SELECT id, url, sizes_thumb_url, sizes_card_url, sizes_hero_url FROM media`)) media.set(m.id as number, m);
  const img = (id: unknown, size: "card" | "hero" | "thumb"): string | undefined => {
    if (id == null) return undefined;
    const m = media.get(id as number);
    if (!m) return undefined;
    const sized = size === "hero" ? m.sizes_hero_url : size === "card" ? m.sizes_card_url : m.sizes_thumb_url;
    const url = (sized as string) || (m.url as string);
    return url || undefined;
  };

  const homeParent = (await q(`SELECT id, hero_bg_id, hero_bg_mobile_id FROM home ORDER BY id LIMIT 1`))[0] ?? {};
  const homeId = homeParent.id as number;

  const [nav, foot, home, lead, about, pf, tp, si, sr] = await Promise.all([
    scalars("nav_locales", locale),
    scalars("footer_locales", locale),
    scalars("home_locales", locale),
    scalars("lead_form_locales", locale),
    scalars("about_locales", locale),
    scalars("portfolio_page_locales", locale),
    scalars("testimonials_page_locales", locale),
    scalars("services_index_locales", locale),
    scalars("showreel_locales", locale),
  ]);

  const [footServices, rail, problem, svcItems, process, pfCases, results, pricing, faq, leadServices, caps, values, stats, cats, siStats, orbit, feats] = await Promise.all([
    list("footer_services", locale),
    list("home_rail_items", locale, homeId), list("home_problem_items", locale, homeId), list("home_services_items", locale, homeId),
    list("home_process_steps", locale, homeId), list("home_portfolio_cases", locale, homeId), list("home_results_items", locale, homeId),
    list("home_pricing_packages", locale, homeId), list("home_faq_items", locale, homeId), list("lead_form_services", locale),
    list("about_story_capabilities", locale), list("about_values_items", locale), list("about_stats_items", locale),
    list("portfolio_page_categories", locale), list("services_index_stats", locale), list("showreel_orbit", locale), list("showreel_feats", locale),
  ]);

  // Non-localized card images (paired to items/cases by _order).
  const svcCardImgs = await q(`SELECT image_id FROM home_services_card_images WHERE _parent_id=$1 ORDER BY _order`, [homeId]);
  const pfCardImgs = await q(`SELECT image_id FROM home_portfolio_card_images WHERE _parent_id=$1 ORDER BY _order`, [homeId]);

  // Deliverables per service item (localized, by item id).
  const svcItemIds = svcItems.map((i) => i.id as string);
  const delivRows = svcItemIds.length
    ? await q(`SELECT _parent_id, text FROM home_services_items_deliverables WHERE _parent_id = ANY($1::varchar[]) ORDER BY _order`, [svcItemIds])
    : [];
  const delivByItem = new Map<string, string[]>();
  for (const d of delivRows) { const a = delivByItem.get(d._parent_id as string) ?? []; if (s(d.text)) a.push(s(d.text)); delivByItem.set(d._parent_id as string, a); }

  // Pricing rows per package.
  const pkgIds = pricing.map((p) => p.id as string);
  const pkgRows = pkgIds.length
    ? await q(`SELECT _parent_id, name, extra FROM home_pricing_packages_rows WHERE _parent_id = ANY($1::varchar[]) ORDER BY _order`, [pkgIds])
    : [];
  const rowsByPkg = new Map<string, Row[]>();
  for (const r of pkgRows) { const a = rowsByPkg.get(r._parent_id as string) ?? []; a.push(r); rowsByPkg.set(r._parent_id as string, a); }

  // ── Collections ──
  const svcParents = await q(`SELECT id, slug, hero_id FROM services WHERE _status='published' ORDER BY "order" ASC, id ASC`);
  const Services: Record<string, unknown> = {};
  const indexItems: Record<string, unknown> = {};
  for (const sp of svcParents) {
    const sid = sp.id as number;
    const sl = await scalars2("services_locales", locale, sid);
    const body = flat(await list("services_body", locale, sid));
    // blocks (localized array) + their nested list
    let blocks = await q(`SELECT id, heading, intro, ordered FROM services_blocks WHERE _parent_id=$1 AND _locale::text=$2 ORDER BY _order`, [sid, locale]);
    if (!blocks.length) blocks = await q(`SELECT id, heading, intro, ordered FROM services_blocks WHERE _parent_id=$1 AND _locale::text='en' ORDER BY _order`, [sid]);
    const blockIds = blocks.map((b) => b.id as string);
    const blockListRows = blockIds.length ? await q(`SELECT _parent_id, text FROM services_blocks_list WHERE _parent_id = ANY($1::varchar[]) ORDER BY _order`, [blockIds]) : [];
    const listByBlock = new Map<string, string[]>();
    for (const r of blockListRows) { const a = listByBlock.get(r._parent_id as string) ?? []; if (s(r.text)) a.push(s(r.text)); listByBlock.set(r._parent_id as string, a); }
    Services[sp.slug as string] = {
      meta: { title: s(sl.meta_title), description: s(sl.meta_description) },
      label: s(sl.label), h1: s(sl.h1), body,
      blocks: blocks.map((b) => ({ heading: s(b.heading), intro: s(b.intro), ...(b.ordered ? { ordered: true } : {}), list: listByBlock.get(b.id as string) ?? [] })),
      cta: s(sl.cta), image: img(sp.hero_id, "hero"),
    };
    indexItems[sp.slug as string] = { title: s(sl.index_title), teaser: s(sl.index_teaser) };
  }

  const caseParents = await q(`SELECT id, slug, cover_id FROM cases WHERE _status='published' ORDER BY "order" ASC, id ASC`);
  const cases = [];
  for (const cp of caseParents) {
    const cid = cp.id as number;
    const cl = await scalars2("cases_locales", locale, cid);
    cases.push({
      title: s(cl.title), tag: s(cl.tag), client: s(cl.client), result: s(cl.result), summary: s(cl.summary),
      body: flat(await list("cases_body", locale, cid)), services: flat(await list("cases_services", locale, cid)),
      image: img(cp.cover_id, "hero"),
    });
  }

  const reviewParents = await q(`SELECT id FROM testimonials WHERE _status='published' ORDER BY "order" ASC, id ASC`);
  const reviews = [];
  for (const rp of reviewParents) {
    const rl = await scalars2("testimonials_locales", locale, rp.id as number);
    reviews.push({ quote: s(rl.quote), name: s(rl.name), company: s(rl.company), role: s(rl.role) });
  }

  return {
    Nav: { aboutUs: s(nav.about_us), services: s(nav.services), works: s(nav.works), pricing: s(nav.pricing), contacts: s(nav.contacts), callUs: s(nav.call_us), studio: s(nav.studio), language: s(nav.language) },
    Footer: {
      tagline: s(foot.tagline), servicesHead: s(foot.services_head), studioHead: s(foot.studio_head), about: s(foot.about), process: s(foot.process), works: s(foot.works), pricing: s(foot.pricing),
      contactsHead: s(foot.contacts_head), getBrief: s(foot.get_brief), fromIdea: s(foot.from_idea), rights: s(foot.rights), services: flat(footServices),
    },
    Home: {
      meta: { title: s(home.meta_title), description: s(home.meta_description) },
      hero: { kicker: s(home.hero_kicker), h1: s(home.hero_h1), desc: s(home.hero_desc), ctaPrimary: s(home.hero_cta_primary), ctaSecondary: s(home.hero_cta_secondary), bg: img(homeParent.hero_bg_id, "hero"), bgMobile: img(homeParent.hero_bg_mobile_id, "card") },
      rail: { head: s(home.rail_head), items: flat(rail) },
      problem: { label: s(home.problem_label), heading: s(home.problem_heading), items: problem.map((i) => ({ title: s(i.title), text: s(i.text) })) },
      services: {
        label: s(home.services_label), heading: s(home.services_heading), headingEm: s(home.services_heading_em), onSet: s(home.services_on_set), launch: s(home.services_launch), all: s(home.services_all),
        items: svcItems.map((i, idx) => ({ title: s(i.title), text: s(i.text), deliverables: delivByItem.get(i.id as string) ?? [], image: img(svcCardImgs[idx]?.image_id, "card") })),
      },
      process: { label: s(home.process_label), heading: s(home.process_heading), headingEm: s(home.process_heading_em), steps: process.map((p) => ({ name: s(p.name), desc: s(p.desc) })) },
      statement: { eyebrow: s(home.statement_eyebrow), line1: s(home.statement_line1), line1Em: s(home.statement_line1_em), line2: s(home.statement_line2), systems: s(home.statement_systems), cta: s(home.statement_cta) },
      portfolio: {
        label: s(home.portfolio_label), heading: s(home.portfolio_heading), ctaStart: s(home.portfolio_cta_start), ctaAll: s(home.portfolio_cta_all),
        cases: pfCases.map((c, idx) => ({ title: s(c.title), tag: s(c.tag), image: img(pfCardImgs[idx]?.image_id, "card") })),
      },
      results: { label: s(home.results_label), heading: s(home.results_heading), headingEm: s(home.results_heading_em), items: results.map((r) => ({ label: s(r.label) })) },
      pricing: {
        label: s(home.pricing_label), heading: s(home.pricing_heading), headingEm: s(home.pricing_heading_em), popular: s(home.pricing_popular), getStarted: s(home.pricing_get_started),
        packages: pricing.map((p) => ({ name: s(p.name), tag: s(p.tag), price: s(p.price), priceOld: s(p.price_old), time: s(p.time), rows: (rowsByPkg.get(p.id as string) ?? []).map((r) => ({ name: s(r.name), ...(r.extra != null ? { extra: s(r.extra) } : {}) })) })),
      },
      faq: { label: s(home.faq_label), heading: s(home.faq_heading), headingEm: s(home.faq_heading_em), items: faq.map((f) => ({ q: s(f.q), a: s(f.a) })) },
      lead: { badge: s(home.lead_badge), heading: s(home.lead_heading), headingEm: s(home.lead_heading_em), sub: s(home.lead_sub), emailLabel: s(home.lead_email_label) },
    },
    LeadForm: {
      title: s(lead.title), trust: s(lead.trust), name: s(lead.name), phone: s(lead.phone), email: s(lead.email), city: s(lead.city), business: s(lead.business), businessPlaceholder: s(lead.business_placeholder),
      interestedIn: s(lead.interested_in), notSure: s(lead.not_sure), whatsappOptIn: s(lead.whatsapp_opt_in), submit: s(lead.submit), sending: s(lead.sending), success: s(lead.success), errorRequired: s(lead.error_required), errorSend: s(lead.error_send),
      services: flat(leadServices),
    },
    About: {
      meta: { title: s(about.meta_title), description: s(about.meta_description) },
      hero: { label: s(about.hero_label), heading: s(about.hero_heading), headingEm: s(about.hero_heading_em), sub: s(about.hero_sub) },
      story: { label: s(about.story_label), heading: s(about.story_heading), p1: s(about.story_p1), p2: s(about.story_p2), slogan: s(about.story_slogan), capabilities: flat(caps) },
      values: { label: s(about.values_label), heading: s(about.values_heading), headingEm: s(about.values_heading_em), items: values.map((v) => ({ title: s(v.title), desc: s(v.desc) })) },
      stats: { label: s(about.stats_label), heading: s(about.stats_heading), headingEm: s(about.stats_heading_em), items: stats.map((st) => ({ label: s(st.label) })) },
      cta: { label: s(about.cta_label), heading: s(about.cta_heading), headingEm: s(about.cta_heading_em), sub: s(about.cta_sub), ctaBrief: s(about.cta_cta_brief), ctaWorks: s(about.cta_cta_works) },
    },
    Portfolio: {
      meta: { title: s(pf.meta_title), description: s(pf.meta_description) },
      hero: { label: s(pf.hero_label), heading: s(pf.hero_heading), headingEm: s(pf.hero_heading_em), sub: s(pf.hero_sub) },
      categories: flat(cats),
      cases,
      cta: { label: s(pf.cta_label), heading: s(pf.cta_heading), headingEm: s(pf.cta_heading_em), ctaBrief: s(pf.cta_cta_brief), ctaAbout: s(pf.cta_cta_about) },
      ui: { back: s(pf.ui_back), overview: s(pf.ui_overview), clientLabel: s(pf.ui_client_label), resultLabel: s(pf.ui_result_label), servicesLabel: s(pf.ui_services_label), cta: s(pf.ui_cta), ctaAll: s(pf.ui_cta_all), next: s(pf.ui_next) },
    },
    Testimonials: {
      meta: { title: s(tp.meta_title), description: s(tp.meta_description) },
      hero: { label: s(tp.hero_label), heading: s(tp.hero_heading), headingEm: s(tp.hero_heading_em), sub: s(tp.hero_sub) },
      featuredLabel: s(tp.featured_label),
      all: { label: s(tp.all_label), heading: s(tp.all_heading), headingEm: s(tp.all_heading_em) },
      reviews,
      cta: { label: s(tp.cta_label), heading: s(tp.cta_heading), headingEm: s(tp.cta_heading_em), ctaBrief: s(tp.cta_cta_brief) },
    },
    Services,
    ServicesIndex: {
      meta: { title: s(si.meta_title), description: s(si.meta_description) },
      label: s(si.label), h1: s(si.h1), sub: s(si.sub), more: s(si.more), items: indexItems, stats: flat(siStats),
      cta: { heading: s(si.cta_heading), text: s(si.cta_text), btn: s(si.cta_btn) }, other: s(si.other),
    },
    Showreel: {
      label: s(sr.label), heading: s(sr.heading), headingEm: s(sr.heading_em), play: s(sr.play), trigger: s(sr.trigger), book: s(sr.book), lead: s(sr.lead), close: s(sr.close),
      orbit: flat(orbit), feats: feats.map((f) => ({ t: s(f.t), s: s(f.s), d: s(f.d) })),
    },
  };
}

/** Collection-locale scalars (parent-scoped), with en fallback. */
async function scalars2(table: string, locale: Locale, parentId: number): Promise<Row> {
  const rows = await q(`SELECT * FROM "${table}" WHERE _parent_id=$1 AND _locale::text = ANY($2::text[])`, [parentId, [locale, "en"]]);
  const loc = rows.find((r) => r._locale === locale) ?? {};
  const en = rows.find((r) => r._locale === "en") ?? {};
  const out: Row = {};
  for (const k of new Set([...Object.keys(en), ...Object.keys(loc)])) {
    if (SKIP.has(k)) continue;
    out[k] = (loc as Row)[k] ?? (en as Row)[k];
  }
  return out;
}
