import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../hooks/revalidate";
import { area, text } from "../fields/shared";

/** Client reviews shown on /testimonials. */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Отзыв", plural: "Отзывы" },
  admin: {
    group: "Контент",
    useAsTitle: "name",
    defaultColumns: ["name", "company", "order"],
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateCollection] },
  versions: { drafts: true },
  defaultSort: "order",
  fields: [
    {
      name: "order",
      type: "number",
      label: "Порядок",
      required: true,
      defaultValue: 0,
    },
    area("quote", "Отзыв"),
    {
      type: "row",
      fields: [
        text("name", "Имя", { admin: { width: "34%" } }),
        text("company", "Компания", { admin: { width: "33%" } }),
        text("role", "Должность", { admin: { width: "33%" } }),
      ],
    },
  ],
};
