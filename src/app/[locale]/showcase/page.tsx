import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import "../../home-v2.css";
import "./showcase.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ShowcaseBrowser } from "@/components/ShowcaseBrowser";
import { AD_CAMPAIGNS } from "@/lib/ad-results";
import { portfolioSites } from "@/lib/inner-copy";
import { showcaseCopy } from "@/lib/showcase-copy";
import { CONTACTS } from "@/lib/contacts";

/**
 * Hidden client showcase — /showcase, /ru/showcase, /heb/showcase …
 * Sent to clients in WhatsApp instead of Drive folders. Not linked from the menu,
 * not in the sitemap, closed to search engines (noindex), so it does not affect
 * the site's SEO. Media load lazily: only the covers on first paint.
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
  const t = showcaseCopy(locale);
  const ps = portfolioSites(locale);

  return (
    <>
      <SiteNav />
      <main className="sc-page s-dark">
        <div className="bg-gray seam-mid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap">
          <header className="sc-hero">
            <p className="label">{t.kicker}</p>
            <h1 className="sc-title">{t.title} <em>{t.em}</em></h1>
            <p className="sc-sub">{t.sub}</p>
          </header>
          <ShowcaseBrowser locale={locale} sites={ps.items} results={AD_CAMPAIGNS} />
          <section className="sc-end">
            <h2>{t.cta}</h2>
            <p>{t.ctaText}</p>
            <a className="glass-btn cta-pulse sc-end-btn" href={CONTACTS.whatsapp} target="_blank" rel="noopener">{t.ctaBtn}</a>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
