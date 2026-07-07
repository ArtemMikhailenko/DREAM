import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru", "he"],
  defaultLocale: "en",
  // English lives at the root (no prefix); /ru and /he are prefixed.
  localePrefix: "as-needed",
  // Root "/" always serves English (no Accept-Language auto-switch) — keeps the
  // canonical English URL deterministic for SEO. Users switch via /ru, /he or the picker.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
