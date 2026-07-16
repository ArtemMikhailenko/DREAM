import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { cache } from "react";
import { routing } from "./routing";
import { buildMessages } from "@/lib/messages";

// Dedupe within a render pass: every page pulls the same tree, so the CMS is
// queried once per locale per request instead of once per component.
const load = cache(buildMessages);

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // Content lives in Payload (/admin). Pages stay statically generated — saving
    // in the CMS revalidates them via the hook in src/hooks/revalidate.ts.
    messages: await load(locale),
  };
});
