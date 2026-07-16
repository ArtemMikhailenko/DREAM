import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { routing } from "@/i18n/routing";
import { CASE_IMAGES, CASE_SLUGS } from "@/lib/portfolio";

type Case = {
  title: string;
  tag: string;
  client: string;
  result: string;
  summary: string;
  body: string[];
  services: string[];
  image?: string;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASE_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const i = CASE_SLUGS.indexOf(slug as (typeof CASE_SLUGS)[number]);
  if (i < 0) return {};
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  const c = (t.raw("cases") as Case[])[i];
  const path = (loc: string) =>
    loc === "en" ? `/portfolio/${slug}` : `/${loc}/portfolio/${slug}`;
  return {
    title: `${c.title} — ${c.client}`,
    description: c.summary,
    alternates: {
      canonical: path(locale),
      languages: {
        en: path("en"),
        ru: path("ru"),
        he: path("he"),
        "x-default": path("en"),
      },
    },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const i = CASE_SLUGS.indexOf(slug as (typeof CASE_SLUGS)[number]);
  if (i < 0) notFound();

  const t = await getTranslations("Portfolio");
  const ui = t.raw("ui") as Record<string, string>;
  const cases = t.raw("cases") as Case[];
  const c = cases[i];
  const img = c.image ?? CASE_IMAGES[i];
  const nextIdx = (i + 1) % CASE_SLUGS.length;

  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Hero ── */}
      <section className="page-hero s-ink case-hero">
        <div className="bg-gray seam-down pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap page-hero-inner">
          <Link href="/portfolio" className="case-back">← {ui.back}</Link>
          <p className="label">{c.tag}</p>
          <h1 className="page-hero-h">{c.title}</h1>
          <p className="page-hero-sub">{c.summary}</p>
          <div className="case-meta">
            <div>
              <span className="case-meta-l">{ui.clientLabel}</span>
              <b>{c.client}</b>
            </div>
            <div>
              <span className="case-meta-l">{ui.resultLabel}</span>
              <b className="case-meta-res">{c.result}</b>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cover ── */}
      <section className="section s-dark" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="case-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={c.title} loading="eager" decoding="async" />
          </div>
        </div>
      </section>

      {/* ── Overview + services ── */}
      <section className="section s-dark2">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="wrap case-grid">
          <div className="case-overview">
            <p className="label">{ui.overview}</p>
            {c.body.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
          <aside className="case-services">
            <p className="case-services-t">{ui.servicesLabel}</p>
            <ul>
              {c.services.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section s-ink" id="cta">
        <div className="bg-gray seam-up pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap" style={{ textAlign: "center", maxWidth: 740, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 className="sec-h">
            {t("cta.heading")} <em>{t("cta.headingEm")}</em>
          </h2>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 38 }}>
            <Link className="btn-p" href="/#lead">{ui.cta} ↗</Link>
            <Link className="btn-o" href={`/portfolio/${CASE_SLUGS[nextIdx]}`}>
              {ui.next} ↗
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
