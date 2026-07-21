import { QuoteForm } from "@/components/QuoteForm";
import { VideoBlock } from "@/components/VideoBlock";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { CursorFX } from "@/components/CursorFX";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";

const services = [
  {
    title: "Promotional videos",
    text: "Scripts, shooting and editing for video ads that actually convert — built around your offer and audience.",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=700&q=72",
    tag: "video",
    deliverables: ["scripts", "shooting", "editing", "motion"],
  },
  {
    title: "Image & brand films",
    text: "Cinematic brand stories — concept, art direction, location and post-production at production-house level.",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=700&q=72",
    tag: "image",
    deliverables: ["concept", "art direction", "location", "post"],
  },
  {
    title: "Social media & ads",
    text: "Content system, paid ads, pixels, CRM and analytics — one machine working toward inbound leads.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=72",
    tag: "smm",
    deliverables: ["content", "paid ads", "pixels", "analytics"],
  },
];

const processSteps = [
  { n: "01", name: "Strategy", desc: "Brief, audience & positioning", hi: false },
  { n: "02", name: "Ideas", desc: "Creative concept & content plan", hi: false },
  { n: "03", name: "Production", desc: "Scripts, copy & motion design", hi: true },
  { n: "04", name: "Shoot", desc: "Video, photo & editing", hi: false },
  { n: "05", name: "Ads", desc: "Launch, creatives & A/B tests", hi: false },
  { n: "06", name: "Analytics", desc: "Pixels, CRM & clean data", hi: false },
  { n: "07", name: "Support", desc: "Optimisation & reports", hi: false },
];

const portfolioCases = [
  {
    title: "Brand Identity Film",
    tag: "Image video",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Performance Campaign",
    tag: "Ads & creatives",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Social Content System",
    tag: "SMM",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=70",
  },
];

const results = [
  { value: "+38%", label: "growth in inbound leads after updating the offer and video" },
  { value: "−24%", label: "drop in cost per lead through new ad combinations" },
  { value: "12", label: "days from brief to launching the first ad wave" },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dcprod.agency";

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
  const heroBg = t.raw("hero") as { bg?: string; bgMobile?: string };
  const svcItems = t.raw("services.items") as {
    title: string;
    text: string;
    deliverables: string[];
    image?: string;
  }[];
  const processStepsT = t.raw("process.steps") as { name: string; desc: string }[];
  const portfolioCasesT = t.raw("portfolio.cases") as {
    title: string;
    tag: string;
    image?: string;
  }[];
  const resultItems = t.raw("results.items") as { label: string }[];
  const pkgItems = t.raw("pricing.packages") as {
    name: string;
    tag: string;
    price: string;
    priceOld?: string;
    time: string;
    rows: { name: string; extra?: string }[];
  }[];
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "DC Project",
      url: siteUrl,
      description: t("meta.description"),
      sameAs: [],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Digital marketing",
      provider: { "@type": "Organization", name: "DC Project" },
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
      <CursorFX />
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

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <picture>
            <source media="(max-width:900px)" srcSet={heroBg.bgMobile ?? "/background/hero-portrait.webp"} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroBg.bg ?? "/background/hero.webp"} alt="" />
          </picture>
        </div>

        <div className="hero-glow" aria-hidden="true" />
        <svg className="hero-circuit hero-circuit-l" viewBox="0 0 240 160" aria-hidden="true" fill="none" stroke="currentColor">
          <path d="M0 40 H80 L110 70 H240" strokeWidth="1" />
          <path d="M0 90 H50 L78 118 H180" strokeWidth="1" opacity=".6" />
          <circle cx="80" cy="40" r="3.5" /><circle cx="110" cy="70" r="3.5" />
          <circle cx="50" cy="90" r="3" opacity=".6" /><circle cx="180" cy="118" r="3" opacity=".6" />
        </svg>
        <svg className="hero-circuit hero-circuit-r" viewBox="0 0 240 160" aria-hidden="true" fill="none" stroke="currentColor">
          <path d="M240 40 H160 L130 70 H0" strokeWidth="1" />
          <path d="M240 95 H190 L160 125 H40" strokeWidth="1" opacity=".6" />
          <circle cx="160" cy="40" r="3.5" /><circle cx="130" cy="70" r="3.5" />
          <circle cx="190" cy="95" r="3" opacity=".6" /><circle cx="40" cy="125" r="3" opacity=".6" />
        </svg>

        <span className="hero-tag" aria-hidden="true">
          Full-cycle studio /////// Video · Ads · SMM · Digital
        </span>

        <span className="brand-watermark" aria-hidden="true">dc.prod</span>

        <span className="hero-note hero-note-idea" aria-hidden="true">
          idea
          <svg className="hn-mark" viewBox="0 0 170 80" fill="none" stroke="currentColor" preserveAspectRatio="none">
            <path d="M20 46C13 27 50 13 88 14c41 1 66 15 60 35-6 18-46 26-84 23-30-3-52-13-53-29" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
        <span className="hero-note hero-note-result" aria-hidden="true">
          result
          <svg className="hn-mark" viewBox="0 0 180 22" fill="none" stroke="currentColor" preserveAspectRatio="none">
            <path d="M6 14C52 5 132 5 174 13" strokeWidth="3.4" strokeLinecap="round" />
          </svg>
        </span>

        <div className="wrap hero-body">
          <div className="hero-left">
            <div className="hero-kicker">
              <span className="hero-kicker-dot" />
              <span className="hero-kicker-text">{t("hero.kicker")}</span>
            </div>
            {/* The slogan is the visual hook, not the page's subject — it carries no
                keywords and reads the same in every language, so it is a div. The H1
                below states what the page is actually about, per the SEO spec. */}
            <div className="hero-h1" aria-hidden="true">
              From idea<br />
              <span className="hero-h1-arrow" aria-hidden="true" />
              <em>to result.</em>
            </div>
            <h1 className="hero-h1-seo">{t("hero.h1")}</h1>
            <p className="hero-desc">{t("hero.desc")}</p>
            <div className="hero-actions">
              <a className="btn-p" href="#lead">{t("hero.ctaPrimary")}</a>
              <Link className="btn-o" href="/portfolio">{t("hero.ctaSecondary")} ↗</Link>
            </div>
          </div>
          <aside className="hero-rail" aria-label={t("rail.head")}>
            <p className="hero-rail-head">{t("rail.head")}</p>
            <ul>
              {railItems.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ── Ticker — cream ── */}
      <div className="ticker ticker-cream" aria-hidden="true">
        <div className="ticker-track">
          {["From idea","To result","Video","Ads","SMM","Digital","AI content","3D animation",
            "From idea","To result","Video","Ads","SMM","Digital","AI content","3D animation"].map((t, i) => (
            <span className="ticker-item" key={i}>{t}</span>
          ))}
        </div>
      </div>

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

      {/* ── Ticker — ghost ── */}
      <div className="ticker ticker-ghost" aria-hidden="true">
        <div className="ticker-track-rev">
          {["Promotional","Image","3D","AI content","Social","Marketing","Performance","Production",
            "Promotional","Image","3D","AI content","Social","Marketing","Performance","Production"].map((t, i) => (
            <span className="ticker-item" key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── Process ── */}
      <section className="section s-ink" id="process">
        <div className="bg-gray seam-down pin" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Process</div>
        <div className="wrap">
          <p className="label">{t("process.label")}</p>
          <h2 className="sec-h">{t("process.heading")} <em>{t("process.headingEm")}</em></h2>
          <div className="process-wrap">
            <div className="process-track-line" aria-hidden="true" />
            <div className="process-track-progress" aria-hidden="true" />
            <div className="process-steps">
              {processStepsT.map((step, i) => (
                <div className="process-step" key={i}>
                  <div className="process-step-dot" aria-hidden="true" />
                  <span className="process-step-n">{processSteps[i].n}</span>
                  <span className="process-step-name">{step.name}</span>
                  <p className="process-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Statement ── */}
      <div className="s-statement">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="sec-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/background/notebook.webp" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="bg-struct" aria-hidden="true" />
        <div className="wrap statement-inner">
          <p className="statement-eyebrow">{t("statement.eyebrow")}</p>
          <p className="statement-h">
            {t("statement.line1")} <em>{t("statement.line1Em")}</em><br />
            {t("statement.line2")} <span className="statement-h-ul">{t("statement.systems")}</span>
          </p>
          <a className="statement-cta" href="#lead">{t("statement.cta")} ↗</a>
        </div>
      </div>

      {/* ── Portfolio — compact 3-card showcase ── */}
      <section className="section s-dark2" id="portfolio">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Works</div>
        <div className="wrap">
          <p className="label">{t("portfolio.label")}</p>
          <h2 className="sec-h">{t("portfolio.heading")}</h2>
          <div className="portfolio-grid portfolio-bento">
            {portfolioCasesT.map((c, i) => (
              <div className="portfolio-case" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="portfolio-case-img" src={c.image ?? portfolioCases[i].img} alt={c.title} loading="lazy" decoding="async" />
                <div className="portfolio-case-grad" />
                <div className="portfolio-case-info">
                  <span className="portfolio-case-tag">{c.tag}</span>
                  <h3 className="portfolio-case-title">{c.title}</h3>
                </div>
                <span className="portfolio-case-arrow" aria-hidden="true">↗</span>
              </div>
            ))}
          </div>
          <div className="portfolio-cta-row">
            <a className="portfolio-cta" href="#lead">{t("portfolio.ctaStart")} ↗</a>
            <Link className="portfolio-cta" href="/portfolio">{t("portfolio.ctaAll")} ↗</Link>
          </div>
        </div>
      </section>

      {/* ── Results — single place for all numbers ── */}
      <section className="section s-dark2" id="results">
        <div className="bg-gray seam-up pin" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Results</div>
        <div className="wrap">
          <p className="label">{t("results.label")}</p>
          <h2 className="sec-h">{t("results.heading")} <em>{t("results.headingEm")}</em></h2>
        </div>
        <div className="cases-strip">
          {resultItems.map((c, i) => (
            <div className="case-col" key={i}>
              <span className="case-col-n">0{i + 1}</span>
              <span className="case-col-val">{results[i].value}</span>
              <p className="case-col-desc">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ticker — results strip ── */}
      <div className="ticker ticker-ghost" aria-hidden="true">
        <div className="ticker-track-rev">
          {["+38% leads","−24% CPL","12 days","100+ clients","+38% leads","−24% CPL","12 days","100+ clients",
            "+38% leads","−24% CPL","12 days","100+ clients","+38% leads","−24% CPL","12 days","100+ clients"].map((t, i) => (
            <span className="ticker-item" key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── Pricing ── */}
      <section className="section s-pricing" id="packages">
        <div className="bg-graffiti" aria-hidden="true" />
        <div className="pricing-blob" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Pricing</div>
        <div className="wrap">
          <p className="label">{t("pricing.label")}</p>
          <h2 className="sec-h">{t("pricing.heading")} <em>{t("pricing.headingEm")}</em></h2>
          <div className="pkg-cards">
            {pkgItems.map((pkg, i) => {
              const feat = i === 1;
              return (
              <article className={`pkg-card${feat ? " feat" : ""}`} key={i}>
                <div className="pkg-card-head">
                  {feat && <span className="pkg-card-popular">★ {t("pricing.popular")}</span>}
                  <span className="pkg-card-tag">{pkg.tag}</span>
                </div>
                <h3 className="pkg-card-name">{pkg.name}</h3>
                <div className="pkg-card-price-row">
                  <span className="pkg-card-price">{pkg.price}</span>
                  {pkg.priceOld && <span className="pkg-card-price-old">{pkg.priceOld}</span>}
                </div>
                <p className="pkg-card-time">{pkg.time}</p>
                <ul className="pkg-features">
                  {pkg.rows.map((row, idx) => (
                    <li className="pkg-feature-li" key={idx}>
                      <span className="pkg-feature-check">✓</span>
                      <span>{row.name}{row.extra ? <em className="pkg-feature-extra"> — {row.extra}</em> : null}</span>
                    </li>
                  ))}
                </ul>
                <a className="pkg-card-btn" href="#lead">{t("pricing.getStarted")} ↗</a>
              </article>
            );})}
          </div>
        </div>
      </section>

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
              <h2 className="contact-h">{t("lead.heading")} <em>{t("lead.headingEm")}</em></h2>
              <p className="contact-sub">{t("lead.sub")}</p>
              <div className="contact-cards">
                <a className="contact-card" href="https://t.me/" target="_blank" rel="noopener">
                  <span className="contact-card-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.4 18.6 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 12.5l-5-1.5c-1.1-.3-1.1-1.1.2-1.6L20.5 2.8c.9-.3 1.7.2 1.4 1.6z"/></svg>
                  </span>
                  <span className="contact-card-body">
                    <span className="contact-card-label">Telegram</span>
                    <span className="contact-card-detail">@dcprod</span>
                  </span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="contact-card" href="https://instagram.com/" target="_blank" rel="noopener">
                  <span className="contact-card-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                  </span>
                  <span className="contact-card-body">
                    <span className="contact-card-label">Instagram</span>
                    <span className="contact-card-detail">@dc.prod</span>
                  </span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="contact-card" href="mailto:hi@dcprod.agency">
                  <span className="contact-card-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                  </span>
                  <span className="contact-card-body">
                    <span className="contact-card-label">{t("lead.emailLabel")}</span>
                    <span className="contact-card-detail">hi@dcprod.agency</span>
                  </span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <QuoteForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
