/**
 * Pulls the images that were hardcoded in components into the Media library and
 * attaches them to the documents that render them.
 *
 * Run once after `npm run seed`:  npm run seed:media
 *
 * Idempotent: media is matched by filename, so re-running re-links rather than
 * duplicating. Remote stock photos are downloaded so the site stops depending on
 * an external CDN and the team can replace them from the admin.
 */
import "dotenv/config";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getPayload } from "payload";
import type { Payload } from "payload";
import config from "../payload.config";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");

/** Upload a local file once; return its Media id. */
async function upload(payload: Payload, filePath: string, alt: string): Promise<number> {
  const filename = path.basename(filePath);
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
  });
  if (existing.docs[0]) return existing.docs[0].id as number;

  const doc = await payload.create({
    collection: "media",
    locale: "en",
    data: { alt },
    filePath,
  });
  console.log(`  uploaded ${filename}`);
  return doc.id as number;
}

/** Download a remote image to a temp file so it can be uploaded like a local one. */
async function fetchToTmp(url: string, name: string): Promise<string> {
  const dest = path.join(os.tmpdir(), name);
  if (fs.existsSync(dest)) return dest;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed (${res.status}): ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return dest;
}

const UNSPLASH = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;

// Ids reused from the components they were hardcoded in.
const CASE_PHOTOS = [
  "1556761175-b413da4baf72",
  "1551836022-d5d88e9218df",
  "1542744173-8e7e53415bb0",
  "1574717024653-61fd2cf4d44d",
  "1492691527719-9d1e07e534b4",
  "1521737604893-d14cc237f11d",
];
const HOME_SERVICE_PHOTOS = ["1574717024653-61fd2cf4d44d", "1492691527719-9d1e07e534b4", "1521737604893-d14cc237f11d"];
const HOME_CASE_PHOTOS = ["1556761175-b413da4baf72", "1551836022-d5d88e9218df", "1542744173-8e7e53415bb0"];

// Only these four services shipped with a hero photo.
const SERVICE_HEROES: Record<string, string> = {
  "targeted-advertising": "public/services/targeted-advertising.webp",
  smm: "public/services/smm.webp",
  "photo-video": "public/services/photo-video.webp",
  automation: "public/services/automation.webp",
};

async function run() {
  const payload = await getPayload({ config });

  // ── Service hero photos ──
  for (const [slug, rel] of Object.entries(SERVICE_HEROES)) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) continue;
    const id = await upload(payload, file, "");
    const found = await payload.find({ collection: "services", where: { slug: { equals: slug } }, limit: 1 });
    if (found.docs[0]) {
      await payload.update({ collection: "services", id: found.docs[0].id, data: { hero: id } });
      console.log(`service hero: ${slug} ✓`);
    }
  }

  // ── Case covers ──
  const { CASE_SLUGS } = await import("../lib/portfolio");
  for (const [i, slug] of CASE_SLUGS.entries()) {
    const tmp = await fetchToTmp(UNSPLASH(CASE_PHOTOS[i], 1600), `case-${slug}.jpg`);
    const id = await upload(payload, tmp, "");
    const found = await payload.find({ collection: "cases", where: { slug: { equals: slug } }, limit: 1 });
    if (found.docs[0]) {
      await payload.update({ collection: "cases", id: found.docs[0].id, data: { cover: id } });
      console.log(`case cover: ${slug} ✓`);
    }
  }

  // ── Homepage card photos + hero background ──
  const serviceCardIds = [];
  for (const [i, id] of HOME_SERVICE_PHOTOS.entries()) {
    serviceCardIds.push(await upload(payload, await fetchToTmp(UNSPLASH(id, 900), `home-svc-${i}.jpg`), ""));
  }
  const caseCardIds = [];
  for (const [i, id] of HOME_CASE_PHOTOS.entries()) {
    caseCardIds.push(await upload(payload, await fetchToTmp(UNSPLASH(id, 900), `home-case-${i}.jpg`), ""));
  }

  const bg = path.join(ROOT, "public/background/hero.webp");
  const bgMobile = path.join(ROOT, "public/background/hero-portrait.webp");
  const bgId = fs.existsSync(bg) ? await upload(payload, bg, "") : undefined;
  const bgMobileId = fs.existsSync(bgMobile) ? await upload(payload, bgMobile, "") : undefined;

  await payload.updateGlobal({
    slug: "home",
    locale: "en",
    data: {
      hero: { ...(bgId ? { bg: bgId } : {}), ...(bgMobileId ? { bgMobile: bgMobileId } : {}) },
      services: { cardImages: serviceCardIds.map((image) => ({ image })) },
      portfolio: { cardImages: caseCardIds.map((image) => ({ image })) },
    } as never,
  });
  console.log("home: hero background + card photos ✓");

  console.log("\nMedia seed complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
