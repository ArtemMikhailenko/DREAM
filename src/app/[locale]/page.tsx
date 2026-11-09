import { QuoteForm } from "@/components/QuoteForm";
import { VideoBlock } from "@/components/VideoBlock";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { HeroField, Timecode } from "@/components/home/HeroField";
import { PromoPopups } from "@/components/home/PromoPopups";
import { LeadButton } from "@/components/home/LeadButton";
import { ResultsOrbit } from "@/components/home/ResultsOrbit";
import { ChatWidget } from "@/components/home/ChatWidget";
import { WatchButton } from "@/components/home/WatchButton";
import { MobileCta } from "@/components/home/MobileCta";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { StatRow } from "@/components/home/StatRow";
import { CardGlow } from "@/components/CardGlow";
import { type WallCase } from "@/components/home/ProjectWall";
import { CASE_IMAGES } from "@/lib/portfolio";
import { homeFaq, AD_RESULTS, homeFlow, homeCopy, noDot } from "@/lib/home-copy";
import "../home-v2.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { CONTACTS } from "@/lib/contacts";


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dreamchaseprod.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home.meta" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: alternates(locale as Locale),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const railItems = t.raw("rail.items") as string[];
  const faqItems = homeFaq(locale);
  const c = homeCopy(locale);
  const f = homeFlow(locale);
  const poster = `/videos/vsl-${locale === "he" ? "he" : locale === "ru" ? "ru" : "en"}-poster.webp`;
  const wallCases = (await getTranslations("Portfolio")).raw("cases") as WallCase[];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "dc.production",
      url: siteUrl,
      description: t("meta.description"),
      sameAs: [],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Digital marketing",
      provider: { "@type": "Organization", name: "dc.production" },
      areaServed: "Israel",
      serviceType: railItems,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <ScrollAnimations />
      <div className="scroll-progress" aria-hidden="true" />
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Nav ── */}
      <SiteNav />

      {/* ── Hero: viewfinder frame around the wordmark ── */}
      <section className="h2" id="hero">
        <HeroField />
        <div className="h2-vignette" aria-hidden="true" />
        <div className="wrap h2-inner">
          <div className="h2-meta">
            <span>{c.heroMetaL}</span>
            <span className="h2-meta-r"><i className="h2-live" aria-hidden="true"><b /></i>{c.heroMetaR}</span>
          </div>

          <div className="h2-frame">
            <span className="h2-corner tl" aria-hidden="true" /><span className="h2-corner tr" aria-hidden="true" />
            <span className="h2-corner bl" aria-hidden="true" /><span className="h2-corner br" aria-hidden="true" />
            <div className="h2-rec" aria-hidden="true"><i /> REC <Timecode /></div>
            <div className="h2-word" dir="ltr" aria-hidden="true">
              <span className="h2-word-text">dc.production</span>
              <span className="h2-script">from idea to result</span>
            </div>
          </div>

          <div className="h2-foot">
            <div className="h2-lead">
              <p className="h2-lanes">
                {c.heroLanes.map((l, i) => (
                  <span key={l}>{i > 0 && <i aria-hidden="true">·</i>}{l}</span>
                ))}
              </p>
              {/* the CMS heading stays the page's h1 for search; the visitor reads the short pitch below */}
              <h1 className="h2-h1-seo">{(t.has("hero.h1") && t("hero.h1")) || t("hero.desc")}</h1>
              <p className="h2-desc">{c.heroDesc}</p>
              <div className="h2-actions">
                <LeadButton className="h2-cta glass-btn cta-pulse">
                  <span>{t("hero.ctaPrimary")}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                </LeadButton>
                <WatchButton label={c.heroWatch} />
              </div>
            </div>
            <div className="h2-proof">
              <span className="h2-avatars" aria-hidden="true"><i /><i /><i /><b>100+</b></span>
              <span className="h2-proof-t">{t("hero.kicker")}</span>
            </div>
          </div>

          <div className="h2-bottom">
            <div className="h2-social">
              <a href={CONTACTS.instagram} target="_blank" rel="noopener" aria-label="Instagram">IG</a>
              <a href={CONTACTS.facebook} target="_blank" rel="noopener" aria-label="Facebook">FB</a>
              <a href={CONTACTS.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp">WA</a>
            </div>
            <div className="h2-marquee" aria-hidden="true">
              <div className="h2-marquee-track">
                {[...c.heroRail, ...c.heroRail].map((r, i) => <span key={i}>{r}</span>)}
              </div>
            </div>
            <span className="h2-scroll" aria-hidden="true">{c.heroScroll}<i /></span>
          </div>
        </div>
      </section>

      {/* ── Showreel video block ── */}
      <VideoBlock />

      {/* ── Problem + Services: one shared, continuous gromophon backdrop ── */}

      {/* ── Problem ── */}
      <section className="section s-ink" id="problem">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Problem</div>
        <div className="wrap">
          <p className="label">{f.solLabel}</p>
          <h2 className="sec-h">{f.solHeading} <em>{f.solEm}</em></h2>
          <div className="problem-list">
            {f.solItems.map((p, i) => (
              <div className="problem-row" key={i}>
                <i className="vg-line" aria-hidden="true" />
                <b aria-hidden="true" className="problem-row-ghost">0{i + 1}</b>
                <span className="problem-row-n">0{i + 1}</span>
                <h3 className="problem-row-title">{p.title}</h3>
                <p className="problem-row-desc">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section s-ink svc2" id="services">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Services</div>
        <div className="wrap">
          <p className="label">{f.svcLabel}</p>
          <h2 className="sec-h">{f.svcHeading} <em>{f.svcEm}</em></h2>
          <div className="svc-list">
            {f.svcItems.map((s, i) => (
              <Link href="/services" className="svc-row" key={i}>
                <i className="vg-line" aria-hidden="true" />
                <span className="svc-row-num">0{i + 1}</span>
                <div className="svc-row-head">
                  <h3 className="svc-row-name">{s.title}</h3>
                  <span className="svc-row-tag">{s.tag}</span>
                </div>
                <div className="svc-row-body">
                  <p className="svc-row-desc">{s.text}</p>
                </div>
              </Link>
            ))}
            <Link href="/services" className="svc-all-link">{f.svcAll}</Link>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="section s-ink" id="process">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Process</div>
        <div className="wrap">
          <p className="label">{t("process.label")}</p>
          <h2 className="sec-h">{t("process.heading")} <em>{t("process.headingEm")}</em></h2>
          <ProcessSteps steps={c.steps} />
        </div>
      </section>

      {/* ── Numbers, with ad-result screenshots orbiting around them ── */}
      <section className="section s-ink res2" id="results">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <ResultsOrbit items={AD_RESULTS.slice(0, 16).map((src) => ({ src, alt: "" }))}>
          <div className="wrap">
            <p className="label">{f.resLabel}</p>
            <h2 className="sec-h">{f.resHeading} <em>{f.resEm}</em></h2>
            <StatRow items={c.results} />
          </div>
        </ResultsOrbit>
      </section>

      {/* ── Work formats (no prices on the page) ── */}
      <section className="section s-plain fmt" id="packages">
        <div className="s-plain-glow" aria-hidden="true" />
        <div className="wrap">
          <p className="label">{f.fmtLabel}</p>
          <h2 className="sec-h">{f.fmtHeading} <em>{f.fmtEm}</em></h2>
          <div className="fmt-grid">
            {f.fmtItems.map((pkg, i) => (
              <article className={`fmt-card${i === 1 ? " is-pop" : ""}`} key={i}>
                <div className="fmt-head">
                  <span className="fmt-tag">{pkg.tag}</span>
                  {i === 1 && <span className="fmt-pop">{f.fmtPopular}</span>}
                </div>
                <h3 className="fmt-name">{pkg.name}</h3>
                <p className="fmt-lead">{pkg.lead}</p>
                <ul className="fmt-list">
                  {pkg.rows.map((row) => (
                    <li key={row}><i aria-hidden="true" />{row}</li>
                  ))}
                </ul>
                <LeadButton className="fmt-btn glass-btn">{f.fmtBtn}</LeadButton>
              </article>
            ))}
          </div>
          <p className="fmt-note">{f.fmtNote}</p>
        </div>
      </section>

      {/* ── Pain, once more, right before the questions ── */}
      <section className="section s-plain pain" id="why-now">
        <div className="s-plain-glow is-warm" aria-hidden="true" />
        <div className="wrap pain-inner">
          <p className="pain-eyebrow"><i className="h2-live" aria-hidden="true"><b /></i>{f.painEyebrow}</p>
          <h2 className="pain-h">{f.painLine} <em>{f.painEm}</em></h2>
          <p className="pain-text">{f.painText}</p>
          <LeadButton className="h2-cta glass-btn cta-pulse pain-btn">
            <span>{f.painBtn}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          </LeadButton>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section s-plain" id="faq">
        <div className="s-plain-glow" aria-hidden="true" />
        <div className="wrap">
          <p className="label">{t("faq.label")}</p>
          <h2 className="sec-h">{t("faq.heading")} <em>{t("faq.headingEm")}</em></h2>
          <div className="faq-wrap">
            {faqItems.map((f, i) => (
              <details className="faq-item" key={i}>
                <summary>
                  <span className="faq-n">0{i + 1}</span>
                  <span className="faq-q-text">{f.q}</span>
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-ans">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead form ── */}
      <section className="section lead-sec" id="lead">
        <div className="bg-gray" aria-hidden="true" />
        <div className="contact-glow" aria-hidden="true" />
        <span className="contact-ghost" aria-hidden="true">Contact</span>

        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-info">
              <span className="contact-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
                {t("lead.badge")}
              </span>
              <h2 className="contact-h">{t("lead.heading")} <em>{noDot(t("lead.headingEm"))}</em></h2>
              <p className="contact-sub">{t("lead.sub")}</p>
              <div className="contact-cards">
                <a className="contact-card" href={CONTACTS.whatsapp} target="_blank" rel="noopener">
                  <span className="contact-card-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3 1.8.7 2.5.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.5z"/><path d="M20.5 3.5C18.2 1.2 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.6 1.4 5.5 1.4h.1c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.3-8.3zM12 21.8h-.1c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.5-1.5-3.3-1.5-5.1 0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9 1.8 1.9 2.9 4.4 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8z"/></svg>
                  </span>
                  <span className="contact-card-body">
                    <span className="contact-card-label">WhatsApp</span>
                    <span className="contact-card-detail">{CONTACTS.phoneDisplay}</span>
                  </span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="contact-card" href={CONTACTS.facebook} target="_blank" rel="noopener">
                  <span className="contact-card-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>
                  </span>
                  <span className="contact-card-body">
                    <span className="contact-card-label">Facebook</span>
                    <span className="contact-card-detail">dreamchase.prod</span>
                  </span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="contact-card" href={CONTACTS.instagram} target="_blank" rel="noopener">
                  <span className="contact-card-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                  </span>
                  <span className="contact-card-body">
                    <span className="contact-card-label">Instagram</span>
                    <span className="contact-card-detail">@dreamchase.prod</span>
                  </span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="contact-card" href={`mailto:${CONTACTS.email}`}>
                  <span className="contact-card-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                  </span>
                  <span className="contact-card-body">
                    <span className="contact-card-label">{t("lead.emailLabel")}</span>
                    <span className="contact-card-detail">{CONTACTS.email}</span>
                  </span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <QuoteForm />
          </div>
        </div>
      </section>

      <CardGlow selector=".lead-sec .contact-card, .sr-item, #problem .problem-row, .svc-row, .fmt-card" />
      <PromoPopups copy={c} poster={poster} />
      <ChatWidget locale={locale} />
      <MobileCta label={t("hero.ctaPrimary")} />
      <SiteFooter />
    </>
  );
}
