import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate";
import { area, stringList, text } from "../fields/shared";

/** Labels, placeholders and messages for the contact form. */
export const LeadForm: GlobalConfig = {
  slug: "lead-form",
  label: "Форма заявки",
  admin: { group: "Общее" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "collapsible",
      label: "Поля",
      fields: [
        {
          type: "row",
          fields: [text("name", "Имя"), text("phone", "Телефон")],
        },
        {
          type: "row",
          fields: [
            text("business", "Бизнес"),
            text("businessPlaceholder", "Бизнес — подсказка"),
          ],
        },
        {
          type: "row",
          fields: [
            text("budget", "Бюджет"),
            text("budgetPlaceholder", "Бюджет — подсказка"),
          ],
        },
        {
          type: "row",
          fields: [text("task", "Задача"), text("taskPlaceholder", "Задача — подсказка")],
        },
        text("whatYouNeed", "Что нужно"),
      ],
    },
    stringList("services", "Варианты услуг в форме", "Вариант"),
    {
      type: "collapsible",
      label: "Согласия и кнопки",
      fields: [
        area("consent", "Согласие на обработку данных"),
        area("whatsappOptIn", "Согласие на WhatsApp", {
          admin: {
            description:
              "Отдельная галочка (требование Meta). Никогда не должна быть условием отправки заявки.",
          },
        }),
        {
          type: "row",
          fields: [text("submit", "Кнопка отправки"), text("sending", "Кнопка: отправка…")],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Сообщения",
      fields: [
        area("success", "Успешная отправка"),
        area("errorRequired", "Ошибка: не заполнены поля"),
        area("errorSend", "Ошибка: не удалось отправить"),
      ],
    },
  ],
};
