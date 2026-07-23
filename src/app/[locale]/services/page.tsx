import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { CONTACTS } from "@/lib/contacts";

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

  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Hero ── */}
      <section className="page-hero s-ink">
        <div className="bg-gray seam-down pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Services</div>
        <span className="brand-watermark" aria-hidden="true">dc.prod</span>
        <div className="wrap page-hero-inner">
          <p className="label">{t("label")}</p>
          <h1 className="page-hero-h">{t("h1")}</h1>
          <p className="page-hero-sub">{t("sub")}</p>
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
            <span className="ticker-item" key={i}>{t(`items.${s.slug}.title`)}</span>
          ))}
        </div>
      </div>

      {/* ── Grid of all services ── */}
      <section className="section s-dark2">
        <div className="bg-gromophon" aria-hidden="true" />
        <div className="wrap">
          <div className="svc-index-grid">
            {SLUGS.map(({ slug, tag }, i) => (
              <Link key={slug} href={`/services/${slug}`} className="svc-index-card">
                <div className="svc-index-head">
                  <span className="svc-index-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="svc-index-tag">{tag}</span>
                </div>
                <h2 className="svc-index-title">{t(`items.${slug}.title`)}</h2>
                <p className="svc-index-teaser">{t(`items.${slug}.teaser`)}</p>
                <span className="svc-index-more">
                  {t("more")} <span aria-hidden="true">↗</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section s-ink" id="cta">
        <div className="bg-gray seam-up pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 className="sec-h">{t("cta.heading")}</h2>
          <p className="page-hero-sub" style={{ margin: "20px auto 0" }}>{t("cta.text")}</p>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 36 }}>
            <a className="btn-p" href={WHATSAPP_URL} target="_blank" rel="noopener">
              {t("cta.btn")} ↗
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
