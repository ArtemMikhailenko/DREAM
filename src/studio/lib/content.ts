import crypto from "crypto";
import { pool, query } from "./db";

/**
 * Read/write for Payload's localized globals, straight over SQL. Payload stores a
 * global as a parent row plus one `*_locales` row per language (en/ru/he); here we
 * load all three at once and update them in place. Writes bypass Payload, so the
 * caller must revalidate the affected routes itself.
 */

export type Locale = "en" | "ru" | "he";
export const LOCALES: { code: Locale; label: string; rtl?: boolean }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "he", label: "עברית", rtl: true },
];

/* ── Navigation ─────────────────────────────────────── */

export type NavFields = {
  aboutUs: string;
  services: string;
  works: string;
  pricing: string;
  contacts: string;
  callUs: string;
  studio: string;
  language: string;
};
export type NavContent = Record<Locale, NavFields>;

export const NAV_FIELDS: { key: keyof NavFields; label: string }[] = [
  { key: "aboutUs", label: "О нас" },
  { key: "services", label: "Услуги" },
  { key: "works", label: "Работы" },
  { key: "pricing", label: "Цены" },
  { key: "contacts", label: "Контакты" },
  { key: "callUs", label: "Кнопка «Позвонить»" },
  { key: "studio", label: "Подпись логотипа" },
  { key: "language", label: "Лейбл «Язык»" },
];

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

export type FooterFields = {
  tagline: string;
  servicesHead: string;
  studioHead: string;
  about: string;
  process: string;
  works: string;
  pricing: string;
  contactsHead: string;
  getBrief: string;
  fromIdea: string;
  rights: string;
};
export type FooterLocaleData = { fields: FooterFields; services: string[] };
export type FooterContent = Record<Locale, FooterLocaleData>;

/** Scalar fields grouped into the sections the footer renders. */
export const FOOTER_SECTIONS: { title: string; fields: { key: keyof FooterFields; label: string }[] }[] = [
  { title: "Основное", fields: [{ key: "tagline", label: "Слоган под логотипом" }] },
  { title: "Колонка «Услуги»", fields: [{ key: "servicesHead", label: "Заголовок" }] },
  {
    title: "Колонка «Студия»",
    fields: [
      { key: "studioHead", label: "Заголовок" },
      { key: "about", label: "О нас" },
      { key: "process", label: "Процесс" },
      { key: "works", label: "Работы" },
      { key: "pricing", label: "Цены" },
    ],
  },
  {
    title: "Колонка «Контакты»",
    fields: [
      { key: "contactsHead", label: "Заголовок" },
      { key: "getBrief", label: "Ссылка «Оставить заявку»" },
    ],
  },
  {
    title: "Нижняя строка",
    fields: [
      { key: "fromIdea", label: "Слоган в копирайте" },
      { key: "rights", label: "Права" },
    ],
  },
];

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

export type LeadFormFields = {
  title: string; trust: string;
  name: string; phone: string; email: string; city: string;
  business: string; businessPlaceholder: string; interestedIn: string; notSure: string;
  whatsappOptIn: string; submit: string; sending: string;
  success: string; errorRequired: string; errorSend: string;
};
export type LeadFormContent = Record<Locale, { fields: LeadFormFields; services: string[] }>;

export type FieldDef<K> = { key: K; label: string; multiline?: boolean };

export const LEADFORM_SECTIONS: { title: string; fields: FieldDef<keyof LeadFormFields>[] }[] = [
  { title: "Шапка формы", fields: [{ key: "title", label: "Заголовок" }, { key: "trust", label: "Трастовая строка" }] },
  {
    title: "Поля",
    fields: [
      { key: "name", label: "Имя" }, { key: "phone", label: "Телефон / WhatsApp" },
      { key: "email", label: "Email" }, { key: "city", label: "Город (опционально)" },
      { key: "business", label: "Сфера бизнеса" }, { key: "businessPlaceholder", label: "Сфера бизнеса — подсказка" },
      { key: "interestedIn", label: "Интересует услуга" }, { key: "notSure", label: "Плейсхолдер на главной" },
    ],
  },
  {
    title: "Согласие и кнопка",
    fields: [
      { key: "whatsappOptIn", label: "Согласие на WhatsApp", multiline: true },
      { key: "submit", label: "Кнопка отправки" }, { key: "sending", label: "Кнопка: отправка…" },
    ],
  },
  {
    title: "Сообщения",
    fields: [
      { key: "success", label: "Успешная отправка", multiline: true },
      { key: "errorRequired", label: "Ошибка: не заполнены поля", multiline: true },
      { key: "errorSend", label: "Ошибка: не удалось отправить", multiline: true },
    ],
  },
];

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
