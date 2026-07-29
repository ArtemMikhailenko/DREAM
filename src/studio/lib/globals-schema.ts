import type { Locale } from "./content-schema";

/**
 * Client-safe UI descriptors for the simple "page" globals (list pages + showreel).
 * They all share the same shape — localized scalar fields plus a few text/obj
 * lists — so one generic editor renders them from these specs. The server-side
 * table/column mapping lives in ./globals (never imported by client code).
 */

export type GlobalListValue = string[] | Record<string, string>[];
export type GlobalLocaleData = { fields: Record<string, string>; lists: Record<string, GlobalListValue> };
export type GlobalContent = Record<Locale, GlobalLocaleData>;

export type GlobalUiList =
  | { id: string; title: string; kind: "string"; addLabel: string; multiline?: boolean; note?: string }
  | { id: string; title: string; kind: "object"; addLabel: string; note?: string; fields: { key: string; placeholder: string; multiline?: boolean }[] };

export type GlobalUi = {
  title: string;
  sub: string;
  sections: { title: string; fields: { key: string; label: string; multiline?: boolean }[] }[];
  lists: GlobalUiList[];
};

export const GLOBAL_UI: Record<string, GlobalUi> = {
  "services-index": {
    title: "Страница «Услуги»",
    sub: "Список услуг на /services",
    sections: [
      { title: "SEO", fields: [{ key: "metaTitle", label: "Meta title" }, { key: "metaDescription", label: "Meta description", multiline: true }] },
      { title: "Заголовки", fields: [{ key: "label", label: "Надзаголовок" }, { key: "h1", label: "Заголовок H1" }, { key: "sub", label: "Подзаголовок", multiline: true }, { key: "more", label: "Ссылка «Подробнее»" }, { key: "other", label: "Заголовок «Другие услуги»" }] },
      { title: "Блок призыва", fields: [{ key: "ctaHeading", label: "Заголовок" }, { key: "ctaText", label: "Текст", multiline: true }, { key: "ctaBtn", label: "Кнопка" }] },
    ],
    lists: [{ id: "stats", title: "Цифры под заголовком", kind: "string", addLabel: "+ Пункт" }],
  },
  "portfolio-page": {
    title: "Страница «Портфолио»",
    sub: "Обёртка страницы /portfolio",
    sections: [
      { title: "SEO", fields: [{ key: "metaTitle", label: "Meta title" }, { key: "metaDescription", label: "Meta description", multiline: true }] },
      { title: "Шапка", fields: [{ key: "heroLabel", label: "Надзаголовок" }, { key: "heroHeading", label: "Заголовок" }, { key: "heroHeadingEm", label: "Заголовок — выделенное" }, { key: "heroSub", label: "Подзаголовок", multiline: true }] },
      { title: "Блок призыва", fields: [{ key: "ctaLabel", label: "Надзаголовок" }, { key: "ctaHeading", label: "Заголовок" }, { key: "ctaHeadingEm", label: "Заголовок — выделенное" }, { key: "ctaCtaBrief", label: "Кнопка «Бриф»" }, { key: "ctaCtaAbout", label: "Кнопка «О студии»" }] },
      { title: "Подписи на странице кейса", fields: [{ key: "uiBack", label: "Назад" }, { key: "uiOverview", label: "Обзор" }, { key: "uiNext", label: "Следующий" }, { key: "uiClientLabel", label: "Подпись «Клиент»" }, { key: "uiResultLabel", label: "Подпись «Результат»" }, { key: "uiServicesLabel", label: "Подпись «Услуги»" }, { key: "uiCta", label: "Кнопка кейса" }, { key: "uiCtaAll", label: "Кнопка «Все кейсы»" }] },
    ],
    lists: [{ id: "categories", title: "Категории фильтра", kind: "string", addLabel: "+ Категория", note: "Должны совпадать с тегами кейсов." }],
  },
  "testimonials-page": {
    title: "Страница «Отзывы»",
    sub: "Обёртка страницы /testimonials",
    sections: [
      { title: "SEO", fields: [{ key: "metaTitle", label: "Meta title" }, { key: "metaDescription", label: "Meta description", multiline: true }] },
      { title: "Шапка", fields: [{ key: "heroLabel", label: "Надзаголовок" }, { key: "heroHeading", label: "Заголовок" }, { key: "heroHeadingEm", label: "Заголовок — выделенное" }, { key: "heroSub", label: "Подзаголовок", multiline: true }] },
      { title: "Секции", fields: [{ key: "featuredLabel", label: "Подпись «Избранное»" }, { key: "allLabel", label: "Надзаголовок «Все»" }, { key: "allHeading", label: "Заголовок «Все»" }, { key: "allHeadingEm", label: "Заголовок «Все» — выделенное" }] },
      { title: "Блок призыва", fields: [{ key: "ctaLabel", label: "Надзаголовок" }, { key: "ctaHeading", label: "Заголовок" }, { key: "ctaHeadingEm", label: "Заголовок — выделенное" }, { key: "ctaCtaBrief", label: "Кнопка «Бриф»" }] },
    ],
    lists: [],
  },
  showreel: {
    title: "Шоурил",
    sub: "Видеоблок на главной",
    sections: [
      { title: "Тексты", fields: [{ key: "label", label: "Надзаголовок" }, { key: "heading", label: "Заголовок" }, { key: "headingEm", label: "Заголовок — выделенное" }, { key: "lead", label: "Лид", multiline: true }, { key: "trigger", label: "Кнопка запуска" }, { key: "book", label: "Кнопка «Забронировать»" }, { key: "play", label: "Play" }, { key: "close", label: "Закрыть" }] },
    ],
    lists: [
      { id: "orbit", title: "Орбита (бегущие слова)", kind: "string", addLabel: "+ Слово" },
      { id: "feats", title: "Фичи", kind: "object", addLabel: "+ Фича", fields: [{ key: "t", placeholder: "Заголовок" }, { key: "s", placeholder: "Подзаголовок" }, { key: "d", placeholder: "Описание", multiline: true }] },
    ],
  },
};

export const GLOBAL_PAGES: { key: string; label: string }[] = [
  { key: "services-index", label: "Стр. «Услуги»" },
  { key: "portfolio-page", label: "Стр. «Портфолио»" },
  { key: "testimonials-page", label: "Стр. «Отзывы»" },
  { key: "showreel", label: "Шоурил" },
];
