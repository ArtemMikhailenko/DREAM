import type { MetadataRoute } from "next";
import { CASE_SLUGS } from "@/lib/portfolio";
import { routing } from "@/i18n/routing";
import { LOCALE_PREFIX } from "@/i18n/paths";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dcprod.agency";

// Prefixes come from the shared map, so the sitemap can never disagree with the
// canonical/hreflang tags the pages emit (Hebrew: code `he`, path /heb).
const LOCALES = routing.locales.map((code) => ({ code, prefix: LOCALE_PREFIX[code] }));

// Public pages. Service pages are added here as they ship.
const PAGES: { path: string; priority: number; freq: "weekly" | "monthly" }[] = [
  { path: "", priority: 1, freq: "weekly" },
  { path: "/services", priority: 0.9, freq: "weekly" },
  { path: "/services/seo", priority: 0.9, freq: "weekly" },
  { path: "/services/targeted-advertising", priority: 0.9, freq: "weekly" },
  { path: "/services/smm", priority: 0.9, freq: "weekly" },
  { path: "/services/google-ads", priority: 0.8, freq: "weekly" },
  { path: "/services/photo-video", priority: 0.8, freq: "weekly" },
  { path: "/services/marketing-strategy", priority: 0.8, freq: "weekly" },
  { path: "/services/website-development", priority: 0.8, freq: "weekly" },
  { path: "/services/automation", priority: 0.8, freq: "weekly" },
  // Ниша только зарождается (140 запросов/мес) — реже обход, ниже приоритет.
  { path: "/services/geo-ai-seo", priority: 0.7, freq: "monthly" },
  { path: "/portfolio", priority: 0.9, freq: "weekly" },
  ...CASE_SLUGS.map((slug) => ({
    path: `/portfolio/${slug}`,
    priority: 0.7,
    freq: "monthly" as const,
  })),
  { path: "/about", priority: 0.8, freq: "monthly" },
  { path: "/testimonials", priority: 0.7, freq: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: `${siteUrl}${locale.prefix}${page.path}`,
      lastModified,
      changeFrequency: page.freq,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries([
          ...LOCALES.map((l) => [l.code, `${siteUrl}${l.prefix}${page.path}`]),
          ["x-default", `${siteUrl}${page.path}`],
        ]),
      },
    })),
  );
}
