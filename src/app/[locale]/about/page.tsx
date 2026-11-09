import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { ProjectWall, type WallCase } from "@/components/home/ProjectWall";
import { homeCopy } from "@/lib/home-copy";
import { CustomCursor } from "@/components/CustomCursor";
import { StatRow } from "@/components/home/StatRow";
import { CardGlow } from "@/components/CardGlow";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale as Locale, "/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const capabilities = t.raw("story.capabilities") as string[];
  const valueItems = t.raw("values.items") as { title: string; desc: string }[];
  const c = homeCopy(locale);
  const statItems = c.results;
  const tp = await getTranslations("Portfolio");
  const wallCases = tp.raw("cases") as WallCase[];

  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Page hero ── */}
      <section className="page-hero s-ink">
        <div className="bg-gray seam-down pin" aria-hidden="true" />
        <div className="bg-darts" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Studio</div>
        <div className="wrap page-hero-inner">
          <p className="label">{t("hero.label")}</p>
          <h1 className="page-hero-h">
            {t("hero.heading")} <em>{t("hero.headingEm")}</em>
          </h1>
          <p className="page-hero-sub">{t("hero.sub")}</p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="section s-dark" id="story">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="wrap">
          <div className="about-grid">
            <div className="about-copy">
              <p className="label">{t("story.label")}</p>
              <h2 className="sec-h">{t("story.heading")}</h2>
              <p>{t("story.p1")}</p>
              <p>{t("story.p2")}</p>
              <div className="about-tags">
                {capabilities.map((c) => (
                  <span className="about-tag" key={c}>{c}</span>
                ))}
              </div>
            </div>
            <div className="about-vis">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
                alt="dc.production studio"
              />
              <p className="about-vis-slogan">{t("story.slogan")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section s-dark2" id="values">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Values</div>
        <div className="wrap">
          <p className="label">{t("values.label")}</p>
          <h2 className="sec-h">{t("values.heading")} <em>{t("values.headingEm")}</em></h2>
          <div className="vg">
            {valueItems.map((v, i) => (
              <article className="vg-card" key={i}>
                <span className="vg-n" aria-hidden="true">0{i + 1}</span>
                <h3 className="vg-title">{v.title}</h3>
                <p className="vg-desc">{v.desc}</p>
                <span className="vg-line" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section s-dark2" id="impact">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="wrap">
          <p className="label">{t("stats.label")}</p>
          <h2 className="sec-h">{t("stats.heading")} <em>{t("stats.headingEm")}</em></h2>
        </div>
        <div className="wrap">
          <StatRow items={statItems} />
        </div>
        <ProjectWall cases={wallCases} label={c.wallLabel} />
      </section>

      {/* ── CTA ── */}
      <section className="section s-ink" id="cta">
        <div className="bg-gray seam-up pin" aria-hidden="true" />
        <div className="wrap" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <p className="label">{t("cta.label")}</p>
          <h2 className="sec-h">{t("cta.heading")} <em>{t("cta.headingEm")}</em></h2>
          <p style={{ color: "var(--cream2)", marginTop: 24, marginBottom: 40, fontSize: "1.05rem" }}>
            {t("cta.sub")}
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link className="btn-p" href="/#lead">{t("cta.ctaBrief")} ↗</Link>
            <Link className="btn-o" href="/portfolio">{t("cta.ctaWorks")} ↗</Link>
          </div>
        </div>
      </section>

      <CardGlow selector=".vg-card, .sr-item" />

      <CustomCursor />
      <SiteFooter />
    </>
  );
}
