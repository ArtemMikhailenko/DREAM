import type { GlobalConfig } from "payload";
import { previewPath } from "../fields/preview";
import { revalidateGlobal } from "../hooks/revalidate";
import { area, metaGroup, splitHeading, stringList, text } from "../fields/shared";

export const About: GlobalConfig = {
  slug: "about",
  label: "Страница «О студии»",
  admin: { group: "Страницы", preview: previewPath(() => "/about") },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    metaGroup(),
    {
      name: "hero",
      type: "group",
      label: "Шапка",
      fields: [text("label", "Надзаголовок"), ...splitHeading(), area("sub", "Подзаголовок")],
    },
    {
      name: "story",
      type: "group",
      label: "История",
      fields: [
        text("label", "Надзаголовок"),
        text("heading", "Заголовок"),
        area("p1", "Абзац 1"),
        area("p2", "Абзац 2"),
        text("slogan", "Слоган"),
        stringList("capabilities", "Компетенции", "Компетенция"),
      ],
    },
    {
      name: "values",
      type: "group",
      label: "Принципы",
      fields: [
        text("label", "Надзаголовок"),
        ...splitHeading(),
        {
          name: "items",
          type: "array",
          label: "Принципы",
          localized: true,
          labels: { singular: "Принцип", plural: "Принципы" },
          fields: [
            { name: "title", type: "text", label: "Заголовок", required: true },
            { name: "desc", type: "textarea", label: "Описание" },
          ],
        },
      ],
    },
    {
      name: "stats",
      type: "group",
      label: "Цифры",
      fields: [
        text("label", "Надзаголовок"),
        ...splitHeading(),
        {
          name: "items",
          type: "array",
          label: "Показатели",
          localized: true,
          labels: { singular: "Показатель", plural: "Показатели" },
          admin: { description: "Само число задано в коде страницы — здесь только подпись." },
          fields: [{ name: "label", type: "textarea", label: "Подпись", required: true }],
        },
      ],
    },
    {
      name: "cta",
      type: "group",
      label: "Блок призыва",
      fields: [
        text("label", "Надзаголовок"),
        ...splitHeading(),
        area("sub", "Подзаголовок"),
        {
          type: "row",
          fields: [text("ctaBrief", "Кнопка «Бриф»"), text("ctaWorks", "Кнопка «Работы»")],
        },
      ],
    },
  ],
};
