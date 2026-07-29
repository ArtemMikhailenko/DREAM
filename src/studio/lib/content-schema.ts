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

/* ── About ──────────────────────────────────────────── */

export type AboutFields = {
  metaTitle: string; metaDescription: string;
  heroLabel: string; heroHeading: string; heroHeadingEm: string; heroSub: string;
  storyLabel: string; storyHeading: string; storyP1: string; storyP2: string; storySlogan: string;
  valuesLabel: string; valuesHeading: string; valuesHeadingEm: string;
  statsLabel: string; statsHeading: string; statsHeadingEm: string;
  ctaLabel: string; ctaHeading: string; ctaHeadingEm: string; ctaSub: string; ctaCtaBrief: string; ctaCtaWorks: string;
};
export type AboutValueItem = { title: string; desc: string };
export type AboutLocaleData = {
  fields: AboutFields;
  capabilities: string[];
  values: AboutValueItem[];
  stats: string[];
};
export type AboutContent = Record<Locale, AboutLocaleData>;

/** `list` marks which sub-list renders after a section's scalar fields. */
export const ABOUT_SECTIONS: {
  title: string;
  list?: "capabilities" | "values" | "stats";
  fields: FieldDef<keyof AboutFields>[];
}[] = [
  { title: "SEO", fields: [{ key: "metaTitle", label: "Meta title" }, { key: "metaDescription", label: "Meta description", multiline: true }] },
  {
    title: "Шапка",
    fields: [
      { key: "heroLabel", label: "Надзаголовок" }, { key: "heroHeading", label: "Заголовок" },
      { key: "heroHeadingEm", label: "Заголовок — выделенное" }, { key: "heroSub", label: "Подзаголовок", multiline: true },
    ],
  },
  {
    title: "История",
    list: "capabilities",
    fields: [
      { key: "storyLabel", label: "Надзаголовок" }, { key: "storyHeading", label: "Заголовок" },
      { key: "storyP1", label: "Абзац 1", multiline: true }, { key: "storyP2", label: "Абзац 2", multiline: true },
      { key: "storySlogan", label: "Слоган" },
    ],
  },
  {
    title: "Принципы",
    list: "values",
    fields: [
      { key: "valuesLabel", label: "Надзаголовок" }, { key: "valuesHeading", label: "Заголовок" },
      { key: "valuesHeadingEm", label: "Заголовок — выделенное" },
    ],
  },
  {
    title: "Цифры",
    list: "stats",
    fields: [
      { key: "statsLabel", label: "Надзаголовок" }, { key: "statsHeading", label: "Заголовок" },
      { key: "statsHeadingEm", label: "Заголовок — выделенное" },
    ],
  },
  {
    title: "Блок призыва",
    fields: [
      { key: "ctaLabel", label: "Надзаголовок" }, { key: "ctaHeading", label: "Заголовок" },
      { key: "ctaHeadingEm", label: "Заголовок — выделенное" }, { key: "ctaSub", label: "Подзаголовок", multiline: true },
      { key: "ctaCtaBrief", label: "Кнопка «Бриф»" }, { key: "ctaCtaWorks", label: "Кнопка «Работы»" },
    ],
  },
];

/* ── Home ───────────────────────────────────────────── */

export type HomeFields = {
  metaTitle: string; metaDescription: string;
  heroKicker: string; heroH1: string; heroDesc: string; heroCtaPrimary: string; heroCtaSecondary: string;
  railHead: string;
  problemLabel: string; problemHeading: string;
  servicesLabel: string; servicesHeading: string; servicesHeadingEm: string; servicesOnSet: string; servicesLaunch: string; servicesAll: string;
  processLabel: string; processHeading: string; processHeadingEm: string;
  statementEyebrow: string; statementLine1: string; statementLine1Em: string; statementLine2: string; statementSystems: string; statementCta: string;
  portfolioLabel: string; portfolioHeading: string; portfolioCtaStart: string; portfolioCtaAll: string;
  resultsLabel: string; resultsHeading: string; resultsHeadingEm: string;
  pricingLabel: string; pricingHeading: string; pricingHeadingEm: string; pricingPopular: string; pricingGetStarted: string;
  faqLabel: string; faqHeading: string; faqHeadingEm: string;
  leadBadge: string; leadHeading: string; leadHeadingEm: string; leadSub: string; leadEmailLabel: string;
};
export type HomeContent = Record<Locale, {
  fields: HomeFields;
  rail: string[];
  problem: { title: string; text: string }[];
  process: { name: string; desc: string }[];
  results: string[];
  faq: { q: string; a: string }[];
}>;

/** Which flat sub-list (if any) renders after a section's scalar fields. `note`
 *  flags parts still edited in Payload (nested cards / images) — coming later. */
export const HOME_SECTIONS: {
  title: string;
  list?: "rail" | "problem" | "process" | "results" | "faq";
  note?: string;
  fields: FieldDef<keyof HomeFields>[];
}[] = [
  { title: "SEO", fields: [{ key: "metaTitle", label: "Meta title" }, { key: "metaDescription", label: "Meta description", multiline: true }] },
  {
    title: "Первый экран",
    note: "Фоновые изображения героя — в разделе «Медиа» (скоро).",
    fields: [
      { key: "heroKicker", label: "Кикер" }, { key: "heroH1", label: "Заголовок H1" }, { key: "heroDesc", label: "Описание", multiline: true },
      { key: "heroCtaPrimary", label: "Кнопка (основная)" }, { key: "heroCtaSecondary", label: "Кнопка (вторая)" },
    ],
  },
  { title: "Бегущая строка", list: "rail", fields: [{ key: "railHead", label: "Заголовок" }] },
  { title: "Проблема", list: "problem", fields: [{ key: "problemLabel", label: "Надзаголовок" }, { key: "problemHeading", label: "Заголовок" }] },
  {
    title: "Услуги — заголовки",
    note: "Карточки услуг и картинки редактируются пока в Payload (скоро здесь).",
    fields: [
      { key: "servicesLabel", label: "Надзаголовок" }, { key: "servicesHeading", label: "Заголовок" }, { key: "servicesHeadingEm", label: "Заголовок — выделенное" },
      { key: "servicesOnSet", label: "Подпись «on set»" }, { key: "servicesLaunch", label: "Подпись «launch»" }, { key: "servicesAll", label: "Ссылка «Все услуги»" },
    ],
  },
  { title: "Процесс", list: "process", fields: [{ key: "processLabel", label: "Надзаголовок" }, { key: "processHeading", label: "Заголовок" }, { key: "processHeadingEm", label: "Заголовок — выделенное" }] },
  {
    title: "Утверждение",
    fields: [
      { key: "statementEyebrow", label: "Надзаголовок" }, { key: "statementLine1", label: "Строка 1" }, { key: "statementLine1Em", label: "Строка 1 — выделенное" },
      { key: "statementLine2", label: "Строка 2" }, { key: "statementSystems", label: "Слово «системы»" }, { key: "statementCta", label: "Кнопка" },
    ],
  },
  {
    title: "Портфолио — заголовки",
    note: "Кейсы и картинки редактируются пока в Payload (скоро здесь).",
    fields: [
      { key: "portfolioLabel", label: "Надзаголовок" }, { key: "portfolioHeading", label: "Заголовок" },
      { key: "portfolioCtaStart", label: "Кнопка «Начать»" }, { key: "portfolioCtaAll", label: "Кнопка «Все работы»" },
    ],
  },
  { title: "Результаты", list: "results", fields: [{ key: "resultsLabel", label: "Надзаголовок" }, { key: "resultsHeading", label: "Заголовок" }, { key: "resultsHeadingEm", label: "Заголовок — выделенное" }] },
  {
    title: "Цены — заголовки",
    note: "Тарифы редактируются пока в Payload (скоро здесь).",
    fields: [
      { key: "pricingLabel", label: "Надзаголовок" }, { key: "pricingHeading", label: "Заголовок" }, { key: "pricingHeadingEm", label: "Заголовок — выделенное" },
      { key: "pricingPopular", label: "Бейдж «Популярный»" }, { key: "pricingGetStarted", label: "Кнопка «Начать»" },
    ],
  },
  { title: "FAQ", list: "faq", fields: [{ key: "faqLabel", label: "Надзаголовок" }, { key: "faqHeading", label: "Заголовок" }, { key: "faqHeadingEm", label: "Заголовок — выделенное" }] },
  {
    title: "Форма (шапка блока)",
    fields: [
      { key: "leadBadge", label: "Бейдж" }, { key: "leadHeading", label: "Заголовок" }, { key: "leadHeadingEm", label: "Заголовок — выделенное" },
      { key: "leadSub", label: "Подзаголовок", multiline: true }, { key: "leadEmailLabel", label: "Подпись email" },
    ],
  },
];

/* ── Collections: Testimonials ──────────────────────── */

export type TestimonialFields = { quote: string; name: string; company: string; role: string };
export type TestimonialDoc = { id: number; order: number; locales: Record<Locale, TestimonialFields> };
export type TestimonialListItem = { id: number; order: number; name: string; company: string };

export const TESTIMONIAL_FIELDS: FieldDef<keyof TestimonialFields>[] = [
  { key: "quote", label: "Отзыв", multiline: true },
  { key: "name", label: "Имя" },
  { key: "company", label: "Компания" },
  { key: "role", label: "Должность" },
];

/* ── Collections: Cases (portfolio) ─────────────────── */

export type CaseFields = { title: string; tag: string; client: string; result: string; summary: string };
export type CaseLocaleData = { fields: CaseFields; body: string[]; services: string[] };
export type CaseDoc = { id: number; slug: string; order: number; coverId: number | null; coverThumb: string | null; locales: Record<Locale, CaseLocaleData> };
export type CaseListItem = { id: number; slug: string; order: number; title: string; tag: string };

export const CASE_FIELDS: FieldDef<keyof CaseFields>[] = [
  { key: "title", label: "Название" },
  { key: "tag", label: "Тег (категория)" },
  { key: "client", label: "Клиент" },
  { key: "result", label: "Результат" },
  { key: "summary", label: "Краткое описание", multiline: true },
];

/* ── Collections: Services ──────────────────────────── */

export type ServiceFields = {
  label: string; h1: string; cta: string;
  indexTitle: string; indexTeaser: string;
  metaTitle: string; metaDescription: string;
};
export type ServiceBlock = { heading: string; intro: string; ordered: boolean; list: string[] };
export type ServiceLocaleData = { fields: ServiceFields; body: string[]; blocks: ServiceBlock[] };
export type ServiceDoc = { id: number; slug: string; order: number; heroId: number | null; heroThumb: string | null; locales: Record<Locale, ServiceLocaleData> };
export type ServiceListItem = { id: number; slug: string; order: number; label: string; h1: string };

export const SERVICE_SECTIONS: { title: string; fields: FieldDef<keyof ServiceFields>[] }[] = [
  { title: "Страница", fields: [{ key: "label", label: "Короткое название" }, { key: "h1", label: "Заголовок H1" }, { key: "cta", label: "Текст кнопки" }] },
  { title: "Карточка в списке /services", fields: [{ key: "indexTitle", label: "Название" }, { key: "indexTeaser", label: "Описание", multiline: true }] },
  { title: "SEO", fields: [{ key: "metaTitle", label: "Meta title" }, { key: "metaDescription", label: "Meta description", multiline: true }] },
];
