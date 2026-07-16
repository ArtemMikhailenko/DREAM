import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** Image/video library. Files land in public/uploads and are served from /uploads/*. */
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Файл", plural: "Медиа" },
  admin: { group: "Контент", useAsTitle: "filename" },
  access: { read: () => true },
  upload: {
    staticDir: path.resolve(dirname, "../../public/uploads"),
    // Match the sizes the site actually renders, served as WebP.
    imageSizes: [
      { name: "thumb", width: 400, height: 300, position: "centre" },
      { name: "card", width: 1000 },
      { name: "hero", width: 1920 },
    ],
    adminThumbnail: "thumb",
    formatOptions: { format: "webp", options: { quality: 82 } },
    mimeTypes: ["image/*", "video/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Альт-текст",
      localized: true,
      admin: { description: "Описание для SEO и скринридеров. Оставьте пустым для декоративных изображений." },
    },
  ],
};
