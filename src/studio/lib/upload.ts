import crypto from "crypto";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { query } from "./db";
import type { MediaItem } from "./media";

/**
 * Image upload → Vercel Blob + a Payload-compatible `media` row. We re-encode to
 * webp and generate the same thumb (400×300) and card (1000×563) sizes Payload
 * does, so the site reads the row exactly as before. The hero size is left null
 * (imgUrl falls back to the full url). Bypasses Payload, so callers revalidate.
 */

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const MAX_BYTES = 12 * 1024 * 1024;

function slugifyBase(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return (
    base.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "image"
  );
}

export async function uploadImage(file: File): Promise<MediaItem> {
  if (!TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN не задан");
  if (!file || file.size === 0) throw new Error("Пустой файл");
  if (file.size > MAX_BYTES) throw new Error("Файл больше 12 МБ");
  if (!file.type.startsWith("image/")) throw new Error("Можно загружать только изображения");

  const input = Buffer.from(await file.arrayBuffer());
  const meta = await sharp(input, { failOn: "none" }).metadata();
  if (!meta.width || !meta.height) throw new Error("Не удалось прочитать изображение");

  // Unique base name so we never overwrite an existing blob/row.
  let base = slugifyBase(file.name);
  const clash = await query<{ n: number }>(`SELECT count(*)::int AS n FROM media WHERE filename LIKE $1`, [`${base}.%`]);
  if ((clash[0]?.n ?? 0) > 0) base = `${base}-${crypto.randomBytes(3).toString("hex")}`;

  const Q = 82;
  const [mainBuf, thumbBuf, cardBuf] = await Promise.all([
    sharp(input, { failOn: "none" }).webp({ quality: Q }).toBuffer(),
    sharp(input, { failOn: "none" }).resize(400, 300, { fit: "cover" }).webp({ quality: Q }).toBuffer(),
    sharp(input, { failOn: "none" }).resize(1000, 563, { fit: "cover" }).webp({ quality: Q }).toBuffer(),
  ]);

  const mainName = `${base}.webp`;
  const thumbName = `${base}-400x300.webp`;
  const cardName = `${base}-1000x563.webp`;
  const opts = { access: "public" as const, token: TOKEN, contentType: "image/webp", addRandomSuffix: false };
  const [main, thumb, card] = await Promise.all([
    put(mainName, mainBuf, opts),
    put(thumbName, thumbBuf, opts),
    put(cardName, cardBuf, opts),
  ]);

  const rows = await query<{ id: number }>(
    `INSERT INTO media (
       url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y,
       sizes_thumb_url, sizes_thumb_width, sizes_thumb_height, sizes_thumb_mime_type, sizes_thumb_filesize, sizes_thumb_filename,
       sizes_card_url, sizes_card_width, sizes_card_height, sizes_card_mime_type, sizes_card_filesize, sizes_card_filename,
       updated_at, created_at
     ) VALUES (
       $1, $2, $3, 'image/webp', $4, $5, $6, 50, 50,
       $7, 400, 300, 'image/webp', $8, $9,
       $10, 1000, 563, 'image/webp', $11, $12,
       now(), now()
     ) RETURNING id`,
    [
      main.url, thumb.url, mainName, mainBuf.length, meta.width, meta.height,
      thumb.url, thumbBuf.length, thumbName,
      card.url, cardBuf.length, cardName,
    ],
  );

  return {
    id: rows[0].id,
    url: main.url,
    thumbUrl: thumb.url,
    filename: mainName,
    mimeType: "image/webp",
    filesize: mainBuf.length,
    width: meta.width,
    height: meta.height,
  };
}
