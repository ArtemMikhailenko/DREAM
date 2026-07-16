import type { GlobalConfig } from "payload";
import { previewPath } from "../fields/preview";
import { revalidateGlobal } from "../hooks/revalidate";
import { area, splitHeading, stringList, text } from "../fields/shared";

/** The showreel block on the homepage (video, orbit labels, feature strip). */
export const Showreel: GlobalConfig = {
  slug: "showreel",
  label: "Шоурил",
  admin: { group: "PLACEHOLDER", preview: previewPath(() => "/#showreel") },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "collapsible",
      label: "Тексты",
      fields: [
        text("label", "Надзаголовок"),
        ...splitHeading(),
        area("lead", "Описание"),
        {
          type: "row",
          fields: [
            text("trigger", "Кнопка запуска"),
            text("book", "Кнопка консультации"),
          ],
        },
        {
          type: "row",
          fields: [
            text("play", "Aria: воспроизвести"),
            text("close", "Aria: закрыть"),
          ],
        },
      ],
    },
    stringList("orbit", "Подписи на орбите", "Подпись"),
    {
      name: "feats",
      type: "array",
      label: "Преимущества (нижняя лента)",
      localized: true,
      labels: { singular: "Преимущество", plural: "Преимущества" },
      maxRows: 3,
      admin: { description: "Ровно 3 пункта — иконки заданы в коде по порядку." },
      fields: [
        { name: "t", type: "text", label: "Строка 1", required: true },
        { name: "s", type: "text", label: "Строка 2", required: true },
        { name: "d", type: "textarea", label: "Описание" },
      ],
    },
  ],
};
