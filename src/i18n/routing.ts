import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru", "he"],
  defaultLocale: "en",
  // English lives at the root (no prefix); /ru and /heb are prefixed.
  //
  // Hebrew keeps the locale code `he` — that is the ISO 639-1 code Google expects
  // in hreflang — while its URL prefix is /heb, per the SEO spec. next-intl's
  // `prefixes` map is what lets the two differ. Build URLs via @/i18n/paths, never
  // by interpolating the locale.
  localePrefix: {
    mode: "as-needed",
    prefixes: { he: "/heb" },
  },
  // Root "/" always serves English (no Accept-Language auto-switch) — keeps the
  // canonical English URL deterministic for SEO. Users switch via /ru, /heb or the picker.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
