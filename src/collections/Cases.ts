import type { CollectionConfig } from "payload";
import { previewPath } from "../fields/preview";
import { revalidateCollection } from "../hooks/revalidate";
import { area, stringList, text } from "../fields/shared";

/** One document per portfolio case (/portfolio/<slug>). */
export const Cases: CollectionConfig = {
  slug: "cases",
  labels: { singular: "Кейс", plural: "Кейсы" },
  admin: {
    group: "Контент",
    useAsTitle: "title",
    defaultColumns: ["title", "client", "tag", "order"],
    description: "Кейсы портфолио. Категория («Тег») должна совпадать с фильтром на странице портфолио.",
    preview: previewPath((doc) => `/portfolio/${doc.slug ?? ""}`),
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateCollection] },
  versions: { drafts: true },
  defaultSort: "order",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "slug",
          type: "text",
          label: "Slug (URL)",
          required: true,
          unique: true,
          index: true,
          admin: { width: "60%", description: "Адрес: /portfolio/<slug>" },
        },
        {
          name: "order",
          type: "number",
          label: "Порядок",
          required: true,
          defaultValue: 0,
          admin: { width: "40%" },
        },
      ],
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Обложка",
      admin: { description: "Показывается в сетке портфолио и на странице кейса (16:9)." },
    },
    text("title", "Название"),
    {
      type: "row",
      fields: [
        text("tag", "Тег (категория)", {
          admin: { width: "34%", description: "Должен совпадать с одной из категорий фильтра." },
        }),
        text("client", "Клиент", { admin: { width: "33%" } }),
        text("result", "Результат", { admin: { width: "33%" } }),
      ],
    },
    area("summary", "Краткое описание"),
    stringList("body", "Текст кейса (абзацы)", "Абзац"),
    stringList("services", "Что мы сделали", "Пункт"),
  ],
};
