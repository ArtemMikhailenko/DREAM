import { portfolioCategories, portfolioTagMap, portfolioEmpty, portfolioResults } from "@/lib/inner-copy";
import { AD_RESULTS } from "@/lib/home-copy";
import "../../home-v2.css";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { PortfolioBrowser } from "@/components/PortfolioBrowser";
import { CASE_IMAGES, CASE_SLUGS } from "@/lib/portfolio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale as Locale, "/portfolio"),
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
  const categories = portfolioCategories(locale);
  const pr = portfolioResults(locale);
  const cases = t.raw("cases") as {
    title: string;
    tag: string;
    client: string;
    result: string;
    image?: string;
  }[];

  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Page hero ── */}
      <section className="page-hero s-ink pf-hero">
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

      {/* ── Filter + cases grid (interactive) ── */}
      <section className="section s-dark pf-cases" id="cases">
        <div className="bg-wood" aria-hidden="true" />
        <div className="wrap">
          <PortfolioBrowser
            categories={categories}
            cases={cases.map((c) => ({ ...c, tag: portfolioTagMap[c.tag] ?? c.tag }))}
            empty={portfolioEmpty(locale)}
            // Covers come from the CMS (Кейсы → Обложка); the shipped stock photo
            // is the fallback for a case that has none yet.
            images={cases.map((c, i) => c.image ?? CASE_IMAGES[i].replace("w=1600", "w=1000"))}
            slugs={[...CASE_SLUGS]}
          />
        </div>
      </section>


      {/* ── Ad results: real campaign screenshots ── */}
      <section className="section s-plain pf-results" id="ad-results">
        <div className="s-plain-glow" aria-hidden="true" />
        <div className="wrap">
          <p className="label">{pr.label}</p>
          <h2 className="sec-h">{pr.heading} <em>{pr.em}</em></h2>
          <p className="pf-res-sub">{pr.sub}</p>
          <div className="pf-res-grid">
            {AD_RESULTS.map((src) => (
              <figure className="pf-res-card" key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
