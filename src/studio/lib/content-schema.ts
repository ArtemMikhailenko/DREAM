/**
 * Client-safe half of the content model: types and UI field descriptors only.
 * NO database imports here, so client editor components can import LOCALES / field
 * configs / types without dragging `pg` (a Node module) into the browser bundle.
 * The server-only read/write functions live in ./content.
 */

export type Locale = "en" | "ru" | "he";
export const LOCALES: { code: Locale; label: string; rtl?: boolean }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "he", label: "עברית", rtl: true },
];

export type FieldDef<K> = { key: K; label: string; multiline?: boolean };

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

/* ── Lead form ──────────────────────────────────────── */

export type LeadFormFields = {
  title: string; trust: string;
  name: string; phone: string; email: string; city: string;
  business: string; businessPlaceholder: string; interestedIn: string; notSure: string;
  whatsappOptIn: string; submit: string; sending: string;
  success: string; errorRequired: string; errorSend: string;
};
export type LeadFormContent = Record<Locale, { fields: LeadFormFields; services: string[] }>;

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
