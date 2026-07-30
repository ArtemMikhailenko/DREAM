import crypto from "crypto";
import { pool, query } from "./db";
import type {
  Locale,
  NavFields,
  NavContent,
  FooterFields,
  FooterContent,
  LeadFormFields,
  LeadFormContent,
  AboutFields,
  AboutContent,
  HomeFields,
  HomeContent,
  HomeImages,
} from "./content-schema";

/**
 * Server-only read/write for Payload's localized globals, straight over SQL.
 * A global is a parent row plus one `*_locales` row per language (en/ru/he), with
 * list fields in ordered sub-tables. Writes bypass Payload, so callers must
 * revalidate the affected routes themselves.
 *
 * Types and UI field descriptors live in ./content-schema (client-safe) and are
 * re-exported here for server consumers.
 */
export * from "./content-schema";

/* ── Navigation ─────────────────────────────────────── */

type NavRow = {
  loc: string;
  about_us: string | null;
  services: string | null;
  works: string | null;
  pricing: string | null;
  contacts: string | null;
  call_us: string | null;
  studio: string | null;
  language: string | null;
};

const emptyNav = (): NavFields => ({
  aboutUs: "", services: "", works: "", pricing: "", contacts: "", callUs: "", studio: "", language: "",
});

export async function getNav(): Promise<NavContent> {
  const rows = await query<NavRow>(
    `SELECT _locale::text AS loc, about_us, services, works, pricing, contacts, call_us, studio, language FROM nav_locales`,
  );
  const out: NavContent = { en: emptyNav(), ru: emptyNav(), he: emptyNav() };
  for (const r of rows) {
    if (!(r.loc in out)) continue;
    out[r.loc as Locale] = {
      aboutUs: r.about_us ?? "",
      services: r.services ?? "",
      works: r.works ?? "",
      pricing: r.pricing ?? "",
      contacts: r.contacts ?? "",
      callUs: r.call_us ?? "",
      studio: r.studio ?? "",
      language: r.language ?? "",
    };
  }
  return out;
}

export async function saveNav(content: NavContent): Promise<void> {
  const parent = (await query<{ id: number }>(`SELECT id FROM nav ORDER BY id LIMIT 1`))[0];
  if (!parent) throw new Error("nav parent row missing");
  const clip = (s: string) => (s ?? "").slice(0, 300);
  for (const loc of ["en", "ru", "he"] as Locale[]) {
    const f = content[loc];
    await query(
      `UPDATE nav_locales
         SET about_us=$1, services=$2, works=$3, pricing=$4, contacts=$5, call_us=$6, studio=$7, language=$8
       WHERE _parent_id=$9 AND _locale::text=$10`,
      [clip(f.aboutUs), clip(f.services), clip(f.works), clip(f.pricing), clip(f.contacts), clip(f.callUs), clip(f.studio), clip(f.language), parent.id, loc],
    );
  }
}

/* ── Footer ─────────────────────────────────────────── */

type FooterLocRow = {
  loc: string;
  tagline: string | null;
  services_head: string | null;
  studio_head: string | null;
  about: string | null;
  process: string | null;
  works: string | null;
  pricing: string | null;
  contacts_head: string | null;
  get_brief: string | null;
  from_idea: string | null;
  rights: string | null;
};

const emptyFooterFields = (): FooterFields => ({
  tagline: "", servicesHead: "", studioHead: "", about: "", process: "", works: "", pricing: "",
  contactsHead: "", getBrief: "", fromIdea: "", rights: "",
});

export async function getFooter(): Promise<FooterContent> {
  const [locRows, svcRows] = await Promise.all([
    query<FooterLocRow>(
      `SELECT _locale::text AS loc, tagline, services_head, studio_head, about, process, works, pricing, contacts_head, get_brief, from_idea, rights
         FROM footer_locales`,
    ),
    query<{ loc: string; text: string | null }>(
      `SELECT _locale::text AS loc, text FROM footer_services ORDER BY _locale, _order`,
    ),
  ]);

  const out: FooterContent = {
    en: { fields: emptyFooterFields(), services: [] },
    ru: { fields: emptyFooterFields(), services: [] },
    he: { fields: emptyFooterFields(), services: [] },
  };
  for (const r of locRows) {
    if (!(r.loc in out)) continue;
    out[r.loc as Locale].fields = {
      tagline: r.tagline ?? "",
      servicesHead: r.services_head ?? "",
      studioHead: r.studio_head ?? "",
      about: r.about ?? "",
      process: r.process ?? "",
      works: r.works ?? "",
      pricing: r.pricing ?? "",
      contactsHead: r.contacts_head ?? "",
      getBrief: r.get_brief ?? "",
      fromIdea: r.from_idea ?? "",
      rights: r.rights ?? "",
    };
  }
  for (const r of svcRows) {
    if (!(r.loc in out)) continue;
    if (r.text) out[r.loc as Locale].services.push(r.text);
  }
  return out;
}

/** 24-char hex id in the ObjectId style Payload uses for array rows. */
const genId = () => crypto.randomBytes(12).toString("hex");

export async function saveFooter(content: FooterContent): Promise<void> {
  const parent = (await query<{ id: number }>(`SELECT id FROM footer ORDER BY id LIMIT 1`))[0];
  if (!parent) throw new Error("footer parent row missing");
  const clip = (s: string) => (s ?? "").slice(0, 400);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const loc of ["en", "ru", "he"] as Locale[]) {
      const f = content[loc].fields;
      await client.query(
        `UPDATE footer_locales
           SET tagline=$1, services_head=$2, studio_head=$3, about=$4, process=$5, works=$6, pricing=$7,
               contacts_head=$8, get_brief=$9, from_idea=$10, rights=$11
         WHERE _parent_id=$12 AND _locale::text=$13`,
        [clip(f.tagline), clip(f.servicesHead), clip(f.studioHead), clip(f.about), clip(f.process), clip(f.works), clip(f.pricing), clip(f.contactsHead), clip(f.getBrief), clip(f.fromIdea), clip(f.rights), parent.id, loc],
      );

      // Replace the services list for this locale (delete + reinsert with fresh order).
      const items = content[loc].services.map((t) => clip(t).trim()).filter(Boolean).slice(0, 12);
      await client.query(`DELETE FROM footer_services WHERE _parent_id=$1 AND _locale::text=$2`, [parent.id, loc]);
      for (let i = 0; i < items.length; i++) {
        await client.query(
          `INSERT INTO footer_services (id, _order, _parent_id, _locale, text) VALUES ($1, $2, $3, $4::_locales, $5)`,
          [genId(), i + 1, parent.id, loc, items[i]],
        );
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

/* ── Lead form ──────────────────────────────────────── */

type LeadFormRow = Record<string, string | null> & { loc: string };

const emptyLeadForm = (): LeadFormFields => ({
  title: "", trust: "", name: "", phone: "", email: "", city: "", business: "", businessPlaceholder: "",
  interestedIn: "", notSure: "", whatsappOptIn: "", submit: "", sending: "", success: "", errorRequired: "", errorSend: "",
});

export async function getLeadForm(): Promise<LeadFormContent> {
  const [locRows, svcRows] = await Promise.all([
    query<LeadFormRow>(
      `SELECT _locale::text AS loc, title, trust, name, phone, email, city, business, business_placeholder,
              interested_in, not_sure, whatsapp_opt_in, submit, sending, success, error_required, error_send
         FROM lead_form_locales`,
    ),
    query<{ loc: string; text: string | null }>(
      `SELECT _locale::text AS loc, text FROM lead_form_services ORDER BY _locale, _order`,
    ),
  ]);

  const out: LeadFormContent = {
    en: { fields: emptyLeadForm(), services: [] },
    ru: { fields: emptyLeadForm(), services: [] },
    he: { fields: emptyLeadForm(), services: [] },
  };
  for (const r of locRows) {
    if (!(r.loc in out)) continue;
    out[r.loc as Locale].fields = {
      title: r.title ?? "", trust: r.trust ?? "", name: r.name ?? "", phone: r.phone ?? "", email: r.email ?? "",
      city: r.city ?? "", business: r.business ?? "", businessPlaceholder: r.business_placeholder ?? "",
      interestedIn: r.interested_in ?? "", notSure: r.not_sure ?? "", whatsappOptIn: r.whatsapp_opt_in ?? "",
      submit: r.submit ?? "", sending: r.sending ?? "", success: r.success ?? "",
      errorRequired: r.error_required ?? "", errorSend: r.error_send ?? "",
    };
  }
  for (const r of svcRows) {
    if (r.loc in out && r.text != null) out[r.loc as Locale].services.push(r.text);
  }
  return out;
}

export async function saveLeadForm(content: LeadFormContent): Promise<void> {
  const parent = (await query<{ id: number }>(`SELECT id FROM lead_form ORDER BY id LIMIT 1`))[0];
  if (!parent) throw new Error("lead_form parent row missing");
  const clip = (s: string) => (s ?? "").slice(0, 600);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const loc of ["en", "ru", "he"] as Locale[]) {
      const f = content[loc].fields;
      await client.query(
        `UPDATE lead_form_locales
           SET title=$1, trust=$2, name=$3, phone=$4, email=$5, city=$6, business=$7, business_placeholder=$8,
               interested_in=$9, not_sure=$10, whatsapp_opt_in=$11, submit=$12, sending=$13, success=$14,
               error_required=$15, error_send=$16
         WHERE _parent_id=$17 AND _locale::text=$18`,
        [clip(f.title), clip(f.trust), clip(f.name), clip(f.phone), clip(f.email), clip(f.city), clip(f.business),
         clip(f.businessPlaceholder), clip(f.interestedIn), clip(f.notSure), clip(f.whatsappOptIn), clip(f.submit),
         clip(f.sending), clip(f.success), clip(f.errorRequired), clip(f.errorSend), parent.id, loc],
      );
      // Services: order & count are fixed (page preselection depends on position),
      // so update text in place by _order rather than replacing rows.
      const items = content[loc].services;
      for (let i = 0; i < items.length; i++) {
        await client.query(
          `UPDATE lead_form_services SET text=$1 WHERE _parent_id=$2 AND _locale::text=$3 AND _order=$4`,
          [clip(items[i]), parent.id, loc, i + 1],
        );
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

/* ── About ──────────────────────────────────────────── */

// `desc` is a reserved SQL word — always quote it as "desc".
type AboutLocRow = Record<string, string | null> & { loc: string };

const emptyAbout = (): AboutFields => ({
  metaTitle: "", metaDescription: "", heroLabel: "", heroHeading: "", heroHeadingEm: "", heroSub: "",
  storyLabel: "", storyHeading: "", storyP1: "", storyP2: "", storySlogan: "",
  valuesLabel: "", valuesHeading: "", valuesHeadingEm: "",
  statsLabel: "", statsHeading: "", statsHeadingEm: "",
  ctaLabel: "", ctaHeading: "", ctaHeadingEm: "", ctaSub: "", ctaCtaBrief: "", ctaCtaWorks: "",
});

export async function getAbout(): Promise<AboutContent> {
  const [locRows, capRows, valRows, statRows] = await Promise.all([
    query<AboutLocRow>(
      `SELECT _locale::text AS loc, meta_title, meta_description, hero_label, hero_heading, hero_heading_em, hero_sub,
              story_label, story_heading, story_p1, story_p2, story_slogan,
              values_label, values_heading, values_heading_em, stats_label, stats_heading, stats_heading_em,
              cta_label, cta_heading, cta_heading_em, cta_sub, cta_cta_brief, cta_cta_works
         FROM about_locales`,
    ),
    query<{ loc: string; text: string | null }>(`SELECT _locale::text AS loc, text FROM about_story_capabilities ORDER BY _locale, _order`),
    query<{ loc: string; title: string | null; desc: string | null }>(`SELECT _locale::text AS loc, title, "desc" FROM about_values_items ORDER BY _locale, _order`),
    query<{ loc: string; label: string | null }>(`SELECT _locale::text AS loc, label FROM about_stats_items ORDER BY _locale, _order`),
  ]);

  const mk = (): AboutContent[Locale] => ({ fields: emptyAbout(), capabilities: [], values: [], stats: [] });
  const out: AboutContent = { en: mk(), ru: mk(), he: mk() };

  for (const r of locRows) {
    if (!(r.loc in out)) continue;
    out[r.loc as Locale].fields = {
      metaTitle: r.meta_title ?? "", metaDescription: r.meta_description ?? "",
      heroLabel: r.hero_label ?? "", heroHeading: r.hero_heading ?? "", heroHeadingEm: r.hero_heading_em ?? "", heroSub: r.hero_sub ?? "",
      storyLabel: r.story_label ?? "", storyHeading: r.story_heading ?? "", storyP1: r.story_p1 ?? "", storyP2: r.story_p2 ?? "", storySlogan: r.story_slogan ?? "",
      valuesLabel: r.values_label ?? "", valuesHeading: r.values_heading ?? "", valuesHeadingEm: r.values_heading_em ?? "",
      statsLabel: r.stats_label ?? "", statsHeading: r.stats_heading ?? "", statsHeadingEm: r.stats_heading_em ?? "",
      ctaLabel: r.cta_label ?? "", ctaHeading: r.cta_heading ?? "", ctaHeadingEm: r.cta_heading_em ?? "", ctaSub: r.cta_sub ?? "", ctaCtaBrief: r.cta_cta_brief ?? "", ctaCtaWorks: r.cta_cta_works ?? "",
    };
  }
  for (const r of capRows) if (r.loc in out && r.text) out[r.loc as Locale].capabilities.push(r.text);
  for (const r of valRows) if (r.loc in out) out[r.loc as Locale].values.push({ title: r.title ?? "", desc: r.desc ?? "" });
  for (const r of statRows) if (r.loc in out) out[r.loc as Locale].stats.push(r.label ?? "");
  return out;
}

export async function saveAbout(content: AboutContent): Promise<void> {
  const parent = (await query<{ id: number }>(`SELECT id FROM about ORDER BY id LIMIT 1`))[0];
  if (!parent) throw new Error("about parent row missing");
  const clip = (s: string) => (s ?? "").slice(0, 800);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const loc of ["en", "ru", "he"] as Locale[]) {
      const d = content[loc];
      const f = d.fields;
      await client.query(
        `UPDATE about_locales SET
           meta_title=$1, meta_description=$2, hero_label=$3, hero_heading=$4, hero_heading_em=$5, hero_sub=$6,
           story_label=$7, story_heading=$8, story_p1=$9, story_p2=$10, story_slogan=$11,
           values_label=$12, values_heading=$13, values_heading_em=$14,
           stats_label=$15, stats_heading=$16, stats_heading_em=$17,
           cta_label=$18, cta_heading=$19, cta_heading_em=$20, cta_sub=$21, cta_cta_brief=$22, cta_cta_works=$23
         WHERE _parent_id=$24 AND _locale::text=$25`,
        [clip(f.metaTitle), clip(f.metaDescription), clip(f.heroLabel), clip(f.heroHeading), clip(f.heroHeadingEm), clip(f.heroSub),
         clip(f.storyLabel), clip(f.storyHeading), clip(f.storyP1), clip(f.storyP2), clip(f.storySlogan),
         clip(f.valuesLabel), clip(f.valuesHeading), clip(f.valuesHeadingEm),
         clip(f.statsLabel), clip(f.statsHeading), clip(f.statsHeadingEm),
         clip(f.ctaLabel), clip(f.ctaHeading), clip(f.ctaHeadingEm), clip(f.ctaSub), clip(f.ctaCtaBrief), clip(f.ctaCtaWorks),
         parent.id, loc],
      );

      // capabilities (free list) — replace.
      const caps = d.capabilities.map((t) => clip(t).trim()).filter(Boolean).slice(0, 20);
      await client.query(`DELETE FROM about_story_capabilities WHERE _parent_id=$1 AND _locale::text=$2`, [parent.id, loc]);
      for (let i = 0; i < caps.length; i++) {
        await client.query(
          `INSERT INTO about_story_capabilities (id, _order, _parent_id, _locale, text) VALUES ($1, $2, $3, $4::_locales, $5)`,
          [genId(), i + 1, parent.id, loc, caps[i]],
        );
      }

      // values (free list of title + desc) — replace.
      const vals = d.values.map((v) => ({ title: clip(v.title).trim(), desc: clip(v.desc).trim() })).filter((v) => v.title).slice(0, 12);
      await client.query(`DELETE FROM about_values_items WHERE _parent_id=$1 AND _locale::text=$2`, [parent.id, loc]);
      for (let i = 0; i < vals.length; i++) {
        await client.query(
          `INSERT INTO about_values_items (id, _order, _parent_id, _locale, title, "desc") VALUES ($1, $2, $3, $4::_locales, $5, $6)`,
          [genId(), i + 1, parent.id, loc, vals[i].title, vals[i].desc],
        );
      }

      // stats — number is coded in the page; count/order fixed, update label in place.
      for (let i = 0; i < d.stats.length; i++) {
        await client.query(
          `UPDATE about_stats_items SET label=$1 WHERE _parent_id=$2 AND _locale::text=$3 AND _order=$4`,
          [clip(d.stats[i]), parent.id, loc, i + 1],
        );
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

/* ── Home (text sections) ───────────────────────────── */
// This covers the scalar copy and the flat lists (rail, problem, process,
// results, faq). The nested item lists (services cards, portfolio cases, pricing
// packages) and images are NOT touched here — they stay editable in Payload until
// their own studio slice lands.

type HomeLocRow = Record<string, string | null> & { loc: string };

const emptyHome = (): HomeFields => ({
  metaTitle: "", metaDescription: "", heroKicker: "", heroH1: "", heroDesc: "", heroCtaPrimary: "", heroCtaSecondary: "",
  railHead: "", problemLabel: "", problemHeading: "",
  servicesLabel: "", servicesHeading: "", servicesHeadingEm: "", servicesOnSet: "", servicesLaunch: "", servicesAll: "",
  processLabel: "", processHeading: "", processHeadingEm: "",
  statementEyebrow: "", statementLine1: "", statementLine1Em: "", statementLine2: "", statementSystems: "", statementCta: "",
  portfolioLabel: "", portfolioHeading: "", portfolioCtaStart: "", portfolioCtaAll: "",
  resultsLabel: "", resultsHeading: "", resultsHeadingEm: "",
  pricingLabel: "", pricingHeading: "", pricingHeadingEm: "", pricingPopular: "", pricingGetStarted: "",
  faqLabel: "", faqHeading: "", faqHeadingEm: "",
  leadBadge: "", leadHeading: "", leadHeadingEm: "", leadSub: "", leadEmailLabel: "",
});

export async function getHome(): Promise<HomeContent> {
  const homeId = (await query<{ id: number }>(`SELECT id FROM home ORDER BY id LIMIT 1`))[0]?.id;
  const [locRows, railRows, probRows, procRows, resRows, faqRows, pkgRows, pkgRowRows] = await Promise.all([
    query<HomeLocRow>(
      `SELECT _locale::text AS loc, meta_title, meta_description, hero_kicker, hero_h1, hero_desc, hero_cta_primary, hero_cta_secondary,
              rail_head, problem_label, problem_heading, services_label, services_heading, services_heading_em, services_on_set, services_launch, services_all,
              process_label, process_heading, process_heading_em, statement_eyebrow, statement_line1, statement_line1_em, statement_line2, statement_systems, statement_cta,
              portfolio_label, portfolio_heading, portfolio_cta_start, portfolio_cta_all, results_label, results_heading, results_heading_em,
              pricing_label, pricing_heading, pricing_heading_em, pricing_popular, pricing_get_started, faq_label, faq_heading, faq_heading_em,
              lead_badge, lead_heading, lead_heading_em, lead_sub, lead_email_label
         FROM home_locales`,
    ),
    query<{ loc: string; text: string | null }>(`SELECT _locale::text AS loc, text FROM home_rail_items ORDER BY _locale, _order`),
    query<{ loc: string; title: string | null; text: string | null }>(`SELECT _locale::text AS loc, title, text FROM home_problem_items ORDER BY _locale, _order`),
    query<{ loc: string; name: string | null; desc: string | null }>(`SELECT _locale::text AS loc, name, "desc" FROM home_process_steps ORDER BY _locale, _order`),
    query<{ loc: string; label: string | null }>(`SELECT _locale::text AS loc, label FROM home_results_items ORDER BY _locale, _order`),
    query<{ loc: string; q: string | null; a: string | null }>(`SELECT _locale::text AS loc, q, a FROM home_faq_items ORDER BY _locale, _order`),
    query<{ pkg_id: string; loc: string; name: string | null; tag: string | null; price: string | null; price_old: string | null; time: string | null }>(
      `SELECT id AS pkg_id, _locale::text AS loc, name, tag, price, price_old, time FROM home_pricing_packages WHERE _parent_id=$1 ORDER BY _locale, _order`, [homeId]),
    query<{ pkg_id: string; name: string | null; extra: string | null }>(
      `SELECT r._parent_id AS pkg_id, r.name, r.extra FROM home_pricing_packages_rows r JOIN home_pricing_packages p ON p.id=r._parent_id WHERE p._parent_id=$1 ORDER BY r._order`, [homeId]),
  ]);

  const mk = (): HomeContent[Locale] => ({ fields: emptyHome(), rail: [], problem: [], process: [], results: [], faq: [], pricing: [] });
  const out: HomeContent = { en: mk(), ru: mk(), he: mk() };

  for (const r of locRows) {
    if (!(r.loc in out)) continue;
    const g = (k: string) => r[k] ?? "";
    out[r.loc as Locale].fields = {
      metaTitle: g("meta_title"), metaDescription: g("meta_description"),
      heroKicker: g("hero_kicker"), heroH1: g("hero_h1"), heroDesc: g("hero_desc"), heroCtaPrimary: g("hero_cta_primary"), heroCtaSecondary: g("hero_cta_secondary"),
      railHead: g("rail_head"), problemLabel: g("problem_label"), problemHeading: g("problem_heading"),
      servicesLabel: g("services_label"), servicesHeading: g("services_heading"), servicesHeadingEm: g("services_heading_em"), servicesOnSet: g("services_on_set"), servicesLaunch: g("services_launch"), servicesAll: g("services_all"),
      processLabel: g("process_label"), processHeading: g("process_heading"), processHeadingEm: g("process_heading_em"),
      statementEyebrow: g("statement_eyebrow"), statementLine1: g("statement_line1"), statementLine1Em: g("statement_line1_em"), statementLine2: g("statement_line2"), statementSystems: g("statement_systems"), statementCta: g("statement_cta"),
      portfolioLabel: g("portfolio_label"), portfolioHeading: g("portfolio_heading"), portfolioCtaStart: g("portfolio_cta_start"), portfolioCtaAll: g("portfolio_cta_all"),
      resultsLabel: g("results_label"), resultsHeading: g("results_heading"), resultsHeadingEm: g("results_heading_em"),
      pricingLabel: g("pricing_label"), pricingHeading: g("pricing_heading"), pricingHeadingEm: g("pricing_heading_em"), pricingPopular: g("pricing_popular"), pricingGetStarted: g("pricing_get_started"),
      faqLabel: g("faq_label"), faqHeading: g("faq_heading"), faqHeadingEm: g("faq_heading_em"),
      leadBadge: g("lead_badge"), leadHeading: g("lead_heading"), leadHeadingEm: g("lead_heading_em"), leadSub: g("lead_sub"), leadEmailLabel: g("lead_email_label"),
    };
  }
  for (const r of railRows) if (r.loc in out && r.text) out[r.loc as Locale].rail.push(r.text);
  for (const r of probRows) if (r.loc in out) out[r.loc as Locale].problem.push({ title: r.title ?? "", text: r.text ?? "" });
  for (const r of procRows) if (r.loc in out) out[r.loc as Locale].process.push({ name: r.name ?? "", desc: r.desc ?? "" });
  for (const r of resRows) if (r.loc in out) out[r.loc as Locale].results.push(r.label ?? "");
  for (const r of faqRows) if (r.loc in out) out[r.loc as Locale].faq.push({ q: r.q ?? "", a: r.a ?? "" });
  const rowsByPkg: Record<string, { name: string; extra: string }[]> = {};
  for (const r of pkgRowRows) (rowsByPkg[r.pkg_id] ??= []).push({ name: r.name ?? "", extra: r.extra ?? "" });
  for (const p of pkgRows) {
    if (!(p.loc in out)) continue;
    out[p.loc as Locale].pricing.push({ name: p.name ?? "", tag: p.tag ?? "", price: p.price ?? "", priceOld: p.price_old ?? "", time: p.time ?? "", rows: rowsByPkg[p.pkg_id] ?? [] });
  }
  return out;
}

export async function getHomeImages(): Promise<HomeImages> {
  const r = (await query<{ hero_bg_id: number | null; hero_bg_mobile_id: number | null; bg_thumb: string | null; bg_mobile_thumb: string | null }>(
    `SELECT h.hero_bg_id, h.hero_bg_mobile_id,
            COALESCE(mb.sizes_card_url, mb.url) AS bg_thumb,
            COALESCE(mm.sizes_card_url, mm.url) AS bg_mobile_thumb
       FROM home h
       LEFT JOIN media mb ON mb.id = h.hero_bg_id
       LEFT JOIN media mm ON mm.id = h.hero_bg_mobile_id
      ORDER BY h.id LIMIT 1`,
  ))[0];
  return {
    bgId: r?.hero_bg_id ?? null,
    bgThumb: r?.bg_thumb ?? null,
    bgMobileId: r?.hero_bg_mobile_id ?? null,
    bgMobileThumb: r?.bg_mobile_thumb ?? null,
  };
}

export async function saveHomeImages(bgId: number | null, bgMobileId: number | null): Promise<void> {
  const parent = (await query<{ id: number }>(`SELECT id FROM home ORDER BY id LIMIT 1`))[0];
  if (!parent) throw new Error("home parent row missing");
  await query(`UPDATE home SET hero_bg_id=$1, hero_bg_mobile_id=$2, updated_at=now() WHERE id=$3`, [bgId, bgMobileId, parent.id]);
}

export async function saveHome(content: HomeContent): Promise<void> {
  const parent = (await query<{ id: number }>(`SELECT id FROM home ORDER BY id LIMIT 1`))[0];
  if (!parent) throw new Error("home parent row missing");
  const clip = (s: string) => (s ?? "").slice(0, 2000);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const loc of ["en", "ru", "he"] as Locale[]) {
      const d = content[loc];
      const f = d.fields;
      await client.query(
        `UPDATE home_locales SET
           meta_title=$1, meta_description=$2, hero_kicker=$3, hero_h1=$4, hero_desc=$5, hero_cta_primary=$6, hero_cta_secondary=$7,
           rail_head=$8, problem_label=$9, problem_heading=$10,
           services_label=$11, services_heading=$12, services_heading_em=$13, services_on_set=$14, services_launch=$15, services_all=$16,
           process_label=$17, process_heading=$18, process_heading_em=$19,
           statement_eyebrow=$20, statement_line1=$21, statement_line1_em=$22, statement_line2=$23, statement_systems=$24, statement_cta=$25,
           portfolio_label=$26, portfolio_heading=$27, portfolio_cta_start=$28, portfolio_cta_all=$29,
           results_label=$30, results_heading=$31, results_heading_em=$32,
           pricing_label=$33, pricing_heading=$34, pricing_heading_em=$35, pricing_popular=$36, pricing_get_started=$37,
           faq_label=$38, faq_heading=$39, faq_heading_em=$40,
           lead_badge=$41, lead_heading=$42, lead_heading_em=$43, lead_sub=$44, lead_email_label=$45
         WHERE _parent_id=$46 AND _locale::text=$47`,
        [clip(f.metaTitle), clip(f.metaDescription), clip(f.heroKicker), clip(f.heroH1), clip(f.heroDesc), clip(f.heroCtaPrimary), clip(f.heroCtaSecondary),
         clip(f.railHead), clip(f.problemLabel), clip(f.problemHeading),
         clip(f.servicesLabel), clip(f.servicesHeading), clip(f.servicesHeadingEm), clip(f.servicesOnSet), clip(f.servicesLaunch), clip(f.servicesAll),
         clip(f.processLabel), clip(f.processHeading), clip(f.processHeadingEm),
         clip(f.statementEyebrow), clip(f.statementLine1), clip(f.statementLine1Em), clip(f.statementLine2), clip(f.statementSystems), clip(f.statementCta),
         clip(f.portfolioLabel), clip(f.portfolioHeading), clip(f.portfolioCtaStart), clip(f.portfolioCtaAll),
         clip(f.resultsLabel), clip(f.resultsHeading), clip(f.resultsHeadingEm),
         clip(f.pricingLabel), clip(f.pricingHeading), clip(f.pricingHeadingEm), clip(f.pricingPopular), clip(f.pricingGetStarted),
         clip(f.faqLabel), clip(f.faqHeading), clip(f.faqHeadingEm),
         clip(f.leadBadge), clip(f.leadHeading), clip(f.leadHeadingEm), clip(f.leadSub), clip(f.leadEmailLabel),
         parent.id, loc],
      );

      // rail (free string list)
      const rail = d.rail.map((t) => clip(t).trim()).filter(Boolean).slice(0, 20);
      await client.query(`DELETE FROM home_rail_items WHERE _parent_id=$1 AND _locale::text=$2`, [parent.id, loc]);
      for (let i = 0; i < rail.length; i++) {
        await client.query(`INSERT INTO home_rail_items (id, _order, _parent_id, _locale, text) VALUES ($1,$2,$3,$4::_locales,$5)`, [genId(), i + 1, parent.id, loc, rail[i]]);
      }

      // problem (free list: title + text)
      const prob = d.problem.map((p) => ({ title: clip(p.title).trim(), text: clip(p.text).trim() })).filter((p) => p.title || p.text).slice(0, 12);
      await client.query(`DELETE FROM home_problem_items WHERE _parent_id=$1 AND _locale::text=$2`, [parent.id, loc]);
      for (let i = 0; i < prob.length; i++) {
        await client.query(`INSERT INTO home_problem_items (id, _order, _parent_id, _locale, title, text) VALUES ($1,$2,$3,$4::_locales,$5,$6)`, [genId(), i + 1, parent.id, loc, prob[i].title, prob[i].text]);
      }

      // process (free list: name + desc)
      const proc = d.process.map((p) => ({ name: clip(p.name).trim(), desc: clip(p.desc).trim() })).filter((p) => p.name || p.desc).slice(0, 12);
      await client.query(`DELETE FROM home_process_steps WHERE _parent_id=$1 AND _locale::text=$2`, [parent.id, loc]);
      for (let i = 0; i < proc.length; i++) {
        await client.query(`INSERT INTO home_process_steps (id, _order, _parent_id, _locale, name, "desc") VALUES ($1,$2,$3,$4::_locales,$5,$6)`, [genId(), i + 1, parent.id, loc, proc[i].name, proc[i].desc]);
      }

      // results — numbers are coded in the page; fixed count, update label in place
      for (let i = 0; i < d.results.length; i++) {
        await client.query(`UPDATE home_results_items SET label=$1 WHERE _parent_id=$2 AND _locale::text=$3 AND _order=$4`, [clip(d.results[i]), parent.id, loc, i + 1]);
      }

      // faq (free list: q + a)
      const faq = d.faq.map((x) => ({ q: clip(x.q).trim(), a: clip(x.a).trim() })).filter((x) => x.q || x.a).slice(0, 20);
      await client.query(`DELETE FROM home_faq_items WHERE _parent_id=$1 AND _locale::text=$2`, [parent.id, loc]);
      for (let i = 0; i < faq.length; i++) {
        await client.query(`INSERT INTO home_faq_items (id, _order, _parent_id, _locale, q, a) VALUES ($1,$2,$3,$4::_locales,$5,$6)`, [genId(), i + 1, parent.id, loc, faq[i].q, faq[i].a]);
      }

      // pricing packages (+ nested rows) — delete cascades the rows, then reinsert.
      const pkgs = (d.pricing ?? []).filter((p) => (p.name ?? "").trim() || (p.price ?? "").trim()).slice(0, 8);
      await client.query(`DELETE FROM home_pricing_packages WHERE _parent_id=$1 AND _locale::text=$2`, [parent.id, loc]);
      for (let pi = 0; pi < pkgs.length; pi++) {
        const p = pkgs[pi];
        const pkgId = genId();
        await client.query(
          `INSERT INTO home_pricing_packages (id, _order, _parent_id, _locale, name, tag, price, price_old, time) VALUES ($1,$2,$3,$4::_locales,$5,$6,$7,$8,$9)`,
          [pkgId, pi + 1, parent.id, loc, clip(p.name), clip(p.tag), clip(p.price), clip(p.priceOld), clip(p.time)],
        );
        const rows = (p.rows ?? []).filter((r) => (r.name ?? "").trim() || (r.extra ?? "").trim()).slice(0, 20);
        for (let ri = 0; ri < rows.length; ri++) {
          await client.query(
            `INSERT INTO home_pricing_packages_rows (id, _order, _parent_id, _locale, name, extra) VALUES ($1,$2,$3,$4::_locales,$5,$6)`,
            [genId(), ri + 1, pkgId, loc, clip(rows[ri].name), clip(rows[ri].extra)],
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
