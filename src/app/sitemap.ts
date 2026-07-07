import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dcprod.agency";

// Locale → URL prefix. English is the root (no prefix); /ru and /he are prefixed.
const LOCALES: { code: string; prefix: string }[] = [
  { code: "en", prefix: "" },
  { code: "ru", prefix: "/ru" },
  { code: "he", prefix: "/he" },
];

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
  { path: "/services/geo-ai-seo", priority: 0.8, freq: "weekly" },
  { path: "/portfolio", priority: 0.9, freq: "weekly" },
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
