import type { CollectionConfig } from "payload";

/**
 * Leads captured by the site form. Written server-side from /api/lead, so the
 * public has no direct create access here — the endpoint is the only writer.
 */
export const Leads: CollectionConfig = {
  slug: "leads",
  labels: { singular: "Заявка", plural: "Заявки" },
  admin: {
    group: "Заявки",
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "service", "status", "createdAt"],
    listSearchableFields: ["name", "phone", "business", "message"],
    description: "Заявки с сайта. Дублируются в CRM через вебхук — здесь хранится их копия.",
  },
  access: {
    create: () => false, // only the /api/lead route writes, via local API
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  timestamps: true,
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", label: "Имя", required: true },
        { name: "phone", type: "text", label: "Телефон", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "status",
          type: "select",
          label: "Статус",
          defaultValue: "new",
          options: [
            { label: "Новая", value: "new" },
            { label: "В работе", value: "in_progress" },
            { label: "Закрыта", value: "won" },
            { label: "Отказ", value: "lost" },
          ],
        },
        { name: "service", type: "text", label: "Услуга", admin: { readOnly: true } },
        { name: "budget", type: "text", label: "Бюджет", admin: { readOnly: true } },
      ],
    },
    { name: "business", type: "text", label: "Бизнес", admin: { readOnly: true } },
    { name: "message", type: "textarea", label: "Сообщение", admin: { readOnly: true } },
    { name: "note", type: "textarea", label: "Заметка менеджера" },
    {
      type: "collapsible",
      label: "Источник и согласия",
      admin: { initCollapsed: true },
      fields: [
        {
          type: "row",
          fields: [
            { name: "page", type: "text", label: "Страница", admin: { readOnly: true } },
            { name: "locale", type: "text", label: "Язык", admin: { readOnly: true } },
          ],
        },
        {
          name: "whatsappOptIn",
          type: "checkbox",
          label: "Согласие на WhatsApp",
          admin: { readOnly: true },
        },
        {
          name: "utm",
          type: "json",
          label: "UTM-метки",
          admin: { readOnly: true },
        },
        {
          name: "eventId",
          type: "text",
          label: "Event ID",
          unique: true,
          index: true,
          admin: { readOnly: true, description: "Ключ дедупликации — совпадает с событием Meta CAPI." },
        },
        { name: "crmForwarded", type: "checkbox", label: "Отправлена в CRM", admin: { readOnly: true } },
      ],
    },
  ],
};
