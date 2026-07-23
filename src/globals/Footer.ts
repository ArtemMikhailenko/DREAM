import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate";
import { stringList, text } from "../fields/shared";

/**
 * Footer text. Contact details (email, phone, socials) are NOT here — they live in
 * lib/contacts.ts so nav and footer share one source. Only the localized labels
 * belong in the CMS. Link targets are fixed routes, hardcoded in SiteFooter.
 */
export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Футер",
  admin: { group: "Общее" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    text("tagline", "Слоган под логотипом"),
    {
      type: "collapsible",
      label: "Колонка «Услуги»",
      fields: [text("servicesHead", "Заголовок"), stringList("services", "Пункты", "Услуга")],
    },
    {
      type: "collapsible",
      label: "Колонка «Студия»",
      fields: [
        text("studioHead", "Заголовок"),
        { type: "row", fields: [text("about", "О нас"), text("process", "Процесс")] },
        { type: "row", fields: [text("works", "Работы"), text("pricing", "Цены")] },
      ],
    },
    {
      type: "collapsible",
      label: "Колонка «Контакты»",
      fields: [text("contactsHead", "Заголовок"), text("getBrief", "Ссылка «Оставить заявку»")],
    },
    {
      type: "collapsible",
      label: "Нижняя строка",
      fields: [text("fromIdea", "Слоган в копирайте"), text("rights", "Права")],
    },
  ],
};
