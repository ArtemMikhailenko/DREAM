import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { ScrollAnimations } from "@/components/ScrollAnimations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Testimonials.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale as Locale, "/testimonials"),
  };
}

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Testimonials");
  const reviews = t.raw("reviews") as {
    quote: string;
    name: string;
    company: string;
    role: string;
  }[];

  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Page hero ── */}
      <section className="page-hero s-ink">
        <div className="s-bg-word" aria-hidden="true">Clients</div>
        <div className="wrap page-hero-inner">
          <p className="label">{t("hero.label")}</p>
          <h1 className="page-hero-h">
            {t("hero.heading")} <em>{t("hero.headingEm")}</em>
          </h1>
          <p className="page-hero-sub">{t("hero.sub")}</p>
        </div>
      </section>

      {/* ── Featured carousel ── */}
      <section className="section s-dark2" id="featured">
        <div className="wrap">
          <p className="label">{t("featuredLabel")}</p>
          <ReviewsCarousel reviews={reviews} />
        </div>
      </section>

      {/* ── All reviews list ── */}
      <section className="section s-dark" id="all">
        <div className="s-bg-word" aria-hidden="true">Reviews</div>
        <div className="wrap">
          <p className="label">{t("all.label")}</p>
          <h2 className="sec-h">{t("all.heading")} <em>{t("all.headingEm")}</em></h2>
          <div className="rev-list">
            {reviews.map((r, i) => (
              <div className="rev-item" key={i}>
                <div className="rev-q-block">
                  <span className="rev-qmark" aria-hidden="true">&ldquo;</span>
                  <p className="rev-quote">{r.quote}</p>
                </div>
                <div className="rev-meta">
                  <p className="rev-author-name">{r.name}</p>
                  {r.company && (
                    <p className="rev-author-role">{r.company}</p>
                  )}
                  <p className="rev-author-role">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section s-concrete" id="cta">
        <div className="wrap" style={{ textAlign: "center" }}>
          <p className="label">{t("cta.label")}</p>
          <h2 className="sec-h">{t("cta.heading")} <em>{t("cta.headingEm")}</em></h2>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 40 }}>
            <Link className="btn-p" href="/#lead">{t("cta.ctaBrief")} ↗</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
