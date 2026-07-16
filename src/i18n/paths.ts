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
