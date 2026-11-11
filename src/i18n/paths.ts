import { routing, type Locale } from "./routing";

/**
 * Single source of truth for locale URLs.
 *
 * The URL prefix and the language code deliberately differ for Hebrew: the path
 * is /heb (per the SEO spec) while the hreflang code stays `he` (ISO 639-1, what
 * Google expects). Every canonical and alternates block must go through here —
 * before this existed each page hardcoded its own "/he/..." and they drifted.
 */
export const LOCALE_PREFIX: Record<Locale, string> = {
  en: "",
  ru: "/ru",
  he: "/heb",
  es: "/es",
  ar: "/ar",
};

/** ("he", "/about") → "/heb/about"; ("en", "") → "/" */
export function localePath(locale: Locale, path = ""): string {
  return `${LOCALE_PREFIX[locale]}${path}` || "/";
}

/**
 * alternates.languages for a path, including x-default → English.
 * Pass the path without any locale prefix, e.g. "/services/smm".
 */
export function altLanguages(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localePath(locale, path);
  }
  languages["x-default"] = localePath(routing.defaultLocale, path);
  return languages;
}

/** canonical + languages in one call — what every generateMetadata needs. */
export function alternates(locale: Locale, path = "") {
  return { canonical: localePath(locale, path), languages: altLanguages(path) };
}

const OG_LOCALE: Record<Locale, string> = { en: "en_US", ru: "ru_RU", he: "he_IL", es: "es_ES", ar: "ar_AR" };
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dreamchaseprod.com";

/**
 * Open Graph / Twitter tags for a page, built from the same title and description
 * the page uses, so social previews and Google never disagree with the snippet.
 */
export function social(locale: Locale, path: string, title: string, description: string) {
  return {
    openGraph: {
      type: "website" as const,
      siteName: "DC Production",
      title,
      description,
      url: `${SITE}${localePath(locale, path)}`,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      // the shared preview card (public/og.jpg); listed here because a page's
      // own openGraph block replaces the inherited one
      images: [{ url: `${SITE}/og.jpg`, width: 1200, height: 630, alt: "DC Production" }],
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [`${SITE}/og.jpg`] },
  };
}
