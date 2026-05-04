import { LeadForm } from "@/components/LeadForm";
import { ScrollAnimations } from "@/components/ScrollAnimations";

const services = [
  {
    title: "Video production",
    text: "Scripts, shooting, editing and short-form videos that instantly explain your product and build trust.",
    img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "Performance ads",
    text: "A tight system of offer, creatives, landing page and tracked events — optimised for inbound leads.",
    img: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=70",
  },
  {
    title: "SMM & content system",
    text: "Profile, content plan and visual rhythm so that people see a brand — not just a random account.",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=70",
  },
];

const reelItems = [
  {
    title: "Brand stands out",
    tag: "Identity film",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Strategic campaigns",
    tag: "Ad creative",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Conversion cut",
    tag: "Performance",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Impact story",
    tag: "Case video",
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Social proof",
    tag: "SMM",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=70",
  },
];

const problems = [
  {
    title: "Your first screen doesn't hold the price",
    text: "The service can be excellent, but visually it looks cheaper than competitors — and the client leaves.",
  },
  {
    title: "Creatives live separately from the funnel",
    text: "Video, posts, site and ads never connect into a single path toward a lead.",
  },
  {
    title: "Analytics is noisy",
    text: "Leads are duplicated, CRM receives dirty data, ad algorithms learn slower.",
  },
];

const systemLane = ["Script", "Shoot", "Landing", "Pixels", "CRM", "Optimise"];

const cases = [
  { value: "+38%", label: "growth in inbound leads after updating the offer and video" },
  { value: "−24%", label: "drop in cost per lead through new ad combinations" },
  { value: "12", label: "days from brief to launching the first ad wave" },
];

const packages = [
  {
    name: "Start",
    price: "from $900",
    time: "7–10 days",
    text: "Offer, landing structure, basic creatives and event tracking setup.",
    feat: false,
  },
  {
    name: "Campaign",
    price: "from $1 800",
    time: "12–18 days",
    text: "Video, ad combinations, GTM, pixels and the first optimisation cycle.",
    feat: true,
  },
  {
    name: "Full funnel",
    price: "from $3 200",
    time: "turnkey",
    text: "Production, SMM packaging, ads, CRM lead delivery and reporting.",
    feat: false,
  },
];

const steps = [
  "We analyse your product, audience and current points of lead loss.",
  "We shape the offer, visual identity and creative plan.",
  "We shoot and edit video, build landing blocks and ad creatives.",
  "We launch campaigns, verify events and optimise towards leads.",
];

const reviews = [
  {
    quote:
      "The team understood the product fast and turned a complex service into a clear, compelling video. Leads came in warmer from the very first month.",
    name: "Marina K.",
    role: "Founder, service studio",
  },
  {
    quote:
      "They didn't just make a video — they built a complete ad system. The best part: transparent analytics with zero duplicates.",
    name: "Alex P.",
    role: "Head of Sales",
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dream.agency";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DREAM",
    url: siteUrl,
    description: "DREAM builds video, ad and SMM systems for businesses that need inbound leads.",
    sameAs: [],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Video, ads and SMM for business",
    provider: { "@type": "Organization", name: "DREAM" },
    areaServed: "Worldwide",
    serviceType: ["Video production", "Performance marketing", "SMM"],
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
      <ScrollAnimations />
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Nav ── */}
      <nav className="nav" id="top">
        <div className="wrap nav-inner">
          <a href="#top" className="nav-logo">
            <span className="nav-logo-icon">D</span>
            DREAM
          </a>
          <ul className="nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#cases">Results</a></li>
            <li><a href="#packages">Pricing</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
          <a className="nav-cta" href="#lead">Get a proposal</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-decor-ring" aria-hidden="true" />

        {/* top bar: kicker + pills */}
        <div className="wrap hero-head">
          <div className="hero-kicker">
            <span className="hero-kicker-dot" />
            <span className="hero-kicker-text">Video · Ads · SMM — for inbound leads</span>
          </div>
          <div className="hero-pills">
            <span className="hero-pill hi">· Live</span>
            <span className="hero-pill">Video production</span>
            <span className="hero-pill">Performance</span>
            <span className="hero-pill">SMM</span>
            <span className="hero-pill">CRM integrations</span>
            <span className="hero-pill">Analytics</span>
          </div>
        </div>

        {/* main: title + reel card */}
        <div className="wrap hero-body">
          <div className="hero-left">
            <h1 className="hero-h1">
              Content<br />that <em>sells.</em>
            </h1>
            <p className="hero-desc">
              We build ad systems: from script and shoot
              to&nbsp;launch and CRM lead delivery.
            </p>
            <div className="hero-actions">
              <a className="btn-p" href="#lead">Discuss the project</a>
              <a className="btn-o" href="#portfolio">View our work</a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-reel">
              <div className="hero-reel-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=85"
                  alt=""
                />
                <div className="hero-reel-grad" />
                <div className="hero-reel-info">
                  <span className="hero-reel-tag">SHOWREEL · 2025</span>
                  <span className="hero-reel-play" aria-label="Watch reel">▶</span>
                </div>
              </div>
              <div className="spin-badge">
                <svg viewBox="0 0 88 88" className="spin-badge-svg" aria-hidden="true">
                  <defs>
                    <path id="spin-c" d="M44,44 m-30,0 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0" />
                  </defs>
                  <text>
                    <textPath href="#spin-c">· VIDEO · ADS · SMM · DREAM · </textPath>
                  </text>
                </svg>
                <span className="spin-badge-icon" aria-hidden="true">↗</span>
              </div>
            </div>
          </div>
        </div>

        {/* stats bar */}
        <div className="wrap hero-foot">
          <div className="hero-mini-stats">
            <div className="h-stat">
              <strong>120+</strong>
              <span>projects delivered</span>
            </div>
            <div className="h-stat">
              <strong>38%</strong>
              <span>avg lead growth</span>
            </div>
            <div className="h-stat">
              <strong>12</strong>
              <span>days to launch</span>
            </div>
          </div>
          <p className="hero-foot-tag">No hidden fees · Results from day 12</p>
        </div>
      </section>

      {/* Ticker strip — lime */}
      <div className="ticker ticker-lime" aria-hidden="true">
        <div className="ticker-track">
          {[
            "Video","Ads","SMM","Analytics","CRM","Content","Shooting","Leads",
            "Video","Ads","SMM","Analytics","CRM","Content","Shooting","Leads",
          ].map((t, i) => (
            <span className="ticker-item" key={i}>· {t} </span>
          ))}
        </div>
      </div>

      {/* ── Problem — editorial rows, dark ── */}
      <section className="section s-dark2" id="problem">
        <div className="wrap">
          <p className="label">Problem</p>
          <div className="prob-header">
            <h2 className="sec-h">
              Why great-looking content<br />doesn't bring leads
            </h2>
            <p>
              Most agencies make things pretty. We make things work —
              building an end-to-end chain from the first frame to the CRM.
            </p>
          </div>
          <div className="prob-list">
            {problems.map((p, i) => (
              <div className="prob-row" key={i}>
                <span className="prob-n">0{i + 1}</span>
                <div className="prob-body">
                  <h3 className="prob-title">{p.title}</h3>
                  <p className="prob-desc">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section s-dark" id="services">
        <div className="wrap">
          <p className="label">Services</p>
          <h2 className="sec-h">Three directions —<br />one system</h2>
          <div className="svc-layout">
            <div className="svc-list">
              {services.map((s, i) => (
                <div className="svc-row" key={i}>
                  <span className="svc-row-num">0{i + 1}</span>
                  <h3 className="svc-row-name">{s.title}</h3>
                  <p className="svc-row-desc">{s.text}</p>
                  <span className="svc-row-arrow">↗</span>
                </div>
              ))}
              <div className="pipeline">
                {systemLane.map((step, i) => (
                  <div
                    className={`pipe-step${i === systemLane.length - 1 ? " hi" : ""}`}
                    key={i}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="svc-side">
              <div className="svc-side-img" style={{ aspectRatio: "4/5" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=700&q=72" alt="" />
              </div>
              <div className="svc-side-img" style={{ aspectRatio: "16/9" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=72" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker strip — ghost reverse */}
      <div className="ticker ticker-ghost" aria-hidden="true">
        <div className="ticker-track-rev">
          {[
            "Portfolio","Video production","Performance","SMM system","Leads","CRM integration","Analytics",
            "Portfolio","Video production","Performance","SMM system","Leads","CRM integration","Analytics",
          ].map((t, i) => (
            <span className="ticker-item" key={i}>· {t} </span>
          ))}
        </div>
      </div>

      {/* ── Portfolio ── */}
      <section className="section s-dark2" id="portfolio">
        <div className="wrap">
          <p className="label">Portfolio</p>
          <h2 className="sec-h" style={{ marginBottom: "44px" }}>Selected work</h2>
        </div>
        <div className="works-list">
          {reelItems.map((r, i) => (
            <div className="work-row" key={i}>
              <div className="wrap">
                <div className="work-row-inner">
                  <span className="work-num">0{i + 1}</span>
                  <div className="work-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.img} alt={r.title} />
                  </div>
                  <h3 className="work-title">{r.title}</h3>
                  <span className="work-tag">{r.tag}</span>
                  <span className="work-arrow">↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cases — full-bleed stat columns ── */}
      <section className="section s-dark" id="cases">
        <div className="wrap">
          <p className="label">Results</p>
          <h2 className="sec-h">Numbers<br />that matter</h2>
        </div>
        <div className="cases-strip">
          {cases.map((c, i) => (
            <div className="case-col" key={i}>
              <span className="case-col-n">0{i + 1}</span>
              <span className="case-col-val">{c.value}</span>
              <p className="case-col-desc">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Packages — full-bleed editorial rows ── */}
      <section className="section s-dark2" id="packages">
        <div className="wrap">
          <p className="label">Pricing</p>
          <h2 className="sec-h">Choose<br />your format</h2>
        </div>
        <div className="pkg-list">
          {packages.map((pkg, i) => (
            <div className={`pkg-row${pkg.feat ? " feat" : ""}`} key={i}>
              <div className="wrap">
                <div className="pkg-row-inner">
                  <span className="pkg-row-num">0{i + 1}</span>
                  <h3 className="pkg-row-name">{pkg.name}</h3>
                  <div className="pkg-row-meta">
                    <span className="pkg-row-price">{pkg.price}</span>
                    <span className="pkg-row-time">{pkg.time}</span>
                  </div>
                  <p className="pkg-row-desc">{pkg.text}</p>
                  <a className="pkg-row-btn" href="#lead">Let's talk ↗</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section className="section s-dark2" id="about">
        <div className="wrap">
          <div className="about-grid">
            <div className="about-copy">
              <p className="label">About us</p>
              <h2 className="sec-h">
                A team that measures<br />results in leads
              </h2>
              <p>
                DREAM is a full-cycle agency. We build systems: from script
                and shoot to ad launch and CRM lead delivery. Every step is
                set up so algorithms learn on clean data and you see growth.
              </p>
              <div className="about-tags">
                {["Video production", "Performance", "SMM", "CRM integrations", "Analytics"].map((t) => (
                  <span className="about-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="about-nums">
              <div className="about-num">
                <span className="about-num-val">120+</span>
                <span className="about-num-lbl">projects delivered</span>
              </div>
              <div className="about-num">
                <span className="about-num-val">38%</span>
                <span className="about-num-lbl">avg lead growth</span>
              </div>
              <div className="about-num">
                <span className="about-num-val">4+</span>
                <span className="about-num-lbl">years of agency experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews — dark bg, dramatic large quote mark ── */}
      <section className="section s-dark" id="reviews">
        <div className="wrap">
          <p className="label">Testimonials</p>
          <h2 className="sec-h">Clients speak</h2>
          <div className="rev-list">
            {reviews.map((r, i) => (
              <div className="rev-item" key={i}>
                <div className="rev-q-block">
                  <span className="rev-qmark" aria-hidden="true">&ldquo;</span>
                  <p className="rev-quote">{r.quote}</p>
                </div>
                <div className="rev-meta">
                  <p className="rev-author-name">{r.name}</p>
                  <p className="rev-author-role">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ — numbered, editorial ── */}
      <section className="section s-dark2" id="faq">
        <div className="wrap">
          <p className="label">FAQ</p>
          <h2 className="sec-h">Common questions</h2>
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
        <div className="wrap">
          <div className="lead-headline">
            <p className="label">Start working</p>
            <h2 className="sec-h">Tell us<br />about your project</h2>
          </div>
          <div className="lead-grid">
            <div className="lead-copy">
              <p>Fill in the form — we'll review the brief and send a proposal within one business day.</p>
              <div className="lead-steps">
                {steps.map((s, i) => (
                  <div className="lead-step" key={i}>
                    <span className="step-dot">{i + 1}</span>
                    <p>{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="wrap footer-inner">
          <p className="footer-copy">© {new Date().getFullYear()} DREAM Agency. All rights reserved.</p>
          <p className="footer-mark">Dream</p>
        </div>
      </footer>
    </>
  );
}
