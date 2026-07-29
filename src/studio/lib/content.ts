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
