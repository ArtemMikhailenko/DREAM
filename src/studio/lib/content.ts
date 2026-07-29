import { query } from "./db";

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
