import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "@/i18n/routing";

/**
 * Builds the next-intl message tree for a locale out of Payload.
 *
 * The Payload field names mirror the message keys the components already read
 * (`t("Home.hero.kicker")`), so this is a structural copy plus two conversions:
 *  - Payload arrays of {text} rows become plain string arrays
 *  - the Services / Cases / Testimonials collections fold back into the
 *    Services, Portfolio.cases and Testimonials.reviews namespaces
 *
 * Keeping this shape identical to the old messages/*.json is what let the CMS
 * land without touching a single component.
 */

type Row = { text?: string | null };
/** [{text:"a"}] → ["a"] */
const flat = (rows?: Row[] | null): string[] =>
  (rows ?? []).map((r) => r?.text ?? "").filter(Boolean);

/** Strip Payload bookkeeping (id, createdAt…) that would otherwise leak into messages. */
const clean = (obj: unknown): Record<string, unknown> => {
  if (!obj || typeof obj !== "object") return {};
  const { id, createdAt, updatedAt, _status, globalType, ...rest } = obj as Record<string, unknown>;
  void id, createdAt, updatedAt, _status, globalType;
  return rest;
};

export async function buildMessages(locale: Locale) {
  const payload = await getPayload({ config });
  const opts = { locale, depth: 0 as const, fallbackLocale: "en" as const };

  const [nav, home, showreel, servicesIndex, portfolioPage, testimonialsPage, about, leadForm] =
    await Promise.all([
      payload.findGlobal({ slug: "nav", ...opts }),
      payload.findGlobal({ slug: "home", ...opts }),
      payload.findGlobal({ slug: "showreel", ...opts }),
      payload.findGlobal({ slug: "services-index", ...opts }),
      payload.findGlobal({ slug: "portfolio-page", ...opts }),
      payload.findGlobal({ slug: "testimonials-page", ...opts }),
      payload.findGlobal({ slug: "about", ...opts }),
      payload.findGlobal({ slug: "lead-form", ...opts }),
    ]);

  const [services, cases, reviews] = await Promise.all([
    payload.find({ collection: "services", limit: 100, sort: "order", ...opts }),
    payload.find({ collection: "cases", limit: 100, sort: "order", ...opts }),
    payload.find({ collection: "testimonials", limit: 100, sort: "order", ...opts }),
  ]);

  // Services → both the per-page namespace and the index cards.
  const Services: Record<string, unknown> = {};
  const indexItems: Record<string, unknown> = {};
  for (const s of services.docs) {
    Services[s.slug] = {
      meta: clean(s.meta),
      label: s.label,
      h1: s.h1,
      body: flat(s.body),
      blocks: (s.blocks ?? []).map((b) => ({
        heading: b.heading,
        intro: b.intro,
        ...(b.ordered ? { ordered: true } : {}),
        list: flat(b.list),
      })),
      cta: s.cta,
    };
    indexItems[s.slug] = {
      title: s.index?.title ?? "",
      teaser: s.index?.teaser ?? "",
    };
  }

  return {
    Nav: clean(nav),
    Home: {
      meta: clean(home.meta),
      hero: clean(home.hero),
      rail: { head: home.rail?.head, items: flat(home.rail?.items) },
      problem: clean(home.problem),
      services: {
        ...clean(home.services),
        items: (home.services?.items ?? []).map((i) => ({
          title: i.title,
          text: i.text,
          deliverables: flat(i.deliverables),
        })),
      },
      process: clean(home.process),
      statement: clean(home.statement),
      portfolio: clean(home.portfolio),
      results: clean(home.results),
      pricing: clean(home.pricing),
      faq: clean(home.faq),
      lead: clean(home.lead),
    },
    LeadForm: {
      ...clean(leadForm),
      services: flat(leadForm.services),
    },
    About: {
      meta: clean(about.meta),
      hero: clean(about.hero),
      story: {
        ...clean(about.story),
        capabilities: flat(about.story?.capabilities),
      },
      values: clean(about.values),
      stats: clean(about.stats),
      cta: clean(about.cta),
    },
    Portfolio: {
      meta: clean(portfolioPage.meta),
      hero: clean(portfolioPage.hero),
      categories: flat(portfolioPage.categories),
      cases: cases.docs.map((c) => ({
        title: c.title,
        tag: c.tag,
        client: c.client,
        result: c.result,
        summary: c.summary,
        body: flat(c.body),
        services: flat(c.services),
      })),
      cta: clean(portfolioPage.cta),
      ui: clean(portfolioPage.ui),
    },
    Testimonials: {
      meta: clean(testimonialsPage.meta),
      hero: clean(testimonialsPage.hero),
      featuredLabel: testimonialsPage.featuredLabel,
      all: clean(testimonialsPage.all),
      reviews: reviews.docs.map((r) => ({
        quote: r.quote,
        name: r.name,
        company: r.company,
        role: r.role,
      })),
      cta: clean(testimonialsPage.cta),
    },
    Services,
    ServicesIndex: {
      meta: clean(servicesIndex.meta),
      label: servicesIndex.label,
      h1: servicesIndex.h1,
      sub: servicesIndex.sub,
      more: servicesIndex.more,
      items: indexItems,
      stats: flat(servicesIndex.stats),
      cta: clean(servicesIndex.cta),
      other: servicesIndex.other,
    },
    Showreel: {
      ...clean(showreel),
      orbit: flat(showreel.orbit),
      feats: (showreel.feats ?? []).map((f) => ({ t: f.t, s: f.s, d: f.d })),
    },
  };
}
