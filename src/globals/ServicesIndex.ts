import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate";
import { area, metaGroup, stringList, text } from "../fields/shared";

/**
 * Chrome for /services. The per-service card title/teaser lives on each
 * Service document (tab «В списке услуг»), so there's one place per service.
 */
export const ServicesIndex: GlobalConfig = {
  slug: "services-index",
  label: "Страница «Услуги»",
  admin: { group: "Страницы" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    metaGroup(),
    text("label", "Надзаголовок"),
    text("h1", "Заголовок H1"),
    area("sub", "Подзаголовок"),
    text("more", "Ссылка «Подробнее»"),
    text("other", "Заголовок «Другие услуги»"),
    stringList("stats", "Цифры под заголовком", "Цифра"),
    {
      name: "cta",
      type: "group",
      label: "Блок призыва",
      fields: [
        text("heading", "Заголовок"),
        area("text", "Текст"),
        text("btn", "Кнопка"),
      ],
    },
  ],
};
