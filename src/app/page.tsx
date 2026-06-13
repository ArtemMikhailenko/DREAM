import { LeadForm } from "@/components/LeadForm";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { CursorFX } from "@/components/CursorFX";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

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

const heroRailServices = [
  "Promotional videos",
  "Image videos",
  "3D animation",
  "Social media content",
  "AI content",
  "Social media management",
  "Digital marketing",
];

const problems = [
  {
    title: "First screen doesn't hold the price",
    text: "The service can be excellent, but visually it looks cheaper than competitors — and the client leaves before reading a word.",
  },
  {
    title: "Creatives don't connect to the funnel",
    text: "Video, posts, site and ads never form a single path toward a lead. Each piece lives in isolation.",
  },
  {
    title: "Analytics is noisy",
    text: "Leads are duplicated, CRM receives dirty data, ad algorithms learn from garbage and waste budget.",
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

type PkgRow = { name: string; extra?: string };
const packages: {
  name: string;
  tag: string;
  rows: PkgRow[];
  price: string;
  priceOld?: string;
  time: string;
  feat: boolean;
}[] = [
  {
    name: "Branding",
    tag: "Identity",
    rows: [
      { name: "Logo development", extra: "3–5 concepts" },
      { name: "Social media kit", extra: "avatar, highlights" },
      { name: "Brand guidelines" },
      { name: "Post templates", extra: "3 posts" },
      { name: "Ad creatives", extra: "3 creatives" },
    ],
    price: "$1.000",
    priceOld: "$1.300",
    time: "14 working days",
    feat: false,
  },
  {
    name: "Landing design",
    tag: "Web",
    rows: [
      { name: "Reference research" },
      { name: "Site architecture" },
      { name: "Prototype" },
      { name: "AI-driven visuals" },
      { name: "Landing design + responsive", extra: "up to 12 blocks" },
    ],
    price: "$1.000",
    priceOld: "$1.500",
    time: "14 working days",
    feat: true,
  },
  {
    name: "Full funnel",
    tag: "Production",
    rows: [
      { name: "Video production", extra: "shoot + edit" },
      { name: "Landing page" },
      { name: "Ad campaign setup" },
      { name: "Pixels, CRM, analytics" },
      { name: "First optimisation cycle" },
    ],
    price: "from $3.200",
    time: "turnkey",
    feat: false,
  },
];

const faqs = [
  {
    q: "How does the process work?",
    a: "We start with a brief and audit, then shape the offer, prepare scripts, production, landing blocks, ad launch and analytics.",
  },
  {
    q: "Can we start without an existing portfolio?",
    a: "Yes. At the start we use strong service packaging, team expertise and initial video formats — real cases are added as materials appear.",
  },
  {
    q: "Do we need a blog right away?",
    a: "No. The core SEO architecture is already in place: structure, meta tags, sitemap, robots, FAQ markup and fast pages.",
  },
  {
    q: "How do we avoid counting a lead twice?",
    a: "The form sends one event_id to the server and to browser pixels. Meta Pixel and Conversions API receive a shared ID for deduplication.",
  },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dcprod.agency";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "dc.prod",
    url: siteUrl,
    description:
      "dc.prod is a full-cycle production studio: video, ads, SMM and digital marketing.",
    sameAs: [],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Video, ads and digital marketing",
    provider: { "@type": "Organization", name: "dc.prod" },
    areaServed: "Worldwide",
    serviceType: [
      "Promotional videos",
      "Image videos",
      "3D animation",
      "Social media content",
      "AI content",
      "Digital marketing",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default function Home() {
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/background/hero.png" alt="" />
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
              <span className="hero-kicker-text">We helped +100 clients</span>
            </div>
            <h1 className="hero-h1">
              From idea<br />
              <span className="hero-h1-arrow" aria-hidden="true" />
              <em>to result.</em>
            </h1>
            <p className="hero-desc">
              dc.prod is a full-cycle production studio — video, ads, SMM and digital
              marketing. We turn your idea into a system that brings inbound leads.
            </p>
            <div className="hero-actions">
              <a className="btn-p" href="#lead">Sign up for an audit</a>
              <a className="btn-o" href="/portfolio">See our works ↗</a>
            </div>
          </div>
          <aside className="hero-rail" aria-label="What we do">
            <p className="hero-rail-head">What we do</p>
            <ul>
              {heroRailServices.map((s) => (
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

      {/* ── Problem ── */}
      <section className="section s-dark2" id="problem">
        <div className="bg-gromophon" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Problem</div>
        <div className="wrap">
          <p className="label">The Problem</p>
          <h2 className="sec-h">
            Why great content<br />doesn&apos;t bring leads
          </h2>
          <div className="problem-list">
            {problems.map((p, i) => (
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
        <div className="bg-gromophon" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Services</div>
        <div className="wrap">
          <p className="label">Services</p>
          <h2 className="sec-h">Three directions —<br />one <em>system</em></h2>
          <div className="svc-layout">
            <div className="svc-list">
              {services.map((s, i) => (
                <div className="svc-row" key={i} data-img={s.img}>
                  <span className="svc-row-bar" aria-hidden="true" />
                  <span className="svc-row-num">0{i + 1}</span>
                  <div className="svc-row-head">
                    <h3 className="svc-row-name">{s.title}</h3>
                    <span className="svc-row-tag">{s.tag}</span>
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
                </div>
              ))}
            </div>
            <div className="svc-side">
              <div className="svc-side-img" style={{ aspectRatio: "4/5" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={services[0].img} alt="" loading="lazy" decoding="async" />
                <span className="svc-side-tag">on set</span>
              </div>
              <div className="svc-side-img" style={{ aspectRatio: "16/10" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={services[2].img} alt="" loading="lazy" decoding="async" />
                <span className="svc-side-tag">launch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
          <p className="label">How we work</p>
          <h2 className="sec-h">From brief<br />to first <em>lead</em></h2>
          <div className="process-wrap">
            <div className="process-track-line" aria-hidden="true" />
            <div className="process-track-progress" aria-hidden="true" />
            <div className="process-steps">
              {processSteps.map((step) => (
                <div className="process-step" key={step.n}>
                  <div className="process-step-dot" aria-hidden="true" />
                  <span className="process-step-n">{step.n}</span>
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
          <img src="/background/notebook.png" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="bg-struct" aria-hidden="true" />
        <div className="wrap statement-inner">
          <p className="statement-eyebrow">— what sets dc.prod apart —</p>
          <p className="statement-h">
            We don&apos;t just make <em>content.</em><br />
            We build <span className="statement-h-ul">systems.</span>
          </p>
          <a className="statement-cta" href="#lead">Start your project ↗</a>
        </div>
      </div>

      {/* ── Portfolio — compact 3-card showcase ── */}
      <section className="section s-dark2" id="portfolio">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Works</div>
        <div className="wrap">
          <p className="label">Selected work</p>
          <h2 className="sec-h">Cases &amp; projects</h2>
          <div className="portfolio-grid portfolio-bento">
            {portfolioCases.map((c, i) => (
              <div className="portfolio-case" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="portfolio-case-img" src={c.img} alt={c.title} loading="lazy" decoding="async" />
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
            <a className="portfolio-cta" href="#lead">Start a project like this ↗</a>
            <Link className="portfolio-cta" href="/portfolio">View all works ↗</Link>
          </div>
        </div>
      </section>

      {/* ── Results — single place for all numbers ── */}
      <section className="section s-dark2" id="results">
        <div className="bg-gray seam-up pin" aria-hidden="true" />
        <div className="s-bg-word" aria-hidden="true">Results</div>
        <div className="wrap">
          <p className="label">Results</p>
          <h2 className="sec-h">Numbers<br />that <em>matter</em></h2>
        </div>
        <div className="cases-strip">
          {results.map((c, i) => (
            <div className="case-col" key={i}>
              <span className="case-col-n">0{i + 1}</span>
              <span className="case-col-val">{c.value}</span>
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
          <p className="label">Pricing</p>
          <h2 className="sec-h">Choose<br />your <em>format</em></h2>
          <div className="pkg-cards">
            {packages.map((pkg, i) => (
              <article className={`pkg-card${pkg.feat ? " feat" : ""}`} key={i}>
                <div className="pkg-card-head">
                  {pkg.feat && <span className="pkg-card-popular">★ Popular</span>}
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
                <a className="pkg-card-btn" href="#lead">Get started ↗</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section s-concrete" id="faq">
        <div className="bg-graffiti" aria-hidden="true" />
        <div className="wrap">
          <p className="label">FAQ</p>
          <h2 className="sec-h">Common <em>questions</em></h2>
          <div className="faq-wrap">
            {faqs.map((f, i) => (
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
                Contact
              </span>
              <h2 className="contact-h">Get in <em>touch.</em></h2>
              <p className="contact-sub">
                Fill in the form — we&apos;ll review the brief and send a proposal
                within one business day.
              </p>
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
                    <span className="contact-card-label">Email us</span>
                    <span className="contact-card-detail">hi@dcprod.agency</span>
                  </span>
                  <span className="contact-card-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
