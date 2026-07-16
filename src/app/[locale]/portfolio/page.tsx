import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

      {/* ── Filter + cases grid (interactive) ── */}
      <section className="section s-dark" id="cases">
        <div className="bg-wood" aria-hidden="true" />
        <div className="wrap">
          <PortfolioBrowser
            categories={categories}
            cases={cases}
            images={CASE_IMAGES.map((u) => u.replace("w=1600", "w=1000"))}
            slugs={[...CASE_SLUGS]}
          />
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
