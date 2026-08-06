/**
 * Applies the SEO spec copy (DC_seo/SEO_on_page.md, parsed into seo-content.json)
 * to the CMS. Scope: the 9 service pages — meta.title, meta.description, h1, body,
 * H2 blocks and cta, per locale. Home is handled separately (richer global shape).
 *
 * Safe by design:
 *   - Always writes a backup of current service content to seo-backup.json first.
 *   - Dry-run by default (prints a diff summary). Set APPLY=1 to write to the DB.
 *   - Only the 5 SEO fields are updated; slug/order/label/index are left intact.
 *
 *   npm run seo:apply            # dry-run + backup
 *   APPLY=1 npm run seo:apply    # write to DB (points at DATABASE_URI)
 *
 * After APPLY against prod, Redeploy on the host so statically-generated pages
 * re-read the DB.
 */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { getPayload } from "payload";
import config from "../payload.config";
import content from "./seo-content.json";

type Locale = "en" | "ru" | "he";
const LOCALES: Locale[] = ["en", "ru", "he"];
const APPLY = process.env.APPLY === "1";

const list = (v?: unknown) =>
  Array.isArray(v) ? v.map((t) => ({ text: String(t) })) : [];

type Block = { heading: string; intro: string; ordered: boolean; list: string[] };
type PageCopy = {
  meta: { title: string; description: string };
  h1: string;
  blocks: Block[];
  body: string[];
  cta: string;
};

async function run() {
  const payload = await getPayload({ config });
  const pages = content as Record<string, Record<Locale, PageCopy>>;
  const slugs = Object.keys(pages).filter((s) => s !== "home");

  // ── backup ──
  const backup: Record<string, unknown> = {};
  for (const slug of slugs) {
    backup[slug] = {};
    for (const locale of LOCALES) {
      const found = await payload.find({
        collection: "services",
        where: { slug: { equals: slug } },
        locale,
        limit: 1,
        depth: 0,
      });
      (backup[slug] as Record<string, unknown>)[locale] = found.docs[0] ?? null;
    }
  }
  const backupPath = new URL("./seo-backup.json", import.meta.url).pathname;
  writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`backup written: ${backupPath}\n`);

  // ── apply ──
  for (const slug of slugs) {
    const existing = await payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      locale: "en",
      limit: 1,
      depth: 0,
    });
    const id = existing.docs[0]?.id;
    if (!id) {
      console.log(`!! ${slug}: not found in CMS — skipped`);
      continue;
    }

    for (const locale of LOCALES) {
      const c = pages[slug][locale];
      const data = {
        h1: c.h1,
        meta: c.meta,
        cta: c.cta,
        body: list(c.body),
        blocks: c.blocks.map((b) => ({
          heading: b.heading,
          intro: b.intro,
          ordered: Boolean(b.ordered),
          list: list(b.list),
        })),
      };
      if (APPLY) {
        await payload.update({ collection: "services", id, locale, data: data as never });
      }
    }
    console.log(
      `${APPLY ? "✓ wrote" : "would write"} ${slug}: ` +
        `"${pages[slug].en.meta.title}" / h1="${pages[slug].en.h1}"`,
    );
  }

  console.log(`\n${APPLY ? "Applied" : "Dry-run"} — ${slugs.length} services × ${LOCALES.length} locales.`);
  if (!APPLY) console.log("Re-run with APPLY=1 to write to the DB.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
