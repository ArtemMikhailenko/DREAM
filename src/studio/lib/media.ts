import { query } from "./db";

/**
 * Read access to the Payload `media` collection (browse only for now). Files live
 * in Vercel Blob as direct CDN URLs; the table keeps the url plus generated sizes.
 * Uploading (Blob put + sharp resizing + row insert) is a later slice.
 */

export type MediaItem = {
  id: number;
  url: string;
  thumbUrl: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
};

type Row = {
  id: number;
  url: string | null;
  thumbnail_u_r_l: string | null;
  sizes_thumb_url: string | null;
  sizes_card_url: string | null;
  filename: string | null;
  mime_type: string | null;
  filesize: string | null;
  width: string | null;
  height: string | null;
};

export async function listMedia(): Promise<MediaItem[]> {
  const rows = await query<Row>(
    `SELECT id, url, thumbnail_u_r_l, sizes_thumb_url, sizes_card_url, filename, mime_type, filesize, width, height
       FROM media ORDER BY created_at DESC`,
  );
  return rows.map((r) => ({
    id: r.id,
    url: r.url ?? "",
    thumbUrl: r.sizes_thumb_url || r.thumbnail_u_r_l || r.sizes_card_url || r.url || "",
    filename: r.filename ?? "",
    mimeType: r.mime_type ?? "",
    filesize: Number(r.filesize ?? 0),
    width: Number(r.width ?? 0),
    height: Number(r.height ?? 0),
  }));
}
