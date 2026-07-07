import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";

const SLUG = "/services";

// Fixed display order for the services grid.
const SLUGS = [
  "seo",
  "targeted-advertising",
  "smm",
  "google-ads",
  "photo-video",
  "marketing-strategy",
  "website-development",
  "automation",
  "geo-ai-seo",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesIndex.meta" });
  const path = (loc: string) => (loc === "en" ? SLUG : `/${loc}${SLUG}`);
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: path(locale),
      languages: { en: path("en"), ru: path("ru"), he: path("he"), "x-default": path("en") },
    },
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

  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Hero ── */}
      <section className="page-hero s-ink">
        <div className="bg-gray seam-down pin" aria-hidden="true" />
        <div className="wrap page-hero-inner">
          <p className="label">{t("label")}</p>
          <h1 className="page-hero-h">{t("h1")}</h1>
          <p className="page-hero-sub">{t("sub")}</p>
        </div>
      </section>

      {/* ── Grid of all services ── */}
      <section className="section s-dark">
        <div className="bg-gray seam-up pin" aria-hidden="true" />
        <div className="wrap">
          <div className="svc-index-grid">
            {SLUGS.map((slug, i) => (
              <Link key={slug} href={`/services/${slug}`} className="svc-index-card">
                <span className="svc-index-num">{String(i + 1).padStart(2, "0")}</span>
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

      <SiteFooter />
    </>
  );
}
