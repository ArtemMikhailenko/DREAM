import { aboutCopy, aboutTags } from "@/lib/inner-copy";
import { ParticleCluster } from "@/components/home/ParticleCluster";
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
  const t = await getTranslations("About");  const ac = aboutCopy(locale);
  const capabilities = aboutTags(locale);
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
      <section className="page-hero s-ink about-hero">
        <div className="bg-gray seam-down pin" aria-hidden="true" />
        <div className="bg-darts" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Studio</div>
        <div className="wrap page-hero-inner">
          <p className="label">{ac.heroLabel}</p>
          <h1 className="page-hero-h">
            {ac.heroHeading} <em>{ac.heroEm}</em>
          </h1>
          <p className="page-hero-sub">{ac.heroSub}</p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="section s-dark" id="story">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="wrap">
          <div className="about-grid">
            <div className="about-copy">
              <p className="label">{ac.storyLabel}</p>
              <h2 className="sec-h">{ac.storyHeading}</h2>
              <p>{ac.p1}</p>
              <p>{ac.p2}</p>
              <div className="about-tags">
                {capabilities.map((c) => (
                  <span className="about-tag" key={c}>{c}</span>
                ))}
              </div>
            </div>
            <div className="about-vis">
              <ParticleCluster />
              <p className="about-vis-slogan">{ac.slogan}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section s-dark2" id="values">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Values</div>
        <div className="wrap">
          <p className="label">{ac.valuesLabel}</p>
          <h2 className="sec-h">{ac.valuesHeading}</h2>
          <div className="vg">
            {ac.values.map((v, i) => (
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
          <h2 className="sec-h about-clients-h">{ac.clientsHeading}</h2>
        </div>
        <div className="wrap">
          <StatRow items={statItems} />
        </div>
        <ProjectWall cases={wallCases} label="" />
      </section>


      <CardGlow selector=".vg-card, .sr-item" />

      <SiteFooter />
    </>
  );
}
