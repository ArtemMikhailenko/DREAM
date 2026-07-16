import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../hooks/revalidate";
import { area, metaGroup, stringList, text } from "../fields/shared";

/**
 * One document per service page (/services/<slug>).
 *
 * `slug` is the URL key and is NOT localized — it must keep matching the routes
 * that already ship (seo, smm, targeted-advertising, …).
 */
export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Услуга", plural: "Услуги" },
  admin: {
    group: "Контент",
    useAsTitle: "h1",
    defaultColumns: ["label", "slug", "order"],
    description: "Страницы услуг. Порядок задаётся полем «Порядок».",
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
          admin: {
            width: "60%",
            description: "Адрес страницы: /services/<slug>. Менять только вместе с редиректом.",
          },
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
      type: "tabs",
      tabs: [
        {
          label: "Страница",
          fields: [
            text("label", "Короткое название", {
              admin: { description: "Бейдж в шапке страницы и в списке услуг." },
            }),
            text("h1", "Заголовок H1"),
            stringList("body", "Абзацы вступления", "Абзац"),
            text("cta", "Текст кнопки"),
          ],
        },
        {
          label: "Блоки",
          fields: [
            {
              name: "blocks",
              type: "array",
              label: "Блоки",
              localized: true,
              labels: { singular: "Блок", plural: "Блоки" },
              admin: {
                description:
                  "Каждый блок — секция страницы: заголовок, вступление и список. Включите «Нумерованный», чтобы список стал таймлайном с номерами.",
              },
              fields: [
                // The array itself is localized, so each locale owns its rows —
                // sub-fields must stay plain (no nested `localized`).
                { name: "heading", type: "text", label: "Заголовок блока", required: true },
                { name: "intro", type: "textarea", label: "Вступление" },
                {
                  name: "ordered",
                  type: "checkbox",
                  label: "Нумерованный (таймлайн)",
                  defaultValue: false,
                },
                {
                  name: "list",
                  type: "array",
                  label: "Список",
                  labels: { singular: "Пункт", plural: "Пункты" },
                  fields: [{ name: "text", type: "text", required: true }],
                },
              ],
            },
          ],
        },
        {
          label: "В списке услуг",
          fields: [
            {
              name: "index",
              type: "group",
              label: "Карточка на /services",
              fields: [
                text("title", "Название"),
                area("teaser", "Описание"),
              ],
            },
          ],
        },
        { label: "SEO", fields: [metaGroup()] },
      ],
    },
  ],
};
