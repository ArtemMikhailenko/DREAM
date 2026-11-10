import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { cache } from "react";
import { routing } from "./routing";
import { buildMessagesFromDb } from "@/lib/messages-db";
import es from "./es.json";

// Dedupe within a render pass: every page pulls the same tree, so the DB is
// queried once per locale per request instead of once per component.
const load = cache(buildMessagesFromDb);

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // Content is read straight from Postgres (see lib/messages-db.ts) and edited in
    // the custom /studio admin, which revalidates pages on save. Pages stay static.
    // Spanish copy ships with the code (src/i18n/es.json) rather than living in the CMS:
    // adding a locale to the database would mean a schema migration on production.
    messages: locale === "es" ? (es as Record<string, unknown>) : await load(locale as "en" | "ru" | "he"),
  };
});
