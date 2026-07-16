import type { CollectionConfig } from "payload";

/** Admin accounts. First user is created via /admin on a fresh database. */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Пользователь", plural: "Пользователи" },
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
    group: "Настройки",
  },
  access: {
    // Only admins may create/delete accounts; editors can still edit themselves.
    create: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    { name: "name", type: "text", label: "Имя" },
    {
      name: "role",
      type: "select",
      label: "Роль",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Администратор", value: "admin" },
        { label: "Редактор", value: "editor" },
      ],
      admin: { description: "Администратор управляет пользователями и настройками." },
    },
  ],
};
