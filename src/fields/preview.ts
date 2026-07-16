/**
 * "Открыть на сайте" links for the admin.
 *
 * Payload renders a Preview button in the edit view when `admin.preview` is set.
 * The site keeps English at the root and prefixes /ru and /he, so the locale the
 * editor is currently in has to be mapped to that scheme — otherwise the button
 * would always send them to the English page.
 */
import { LOCALE_PREFIX } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type PreviewArgs = { locale?: string };

/** /about → https://site/ru/about for the ru locale, https://site/about for en. */
export const previewPath =
  (build: (doc: Record<string, unknown>) => string) =>
  (doc: unknown, { locale }: PreviewArgs = {}) => {
    const path = build((doc ?? {}) as Record<string, unknown>);
    // Same prefix map the site uses — Hebrew previews must open /heb, not /he.
    const prefix = locale && locale !== "en" ? LOCALE_PREFIX[locale as Locale] ?? "" : "";
    return `${SITE}${prefix}${path}`;
  };
