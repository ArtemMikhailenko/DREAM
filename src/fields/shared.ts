import type { Field } from "payload";

/**
 * Field helpers for the site's content model.
 *
 * Every editable string is `localized: true`, so one document holds en/ru/he and
 * the admin's locale switcher swaps between them. Names mirror the keys the
 * components already read via next-intl (`t("Home.hero.kicker")`), which keeps
 * the Payload → messages mapping a straight structural copy.
 */

/** Localized single-line text. */
export const text = (name: string, label: string, opts: Partial<Field> = {}): Field =>
  ({ name, type: "text", label, localized: true, ...opts }) as Field;

/** Localized multi-line text. */
export const area = (name: string, label: string, opts: Partial<Field> = {}): Field =>
  ({ name, type: "textarea", label, localized: true, ...opts }) as Field;

/**
 * Localized list of plain strings. Payload has no "array of strings", so each row
 * wraps a single `text` field; `stringsOut`/`stringsIn` convert to and from a flat array.
 */
export const stringList = (name: string, label: string, rowLabel = "Пункт"): Field => ({
  name,
  type: "array",
  label,
  localized: true,
  labels: { singular: rowLabel, plural: label },
  fields: [{ name: "text", type: "text", required: true }],
});

/** Rows of {text} → ["…"] */
export const stringsOut = (rows?: { text?: string | null }[] | null): string[] =>
  (rows ?? []).map((r) => r?.text ?? "").filter(Boolean);

/** ["…"] → rows of {text} */
export const stringsIn = (values?: unknown): { text: string }[] =>
  Array.isArray(values) ? values.map((v) => ({ text: String(v) })) : [];

/** SEO title/description pair, shown collapsed. */
export const metaGroup = (): Field => ({
  name: "meta",
  type: "group",
  label: "SEO",
  admin: { description: "Заголовок и описание страницы для поиска и соцсетей." },
  fields: [
    text("title", "Title"),
    area("description", "Description"),
  ],
});

/**
 * Heading split into a plain part and an accented part — the site renders the
 * second half in amber italic (`{heading} <em>{headingEm}</em>`).
 */
export const splitHeading = (opts: { label?: string } = {}): Field[] => [
  text("heading", opts.label ?? "Заголовок"),
  text("headingEm", "Заголовок — акцент", {
    admin: { description: "Эта часть выводится амбером курсивом." },
  }),
];

/** Small uppercase label above a section heading. */
export const kicker = (name = "label"): Field => text(name, "Надзаголовок");
