import type { GlobalConfig } from "payload";
import { previewPath } from "../fields/preview";
import { revalidateGlobal } from "../hooks/revalidate";
import { area, metaGroup, splitHeading, text } from "../fields/shared";

/** Chrome for /testimonials. The reviews themselves are a collection. */
export const TestimonialsPage: GlobalConfig = {
  slug: "testimonials-page",
  label: "Страница «Отзывы»",
  admin: { group: "Страницы", preview: previewPath(() => "/testimonials") },
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
    text("featuredLabel", "Заголовок избранных отзывов"),
    {
      name: "all",
      type: "group",
      label: "Секция «Все отзывы»",
      fields: [text("label", "Надзаголовок"), ...splitHeading()],
    },
    {
      name: "cta",
      type: "group",
      label: "Блок призыва",
      fields: [text("label", "Надзаголовок"), ...splitHeading(), text("ctaBrief", "Кнопка «Бриф»")],
    },
  ],
};
