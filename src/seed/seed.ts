/**
 * One-way migration: messages/{en,ru,he}.json → Payload.
 *
 * Run once against an empty CMS:  npm run seed
 *
 * English is written first (it creates the documents), then each other locale is
 * layered onto the same document ids so one document holds all three languages.
 * Re-running is safe: documents are matched by slug and updated in place.
 */
import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config";
import en from "../../messages/en.json";
import ru from "../../messages/ru.json";
import he from "../../messages/he.json";

type Locale = "en" | "ru" | "he";
const MESSAGES: Record<Locale, typeof en> = { en, ru: ru as typeof en, he: he as typeof en };
const LOCALES: Locale[] = ["en", "ru", "he"];

/** ["a","b"] → [{text:"a"},{text:"b"}] */
const list = (v?: unknown) =>
  Array.isArray(v) ? v.map((t) => ({ text: String(t) })) : [];

async function run() {
  const payload = await getPayload({ config });

  const globalData = (m: typeof en) => ({
    nav: m.Nav,
    showreel: {
      ...m.Showreel,
      orbit: list(m.Showreel.orbit),
    },
    "lead-form": {
      ...m.LeadForm,
      services: list(m.LeadForm.services),
    },
    "services-index": {
      meta: m.ServicesIndex.meta,
      label: m.ServicesIndex.label,
      h1: m.ServicesIndex.h1,
      sub: m.ServicesIndex.sub,
      more: m.ServicesIndex.more,
      other: m.ServicesIndex.other,
      stats: list(m.ServicesIndex.stats),
      cta: m.ServicesIndex.cta,
    },
    "portfolio-page": {
      meta: m.Portfolio.meta,
      hero: m.Portfolio.hero,
      categories: list(m.Portfolio.categories),
      cta: m.Portfolio.cta,
      ui: m.Portfolio.ui,
    },
    "testimonials-page": {
      meta: m.Testimonials.meta,
      hero: m.Testimonials.hero,
      featuredLabel: m.Testimonials.featuredLabel,
      all: m.Testimonials.all,
      cta: m.Testimonials.cta,
    },
    about: {
      meta: m.About.meta,
      hero: m.About.hero,
      story: {
        ...m.About.story,
        capabilities: list(m.About.story.capabilities),
      },
      values: m.About.values,
      stats: m.About.stats,
      cta: m.About.cta,
    },
    home: {
      meta: m.Home.meta,
      hero: m.Home.hero,
      rail: { head: m.Home.rail.head, items: list(m.Home.rail.items) },
      problem: m.Home.problem,
      services: {
        ...m.Home.services,
        items: m.Home.services.items.map((i) => ({
          title: i.title,
          text: i.text,
          deliverables: list(i.deliverables),
        })),
      },
      process: m.Home.process,
      statement: m.Home.statement,
      portfolio: m.Home.portfolio,
      results: m.Home.results,
      pricing: m.Home.pricing,
      faq: m.Home.faq,
      lead: m.Home.lead,
    },
  });

  // ── Globals ──
  for (const locale of LOCALES) {
    const data = globalData(MESSAGES[locale]);
    for (const [slug, value] of Object.entries(data)) {
      await payload.updateGlobal({
        slug: slug as Parameters<typeof payload.updateGlobal>[0]["slug"],
        locale,
        data: value as never,
        depth: 0,
      });
    }
    console.log(`globals: ${locale} ✓`);
  }

  // ── Services ──
  const serviceSlugs = Object.keys(en.Services);
  for (const [i, slug] of serviceSlugs.entries()) {
    const existing = await payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      limit: 1,
      locale: "en",
    });

    const build = (locale: Locale) => {
      const m = MESSAGES[locale];
      const svc = m.Services[slug as keyof typeof m.Services];
      const idx = m.ServicesIndex.items[slug as keyof typeof m.ServicesIndex.items];
      return {
        slug,
        order: i,
        label: svc.label,
        h1: svc.h1,
        meta: svc.meta,
        cta: svc.cta,
        body: list(svc.body),
        blocks: svc.blocks.map((b) => ({
          heading: b.heading,
          intro: b.intro,
          ordered: "ordered" in b ? Boolean(b.ordered) : false,
          list: list(b.list),
        })),
        index: { title: idx.title, teaser: idx.teaser },
        _status: "published" as const,
      };
    };

    const id =
      existing.docs[0]?.id ??
      (await payload.create({ collection: "services", locale: "en", data: build("en") })).id;

    for (const locale of LOCALES) {
      await payload.update({ collection: "services", id, locale, data: build(locale) });
    }
    console.log(`service: ${slug} ✓`);
  }

  // ── Cases ──
  const { CASE_SLUGS } = await import("../lib/portfolio");
  for (const [i, slug] of CASE_SLUGS.entries()) {
    const existing = await payload.find({
      collection: "cases",
      where: { slug: { equals: slug } },
      limit: 1,
      locale: "en",
    });

    const build = (locale: Locale) => {
      const c = MESSAGES[locale].Portfolio.cases[i];
      return {
        slug,
        order: i,
        title: c.title,
        tag: c.tag,
        client: c.client,
        result: c.result,
        summary: c.summary,
        body: list(c.body),
        services: list(c.services),
        _status: "published" as const,
      };
    };

    const id =
      existing.docs[0]?.id ??
      (await payload.create({ collection: "cases", locale: "en", data: build("en") })).id;

    for (const locale of LOCALES) {
      await payload.update({ collection: "cases", id, locale, data: build(locale) });
    }
    console.log(`case: ${slug} ✓`);
  }

  // ── Testimonials ── (no slug in the source; matched by position)
  for (let i = 0; i < en.Testimonials.reviews.length; i++) {
    const existing = await payload.find({
      collection: "testimonials",
      where: { order: { equals: i } },
      limit: 1,
      locale: "en",
    });

    const build = (locale: Locale) => {
      const r = MESSAGES[locale].Testimonials.reviews[i];
      return {
        order: i,
        quote: r.quote,
        name: r.name,
        company: r.company,
        role: r.role,
        _status: "published" as const,
      };
    };

    const id =
      existing.docs[0]?.id ??
      (await payload.create({ collection: "testimonials", locale: "en", data: build("en") })).id;

    for (const locale of LOCALES) {
      await payload.update({ collection: "testimonials", id, locale, data: build(locale) });
    }
  }
  console.log(`testimonials: ${en.Testimonials.reviews.length} ✓`);

  console.log("\nSeed complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
