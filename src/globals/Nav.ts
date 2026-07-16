import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate";
import { text } from "../fields/shared";

export const Nav: GlobalConfig = {
  slug: "nav",
  label: "Навигация",
  admin: { group: "Общее" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  versions: { drafts: false },
  fields: [
    {
      type: "row",
      fields: [
        text("aboutUs", "О нас"),
        text("services", "Услуги"),
        text("works", "Работы"),
      ],
    },
    {
      type: "row",
      fields: [
        text("pricing", "Цены"),
        text("contacts", "Контакты"),
        text("callUs", "Позвонить"),
      ],
    },
    {
      type: "row",
      fields: [text("studio", "Подпись логотипа"), text("language", "Язык")],
    },
  ],
};
