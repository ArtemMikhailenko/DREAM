import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import "../../home-v2.css";
import "./showcase.css";
import { ShowcaseBrowser } from "@/components/ShowcaseBrowser";
import { AD_CAMPAIGNS } from "@/lib/ad-results";
import { portfolioSites } from "@/lib/inner-copy";
import { showcaseCopy } from "@/lib/showcase-copy";
import { CONTACTS } from "@/lib/contacts";

/**
 * Hidden client showcase — /showcase, /ru/showcase, /heb/showcase …
 * Sent to clients in WhatsApp instead of Drive folders. Its own header (logo,
 * languages, light/dark switch) — no links to the rest of the site. Not in the
 * menu or the sitemap, closed to search engines (noindex), so it does not touch
 * the site's SEO. Media load lazily: covers only on first paint.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = showcaseCopy(locale);
  return {
    title: t.meta,
    description: t.sub,
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  };
}

export default async function ShowcasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ps = portfolioSites(locale);

  return (
    <div id="sc-root" className="scx" data-theme="dark" suppressHydrationWarning>
      <ShowcaseBrowser locale={locale} sites={ps.items} results={AD_CAMPAIGNS} waMain={CONTACTS.whatsapp} />
    </div>
  );
}
