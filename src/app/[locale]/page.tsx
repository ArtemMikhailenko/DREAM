import { QuoteForm } from "@/components/QuoteForm";
import { VideoBlock } from "@/components/VideoBlock";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { HeroField, Timecode } from "@/components/home/HeroField";
import { PromoPopups } from "@/components/home/PromoPopups";
import { IntroDissolve } from "@/components/home/IntroDissolve";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { CountUp } from "@/components/home/CountUp";
import { WorkArt } from "@/components/home/WorkArt";
import { type WallCase } from "@/components/home/ProjectWall";
import { ResultsRibbon } from "@/components/home/ResultsRibbon";
import { CASE_IMAGES } from "@/lib/portfolio";
import { homeCopy, noDot } from "@/lib/home-copy";
import "../home-v2.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { CONTACTS } from "@/lib/contacts";

const services = [
  {
    title: "Promotional videos",
    text: "Scripts, shooting and editing for video ads that actually convert, built around your offer and audience.",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=700&q=72",
    tag: "video",
    deliverables: ["scripts", "shooting", "editing", "motion"],
  },
  {
    title: "Image & brand films",
    text: "Cinematic brand stories: concept, art direction, location and post-production at production-house level.",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=700&q=72",
    tag: "image",
    deliverables: ["concept", "art direction", "location", "post"],
  },
  {
    title: "Social media & ads",
    text: "Content system, paid ads, pixels, CRM and analytics, one machine working toward inbound leads.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=72",
    tag: "smm",
    deliverables: ["content", "paid ads", "pixels", "analytics"],
  },
];

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
  const problemItems = t.raw("problem.items") as { title: string; text: string }[];
  const svcItems = t.raw("services.items") as {
    title: string;
    text: string;
    deliverables: string[];
    image?: string;
  }[];
  const portfolioCasesT = t.raw("portfolio.cases") as {
    title: string;
    tag: string;
    image?: string;
  }[];
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];
  const c = homeCopy(locale);
  const wallCases = (await getTranslations("Portfolio")).raw("cases") as WallCase[];
  const poster = `/videos/vsl-${locale === "he" ? "he" : locale === "ru" ? "ru" : "en"}-poster.webp`;

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
      <IntroDissolve />
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
      <section className="h2">
        <HeroField />
        <div className="h2-vignette" aria-hidden="true" />
        <div className="wrap h2-inner">
          <div className="h2-meta">
            <span>{c.heroMetaL}</span>
            <span className="h2-meta-r"><i className="h2-live" aria-hidden="true" />{c.heroMetaR}</span>
          </div>

          <div className="h2-frame">
            <span className="h2-corner tl" aria-hidden="true" /><span className="h2-corner tr" aria-hidden="true" />
            <span className="h2-corner bl" aria-hidden="true" /><span className="h2-corner br" aria-hidden="true" />
            <div className="h2-rec" aria-hidden="true"><i /> REC <Timecode /></div>
            <ul className="h2-lanes">
              {c.heroLanes.map((l, i) => (
                <li key={l}><span>0{i + 1}.</span> {l}</li>
              ))}
            </ul>
            <div className="h2-word" dir="ltr" aria-hidden="true">
              <span className="h2-word-text">dc.production</span>
              <span className="h2-script">from idea to result</span>
            </div>
          </div>

          <div className="h2-foot">
            <div className="h2-lead">
              <h1 className="h2-h1">{(t.has("hero.h1") && t("hero.h1")) || t("hero.desc")}</h1>
              <div className="h2-actions">
                <a className="h2-cta glass-btn" href="#lead">
                  <span>{t("hero.ctaPrimary")}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                </a>
                <a className="h2-watch" href="#showreel">
                  <span className="h2-watch-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
                  {c.heroWatch}
                </a>
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
                {[...railItems, ...railItems].map((r, i) => <span key={i}>{r}</span>)}
              </div>
            </div>
            <span className="h2-scroll" aria-hidden="true">{c.heroScroll}<i /></span>
          </div>
        </div>
      </section>

      {/* ── Showreel video block ── */}
      <VideoBlock />

      {/* ── Problem + Services: one shared, continuous gromophon backdrop ── */}
      <div className="bg-run">
        <div className="bg-gromophon" aria-hidden="true" />

      {/* ── Problem ── */}
      <section className="section s-dark2" id="problem">
        <div className="s-bg-word" aria-hidden="true">Problem</div>
        <div className="wrap">
          <p className="label">{t("problem.label")}</p>
          <h2 className="sec-h">{t("problem.heading")}</h2>
          <div className="problem-list">
            {problemItems.map((p, i) => (
              <div className="problem-row" key={i}>
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
      <section className="section s-concrete" id="services">
        <div className="s-bg-word" aria-hidden="true">Services</div>
        <div className="wrap">
          <p className="label">{t("services.label")}</p>
          <h2 className="sec-h">{t("services.heading")} <em>{t("services.headingEm")}</em></h2>
          <div className="svc-layout">
            <div className="svc-list">
              {svcItems.map((s, i) => (
                <Link href="/services" className="svc-row" key={i} data-img={services[i].img}>
                  <span className="svc-row-bar" aria-hidden="true" />
                  <span className="svc-row-num">0{i + 1}</span>
                  <div className="svc-row-head">
                    <h3 className="svc-row-name">{s.title}</h3>
                    <span className="svc-row-tag">{services[i].tag}</span>
                  </div>
                  <div className="svc-row-body">
                    <p className="svc-row-desc">{s.text}</p>
                    <ul className="svc-row-tags" aria-hidden="true">
                      {s.deliverables.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="svc-row-arrow">↗</span>
                </Link>
              ))}
              <Link href="/services" className="svc-all-link">
                {t("services.all")} <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="svc-side">
              <div className="svc-side-img" style={{ aspectRatio: "4/5" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={svcItems[0]?.image ?? services[0].img} alt="" loading="lazy" decoding="async" />
                <span className="svc-side-tag">{t("services.onSet")}</span>
              </div>
              <div className="svc-side-img" style={{ aspectRatio: "16/10" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={svcItems[2]?.image ?? services[2].img} alt="" loading="lazy" decoding="async" />
                <span className="svc-side-tag">{t("services.launch")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>{/* /.bg-run */}

      {/* ── Process ── */}
      <section className="section s-ink" id="process">
        <div className="bg-gray seam-down pin" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Process</div>
        <div className="wrap">
          <p className="label">{t("process.label")}</p>
          <h2 className="sec-h">{t("process.heading")} <em>{t("process.headingEm")}</em></h2>
          <ProcessSteps steps={c.steps} />
        </div>
      </section>

      {/* ── Works: drawn covers, no stock photos ── */}
      <section className="section s-dark2 w2" id="portfolio">
        <div className="wrap">
          <div className="w2-head">
            <div>
              <p className="label">{t("portfolio.label")}</p>
              <h2 className="sec-h">{noDot(t("portfolio.heading"))}</h2>
            </div>
            <Link className="w2-all" href="/portfolio">{t("portfolio.ctaAll")} <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="w2-grid">
            {portfolioCasesT.map((pc, i) => (
              <Link href="/portfolio" className="w2-card" key={i}>
                <WorkArt variant={i} />
                <span className="w2-chip">{pc.tag}</span>
                <span className="w2-idx">0{i + 1}</span>
                <div className="w2-info">
                  <h3 className="w2-title">{noDot(pc.title)}</h3>
                  <span className="w2-sub">{c.workKicker}</span>
                </div>
                <span className="w2-go" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results bento ── */}
      <section className="section s-dark2 rb" id="results">
        <div className="wrap">
          <p className="label">{t("results.label")}</p>
          <h2 className="sec-h">{t("results.heading")} <em>{noDot(t("results.headingEm"))}</em></h2>
          <div className="rb-grid">
            <div className="rb-stats">
              {c.results.map((r) => (
                <div className="rb-stat" key={r.value}>
                  <CountUp className="rb-val" value={r.value} />
                  <p className="rb-label">{r.label}</p>
                </div>
              ))}
            </div>
            <div className="rb-statement">
              <p className="rb-statement-h">
                {c.bentoStatement[0]}
                <span className="rb-avatars" aria-hidden="true"><i /><i /><i /><b>+</b></span>
                <br />
                <a className="rb-pill" href="#lead" aria-label={c.bentoStatementCta}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
                <em>{c.bentoStatement[1]}</em>
              </p>
            </div>
            <a className="rb-cta" href="#lead">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={wallCases[4]?.image ?? CASE_IMAGES[4]} alt="" loading="lazy" decoding="async" />
              <span className="rb-cta-shade" aria-hidden="true" />
              <span className="rb-cta-title">{c.bentoCtaTitle}</span>
              <span className="rb-cta-text">{c.bentoCtaText}</span>
              <span className="rb-cta-btn">{c.bentoCtaBtn} <span aria-hidden="true">→</span></span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Ad results ribbon (placeholder images until real campaign screenshots arrive) ── */}
      <ResultsRibbon
        words={c.ribbonWords}
        note={c.ribbonNote}
        items={[...wallCases, ...wallCases, ...wallCases].slice(0, 14).map((wc, i) => ({ src: wc.image ?? CASE_IMAGES[i % CASE_IMAGES.length], alt: wc.title }))}
      />

      {/* ── FAQ ── */}
      <section className="section s-concrete" id="faq">
        <div className="bg-graffiti" aria-hidden="true" />
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
        <svg className="contact-circuit contact-circuit-l" viewBox="0 0 240 160" aria-hidden="true" fill="none" stroke="currentColor">
          <path d="M0 40 H80 L110 70 H240" strokeWidth="1" />
          <path d="M0 90 H50 L78 118 H180" strokeWidth="1" opacity=".6" />
          <circle cx="80" cy="40" r="3.5" /><circle cx="110" cy="70" r="3.5" />
          <circle cx="50" cy="90" r="3" opacity=".6" /><circle cx="180" cy="118" r="3" opacity=".6" />
        </svg>
        <svg className="contact-circuit contact-circuit-r" viewBox="0 0 240 160" aria-hidden="true" fill="none" stroke="currentColor">
          <path d="M240 40 H160 L130 70 H0" strokeWidth="1" />
          <path d="M240 95 H190 L160 125 H40" strokeWidth="1" opacity=".6" />
          <circle cx="160" cy="40" r="3.5" /><circle cx="130" cy="70" r="3.5" />
          <circle cx="190" cy="95" r="3" opacity=".6" /><circle cx="40" cy="125" r="3" opacity=".6" />
        </svg>
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

      <PromoPopups copy={c} poster={poster} />
      <SiteFooter />
    </>
  );
}
