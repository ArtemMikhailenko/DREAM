import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate";
import { area, stringList, text } from "../fields/shared";

/**
 * "Get a quote" form — shown in the hero of every landing page (homepage + the
 * nine service pages), directly under the H1, per the SEO spec.
 *
 * The `services` list is the "Interested in" dropdown. Its order is significant:
 * each service page preselects its own entry by position, so the rows must stay
 * aligned with SERVICE_ORDER in components/QuoteForm.tsx.
 */
export const LeadForm: GlobalConfig = {
  slug: "lead-form",
  label: "Форма заявки",
  admin: {
    group: "Общее",
    description:
      "Форма «Получить расчёт» в шапке главной и всех страниц услуг. Порядок услуг в списке менять нельзя — по нему подставляется услуга текущей страницы.",
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "collapsible",
      label: "Шапка формы",
      fields: [
        text("title", "Заголовок"),
        text("trust", "Трастовая строка", {
          admin: { description: "Рядом с аватарами клиентов, например «450+ довольных клиентов»." },
        }),
      ],
    },
    {
      type: "collapsible",
      label: "Поля",
      fields: [
        {
          type: "row",
          fields: [text("name", "Имя"), text("phone", "Телефон / WhatsApp")],
        },
        {
          type: "row",
          fields: [text("email", "Email"), text("city", "Город (опционально)")],
        },
        {
          type: "row",
          fields: [
            text("business", "Сфера бизнеса"),
            text("businessPlaceholder", "Сфера бизнеса — подсказка"),
          ],
        },
        {
          type: "row",
          fields: [
            text("interestedIn", "Интересует услуга"),
            text("notSure", "Плейсхолдер на главной"),
          ],
        },
      ],
    },
    stringList("services", "Услуги в списке", "Услуга"),
    {
      type: "collapsible",
      label: "Согласие и кнопка",
      fields: [
        area("whatsappOptIn", "Согласие на WhatsApp", {
          admin: {
            description:
              "Отдельная галочка (требование Meta). Не должна быть условием отправки заявки.",
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
