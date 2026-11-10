import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { CONTACTS } from "@/lib/contacts";
import { servicesCopy } from "@/lib/inner-copy";
import { homeCopy } from "@/lib/home-copy";
import { LeadButton } from "@/components/home/LeadButton";
import { LeadWindow } from "@/components/home/LeadWindow";
import "../../home-v2.css";

const SLUG = "/services";

const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? CONTACTS.whatsapp;

// Fixed display order + short mono category tag per service.
const SLUGS: { slug: string; tag: string }[] = [
  { slug: "seo", tag: "SEO" },
  { slug: "targeted-advertising", tag: "ADS" },
  { slug: "smm", tag: "SMM" },
  { slug: "google-ads", tag: "PPC" },
  { slug: "photo-video", tag: "MEDIA" },
  { slug: "marketing-strategy", tag: "GTM" },
  { slug: "website-development", tag: "WEB" },
  { slug: "automation", tag: "BOTS" },
  { slug: "geo-ai-seo", tag: "GEO" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesIndex.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale as Locale, SLUG),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ServicesIndex");
  const stats = t.raw("stats") as string[];
  const sc = servicesCopy(locale);

  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Hero ── */}
      <section className="page-hero s-ink">
        <div className="bg-gray seam-down pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Services</div>
        <span className="brand-watermark" aria-hidden="true">dc.production</span>
        <div className="wrap page-hero-inner">
          <p className="label">{t("label")}</p>
          <h1 className="page-hero-h">{t("h1")}</h1>
          <p className="page-hero-sub">{sc.sub}</p>
          <div className="svc-hub-meta">
            {stats.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="ticker ticker-cream" aria-hidden="true">
        <div className="ticker-track">
          {[...SLUGS, ...SLUGS].map((s, i) => (
            <span className="ticker-item" key={i}>{sc.items[s.slug]?.title ?? t(`items.${s.slug}.title`)}</span>
          ))}
        </div>
      </div>

      {/* ── Grid of all services ── */}
      <section className="section s-dark2">
        <div className="bg-gray seam-mid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap">
          <div className="svc-index-grid">
            {SLUGS.map(({ slug, tag }, i) => {
              const it = sc.items[slug];
              return (
                <article key={slug} className="svc-index-card">
                  <div className="svc-index-head">
                    <span className="svc-index-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="svc-index-tag">{it?.tag ?? tag}</span>
                  </div>
                  <h2 className="svc-index-title"><Link href={`/services/${slug}`}>{it?.title ?? t(`items.${slug}.title`)}</Link></h2>
                  <p className="svc-index-teaser">{it?.teaser ?? t(`items.${slug}.teaser`)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section s-ink" id="cta">
        <div className="bg-gray seam-up pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 className="sec-h">{sc.ctaHeading}</h2>
          <p className="page-hero-sub" style={{ margin: "20px auto 0" }}>{sc.ctaText}</p>
          <div className="hero-actions svc-cta-actions">
            <LeadButton className="h2-cta glass-btn cta-pulse"><span>{sc.ctaBtn}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></LeadButton>
            <a className="svc-wa" href={WHATSAPP_URL} target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3 1.8.7 2.5.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.5z"/><path d="M20.5 3.5C18.2 1.2 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.6 1.4 5.5 1.4h.1c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.3-8.3zM12 21.8h-.1c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.5-1.5-3.3-1.5-5.1 0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9 1.8 1.9 2.9 4.4 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <LeadWindow copy={homeCopy(locale)} />
      <SiteFooter />
    </>
  );
}
