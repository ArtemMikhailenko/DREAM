import type { GlobalConfig } from "payload";
import { previewPath } from "../fields/preview";
import { revalidateGlobal } from "../hooks/revalidate";
import { area, metaGroup, splitHeading, stringList, text } from "../fields/shared";

/** Chrome for /portfolio and the case pages. Cases themselves are a collection. */
export const PortfolioPage: GlobalConfig = {
  slug: "portfolio-page",
  label: "Страница «Портфолио»",
  admin: { group: "PLACEHOLDER", preview: previewPath(() => "/portfolio") },
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
    stringList("categories", "Категории фильтра", "Категория"),
    {
      name: "cta",
      type: "group",
      label: "Блок призыва",
      fields: [
        text("label", "Надзаголовок"),
        ...splitHeading(),
        text("ctaBrief", "Кнопка «Бриф»"),
        text("ctaAbout", "Кнопка «О студии»"),
      ],
    },
    {
      name: "ui",
      type: "group",
      label: "Подписи на странице кейса",
      fields: [
        {
          type: "row",
          fields: [
            text("back", "Назад к работам"),
            text("overview", "Обзор"),
            text("next", "Следующая работа"),
          ],
        },
        {
          type: "row",
          fields: [
            text("clientLabel", "Клиент"),
            text("resultLabel", "Результат"),
            text("servicesLabel", "Что мы сделали"),
          ],
        },
        {
          type: "row",
          fields: [text("cta", "Кнопка «Начать проект»"), text("ctaAll", "Кнопка «Все работы»")],
        },
      ],
    },
  ],
};
