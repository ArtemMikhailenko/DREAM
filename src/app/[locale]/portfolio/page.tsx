import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";

const caseImages = [
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=70",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio.meta" });
  const path = locale === "en" ? "/portfolio" : `/${locale}/portfolio`;
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: path,
      languages: {
        en: "/portfolio",
        ru: "/ru/portfolio",
        he: "/he/portfolio",
        "x-default": "/portfolio",
      },
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");
  const categories = t.raw("categories") as string[];
  const cases = t.raw("cases") as {
    title: string;
    tag: string;
    client: string;
    result: string;
  }[];

  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Page hero ── */}
      <section className="page-hero s-ink">
        <div className="bg-wood" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Works</div>
        <div className="wrap page-hero-inner">
          <p className="label">{t("hero.label")}</p>
          <h1 className="page-hero-h">
            {t("hero.heading")} <em>{t("hero.headingEm")}</em>
          </h1>
          <p className="page-hero-sub">{t("hero.sub")}</p>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <div className="section s-dark2" style={{ paddingBlock: "40px" }}>
        <div className="bg-wood" aria-hidden="true" />
        <div className="wrap">
          <div className="portfolio-filter">
            {categories.map((c) => (
              <span className="portfolio-filter-item" key={c}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cases grid ── */}
      <section className="section s-dark" id="cases" style={{ paddingTop: 0 }}>
        <div className="bg-wood" aria-hidden="true" />
        <div className="wrap">
          <div className="portfolio-grid portfolio-grid-lg">
            {cases.map((c, i) => (
              <a className="portfolio-case" href="#" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="portfolio-case-img"
                  src={caseImages[i]}
                  alt={c.title}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="portfolio-case-grad" />
                <div className="portfolio-case-info">
                  <span className="portfolio-case-tag">{c.tag}</span>
                  <h2 className="portfolio-case-title">{c.title}</h2>
                  <p className="portfolio-case-meta">{c.client} · <strong>{c.result}</strong></p>
                </div>
                <span className="portfolio-case-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section s-concrete" id="cta">
        <div className="bg-wood" aria-hidden="true" />
        <div className="wrap" style={{ textAlign: "center" }}>
          <p className="label">{t("cta.label")}</p>
          <h2 className="sec-h">{t("cta.heading")} <em>{t("cta.headingEm")}</em></h2>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 40 }}>
            <Link className="btn-p" href="/#lead">{t("cta.ctaBrief")} ↗</Link>
            <Link className="btn-o" href="/about">{t("cta.ctaAbout")} ↗</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
