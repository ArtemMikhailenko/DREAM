/**
 * Migrate existing media files into Vercel Blob.
 *
 * Run once, from the machine that still has the files on disk (public/uploads),
 * AFTER setting BLOB_READ_WRITE_TOKEN in .env:
 *
 *   npm run migrate:blob
 *
 * public/uploads is gitignored, so the files only exist locally — a deploy host
 * would have nothing to migrate. Each doc is re-saved with its original file; the
 * Blob plugin (active because the token is set) stores it and regenerates the
 * thumb/card/hero sizes into Blob too. Idempotent: re-running just re-uploads.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "../payload.config";

const UPLOADS = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../public/uploads");

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN не задан — задай его в .env перед миграцией.");
    process.exit(1);
  }

  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "media", limit: 1000, depth: 0 });
  console.log(`медиа-записей: ${docs.length}`);

  let ok = 0;
  let missing = 0;
  for (const doc of docs) {
    const filename = doc.filename as string | undefined;
    if (!filename) continue;
    const filePath = path.join(UPLOADS, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ нет локального файла: ${filename}`);
      missing++;
      continue;
    }
    const data = fs.readFileSync(filePath);
    await payload.update({
      collection: "media",
      id: doc.id,
      data: {},
      file: {
        data,
        name: filename,
        mimetype: (doc.mimeType as string) || "image/webp",
        size: data.length,
      },
      overrideAccess: true,
    });
    ok++;
    console.log(`  → Blob: ${filename}`);
  }

  console.log(`\nЗалито в Blob: ${ok}${missing ? `, пропущено (нет файла): ${missing}` : ""}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
