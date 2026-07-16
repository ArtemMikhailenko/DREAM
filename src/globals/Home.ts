import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate";
import { area, metaGroup, splitHeading, stringList, text } from "../fields/shared";

/**
 * The homepage. Grouped into tabs so the sidebar stays navigable — each tab is
 * one section of the page, top to bottom.
 */
export const Home: GlobalConfig = {
  slug: "home",
  label: "Главная",
  admin: { group: "Главная" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Шапка",
          fields: [
            metaGroup(),
            {
              name: "hero",
              type: "group",
              label: "Первый экран",
              admin: { description: "Крупный заголовок с 3D-эффектом задан в коде — здесь остальное." },
              fields: [
                text("kicker", "Бейдж над заголовком"),
                area("desc", "Описание"),
                {
                  type: "row",
                  fields: [
                    text("ctaPrimary", "Кнопка 1"),
                    text("ctaSecondary", "Кнопка 2"),
                  ],
                },
              ],
            },
            {
              name: "rail",
              type: "group",
              label: "Боковой список",
              fields: [text("head", "Заголовок"), stringList("items", "Пункты", "Пункт")],
            },
          ],
        },
        {
          label: "Проблема",
          fields: [
            {
              name: "problem",
              type: "group",
              label: "Секция «Проблема»",
              fields: [
                text("label", "Надзаголовок"),
                text("heading", "Заголовок"),
                {
                  name: "items",
                  type: "array",
                  label: "Пункты",
                  localized: true,
                  labels: { singular: "Пункт", plural: "Пункты" },
                  fields: [
                    { name: "title", type: "text", label: "Заголовок", required: true },
                    { name: "text", type: "textarea", label: "Текст" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Услуги",
          fields: [
            {
              name: "services",
              type: "group",
              label: "Секция «Услуги»",
              fields: [
                text("label", "Надзаголовок"),
                ...splitHeading(),
                {
                  type: "row",
                  fields: [
                    text("onSet", "Подпись «на съёмке»"),
                    text("launch", "Подпись «запуск»"),
                    text("all", "Ссылка «Все услуги»"),
                  ],
                },
                {
                  name: "items",
                  type: "array",
                  label: "Направления",
                  localized: true,
                  labels: { singular: "Направление", plural: "Направления" },
                  maxRows: 3,
                  admin: { description: "3 направления — картинки заданы в коде." },
                  fields: [
                    { name: "title", type: "text", label: "Заголовок", required: true },
                    { name: "text", type: "textarea", label: "Текст" },
                    {
                      name: "deliverables",
                      type: "array",
                      label: "Что входит",
                      labels: { singular: "Пункт", plural: "Пункты" },
                      fields: [{ name: "text", type: "text", required: true }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Процесс",
          fields: [
            {
              name: "process",
              type: "group",
              label: "Секция «Как мы работаем»",
              fields: [
                text("label", "Надзаголовок"),
                ...splitHeading(),
                {
                  name: "steps",
                  type: "array",
                  label: "Шаги",
                  localized: true,
                  labels: { singular: "Шаг", plural: "Шаги" },
                  fields: [
                    { name: "name", type: "text", label: "Название", required: true },
                    { name: "desc", type: "text", label: "Описание" },
                  ],
                },
              ],
            },
            {
              name: "statement",
              type: "group",
              label: "Секция-манифест",
              fields: [
                text("eyebrow", "Надпись сверху"),
                {
                  type: "row",
                  fields: [text("line1", "Строка 1"), text("line1Em", "Строка 1 — акцент")],
                },
                {
                  type: "row",
                  fields: [text("line2", "Строка 2"), text("systems", "Строка 2 — акцент")],
                },
                text("cta", "Кнопка"),
              ],
            },
          ],
        },
        {
          label: "Работы и цифры",
          fields: [
            {
              name: "portfolio",
              type: "group",
              label: "Секция «Работы»",
              fields: [
                text("label", "Надзаголовок"),
                text("heading", "Заголовок"),
                {
                  name: "cases",
                  type: "array",
                  label: "Карточки",
                  localized: true,
                  labels: { singular: "Карточка", plural: "Карточки" },
                  maxRows: 3,
                  admin: { description: "3 карточки-превью на главной. Полные кейсы — в разделе «Кейсы»." },
                  fields: [
                    { name: "title", type: "text", label: "Название", required: true },
                    { name: "tag", type: "text", label: "Тег" },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    text("ctaStart", "Кнопка «Начать проект»"),
                    text("ctaAll", "Кнопка «Все работы»"),
                  ],
                },
              ],
            },
            {
              name: "results",
              type: "group",
              label: "Секция «Результаты»",
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
          ],
        },
        {
          label: "Цены",
          fields: [
            {
              name: "pricing",
              type: "group",
              label: "Секция «Цены»",
              fields: [
                text("label", "Надзаголовок"),
                ...splitHeading(),
                {
                  type: "row",
                  fields: [
                    text("popular", "Бейдж «Популярный»"),
                    text("getStarted", "Кнопка пакета"),
                  ],
                },
                {
                  name: "packages",
                  type: "array",
                  label: "Пакеты",
                  localized: true,
                  labels: { singular: "Пакет", plural: "Пакеты" },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        { name: "name", type: "text", label: "Название", required: true },
                        { name: "tag", type: "text", label: "Тег" },
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        { name: "price", type: "text", label: "Цена" },
                        { name: "priceOld", type: "text", label: "Старая цена" },
                        { name: "time", type: "text", label: "Срок" },
                      ],
                    },
                    {
                      name: "rows",
                      type: "array",
                      label: "Что входит",
                      labels: { singular: "Строка", plural: "Строки" },
                      fields: [
                        {
                          type: "row",
                          fields: [
                            { name: "name", type: "text", label: "Пункт", required: true },
                            { name: "extra", type: "text", label: "Уточнение" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "FAQ и контакт",
          fields: [
            {
              name: "faq",
              type: "group",
              label: "Секция FAQ",
              fields: [
                text("label", "Надзаголовок"),
                ...splitHeading(),
                {
                  name: "items",
                  type: "array",
                  label: "Вопросы",
                  localized: true,
                  labels: { singular: "Вопрос", plural: "Вопросы" },
                  fields: [
                    { name: "q", type: "text", label: "Вопрос", required: true },
                    { name: "a", type: "textarea", label: "Ответ" },
                  ],
                },
              ],
            },
            {
              name: "lead",
              type: "group",
              label: "Секция «Контакт»",
              fields: [
                text("badge", "Бейдж"),
                ...splitHeading(),
                area("sub", "Подзаголовок"),
                text("emailLabel", "Подпись email"),
              ],
            },
          ],
        },
      ],
    },
  ],
};
