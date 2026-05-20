import { LeadForm } from "@/components/LeadForm";
import { ScrollAnimations } from "@/components/ScrollAnimations";

const services = [
  {
    title: "Promotional videos",
    text: "Scripts, shooting and editing for video ads that actually convert — built around your offer and audience.",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=700&q=72",
    tag: "video",
  },
  {
    title: "Image & brand films",
    text: "Cinematic brand stories — concept, art direction, location and post-production at production-house level.",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=700&q=72",
    tag: "image",
  },
  {
    title: "Social media & ads",
    text: "Content system, paid ads, pixels, CRM and analytics — one machine working toward inbound leads.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=72",
    tag: "smm",
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
            <span className="brush">dc.prod</span>
            <small>studio · 2026</small>
          </a>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#packages">Pricing</a></li>
            <li><a href="#portfolio">Works</a></li>
            <li><a href="#lead">Contacts</a></li>
          </ul>
          <div className="nav-side">
            <a className="nav-call" href="tel:+1000">↳ Call</a>
            <a className="nav-cta" href="#lead">Sign up for an audit</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2000&q=85"
            alt=""
          />
        </div>

        <div className="wrap hero-head">
          <div className="hero-kicker">
            <span className="hero-kicker-dot" />
            <span className="hero-kicker-text">We helped +100 clients</span>
          </div>
        </div>

        <div className="wrap hero-body">
          <div className="hero-left">
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
              <a className="btn-o" href="#portfolio">See our works ↗</a>
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
        <div className="s-bg-word" aria-hidden="true">Problem</div>
        <div className="wrap">
          <p className="label">The Problem</p>
          <h2 className="sec-h">
            Why great content<br />doesn&apos;t bring leads
          </h2>
          <div className="prob-cards">
            {problems.map((p, i) => (
              <div className="prob-card" key={i}>
                <span className="prob-card-n">0{i + 1}</span>
                <h3 className="prob-card-title">{p.title}</h3>
                <p className="prob-card-desc">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section s-concrete" id="services">
        <div className="s-bg-word" aria-hidden="true">Services</div>
        <div className="wrap">
          <p className="label">Services</p>
          <h2 className="sec-h">Three directions —<br />one <em>system</em></h2>
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
            </div>
            <div className="svc-side">
              <div className="svc-side-img" style={{ aspectRatio: "4/5" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={services[0].img} alt="" />
                <span className="svc-side-tag">on set</span>
              </div>
              <div className="svc-side-img" style={{ aspectRatio: "16/10" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={services[2].img} alt="" />
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
      <section className="section s-dark2" id="process">
        <div className="s-bg-word" aria-hidden="true">Process</div>
        <div className="wrap">
          <p className="label">How we work</p>
          <h2 className="sec-h">From brief<br />to first <em>lead</em></h2>
          <div className="process-steps">
            {processSteps.map((step) => (
              <div className={`process-step${step.hi ? " hi" : ""}`} key={step.n}>
                <span className="process-step-n">{step.n}</span>
                <span className="process-step-name">{step.name}</span>
                <p className="process-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio — compact 3-card showcase ── */}
      <section className="section s-dark" id="portfolio">
        <div className="s-bg-word" aria-hidden="true">Works</div>
        <div className="wrap">
          <p className="label">Selected work</p>
          <h2 className="sec-h">Cases &amp; projects</h2>
          <div className="portfolio-grid">
            {portfolioCases.map((c, i) => (
              <div className="portfolio-case" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="portfolio-case-img" src={c.img} alt={c.title} />
                <div className="portfolio-case-grad" />
                <div className="portfolio-case-info">
                  <span className="portfolio-case-tag">{c.tag}</span>
                  <h3 className="portfolio-case-title">{c.title}</h3>
                </div>
                <span className="portfolio-case-arrow" aria-hidden="true">↗</span>
              </div>
            ))}
          </div>
          <a className="portfolio-cta" href="#lead">Start a project like this ↗</a>
        </div>
      </section>

      {/* ── Results — single place for all numbers ── */}
      <section className="section s-dark2" id="results">
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

      {/* ── Pricing ── */}
      <section className="section s-concrete" id="packages">
        <div className="s-bg-word" aria-hidden="true">Pricing</div>
        <div className="wrap">
          <p className="label">Pricing</p>
          <h2 className="sec-h">Choose<br />your <em>format</em></h2>
          <div className="pkg-cards">
            {packages.map((pkg, i) => (
              <article className={`pkg-card${pkg.feat ? " feat" : ""}`} key={i}>
                <div className="pkg-card-head">
                  <span className="pkg-card-badge">0{i + 1} / {packages.length}</span>
                  <span className="pkg-card-tag">{pkg.tag}</span>
                </div>
                <h3 className="pkg-card-name">{pkg.name}</h3>
                <ul className="pkg-rows">
                  {pkg.rows.map((row, idx) => (
                    <li className="pkg-rows-li" key={idx}>
                      <span>{row.name}</span>
                      {row.extra ? <span className="pkg-rows-extra">{row.extra}</span> : <span />}
                      <span className="pkg-rows-num">{idx + 1}</span>
                    </li>
                  ))}
                </ul>
                <div className="pkg-card-foot">
                  <span className="pkg-card-price">{pkg.price}</span>
                  {pkg.priceOld && <span className="pkg-card-price-old">{pkg.priceOld}</span>}
                  <span className="pkg-card-time">{pkg.time}</span>
                </div>
                <a className="pkg-card-btn" href="#lead">Get started ↗</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── About — after Pricing per redesign ── */}
      <section className="section s-dark" id="about">
        <div className="s-bg-word" aria-hidden="true">Studio</div>
        <div className="wrap">
          <div className="about-grid">
            <div className="about-copy">
              <p className="label">About the studio</p>
              <h2 className="sec-h">
                A studio that<br />builds <em>systems</em>
              </h2>
              <p>
                dc.prod is a full-cycle production studio. We don&apos;t just make
                videos — we build the entire production-and-marketing system: from
                idea and script to shoot, landing page, ads launch and CRM lead
                delivery.
              </p>
              <p>
                Our philosophy: craft and performance aren&apos;t opposites. Cinematic
                visuals only earn their place when they bring measurable inbound
                leads. We treat every project as a single machine — concept, content,
                channels and analytics built together.
              </p>
              <div className="about-tags">
                {[
                  "Video production",
                  "3D & AI",
                  "Performance ads",
                  "SMM",
                  "CRM",
                  "Analytics",
                ].map((t) => (
                  <span className="about-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="about-vis">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
                alt="dc.prod studio"
              />
              <p className="about-vis-slogan">from idea<br />to result</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="section s-dark2" id="reviews">
        <div className="wrap">
          <p className="label">Testimonials</p>
          <h2 className="sec-h">Clients <em>speak</em></h2>
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

      {/* ── FAQ ── */}
      <section className="section s-dark" id="faq">
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
        <div className="wrap">
          <div className="lead-headline">
            <p className="label">Let&apos;s talk</p>
            <h2 className="sec-h">
              Let&apos;s build<br />something <em>stylish.</em>
            </h2>
          </div>
          <div className="lead-grid">
            <div className="lead-copy">
              <p>
                Fill in the form — we&apos;ll review the brief and send a proposal
                within one business day.
              </p>
              <div className="lead-steps">
                {steps.map((s, i) => (
                  <div className="lead-step" key={i}>
                    <span className="step-dot">{i + 1}</span>
                    <p>{s}</p>
                  </div>
                ))}
              </div>
              <div className="lead-contacts">
                <a className="lead-contact" href="https://t.me/" target="_blank" rel="noopener">
                  <span className="lead-contact-icon">✈</span>
                  Telegram — @dcprod
                </a>
                <a className="lead-contact" href="https://instagram.com/" target="_blank" rel="noopener">
                  <span className="lead-contact-icon">◉</span>
                  Instagram — @dc.prod
                </a>
                <a className="lead-contact" href="mailto:hi@dcprod.agency">
                  <span className="lead-contact-icon">@</span>
                  hi@dcprod.agency
                </a>
              </div>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="wrap footer-inner">
          <p className="footer-copy">© {new Date().getFullYear()} dc.prod studio · From idea to result</p>
          <p className="footer-mark brush">dc.prod</p>
        </div>
      </footer>
    </>
  );
}
