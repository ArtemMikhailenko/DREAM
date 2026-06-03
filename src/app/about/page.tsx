import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";

export const metadata: Metadata = {
  title: "About the studio",
  description:
    "dc.prod is a full-cycle production studio — video, ads, SMM and digital marketing. Learn our story, philosophy and team.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    n: "01",
    title: "Craft first",
    desc: "Every frame, every word and every data point is made at production-house level. Low-quality work does not leave the studio.",
  },
  {
    n: "02",
    title: "Systems over pieces",
    desc: "We don't deliver isolated files. We build the whole machine: concept → content → channels → analytics.",
  },
  {
    n: "03",
    title: "Performance is mandatory",
    desc: "Beautiful work that doesn't generate leads is a failure. Every project has a measurable outcome attached.",
  },
  {
    n: "04",
    title: "Transparent by default",
    desc: "You see every campaign metric, creative test and lead count. No black boxes, no creative-only reports.",
  },
];

const capabilities = [
  "Promotional video",
  "Image & brand films",
  "3D animation",
  "AI-generated content",
  "Social media content",
  "Paid ad campaigns",
  "Landing pages",
  "CRM & pixel setup",
  "Analytics & attribution",
  "SMM management",
  "Brief & offer strategy",
  "Post-production",
];

export default function AboutPage() {
  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Page hero ── */}
      <section className="page-hero s-ink">
        <div className="s-bg-word" aria-hidden="true">Studio</div>
        <div className="wrap page-hero-inner">
          <p className="label">About dc.prod</p>
          <h1 className="page-hero-h">
            A studio that<br />builds <em>systems</em>
          </h1>
          <p className="page-hero-sub">
            Full-cycle production. From brief to lead delivered — with craft at every step.
          </p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="section s-dark" id="story">
        <div className="wrap">
          <div className="about-grid">
            <div className="about-copy">
              <p className="label">Our story</p>
              <h2 className="sec-h">
                dc.prod in<br />two paragraphs
              </h2>
              <p>
                dc.prod started as a video production team obsessed with cinema-grade visuals.
                Over time we realized great-looking work alone wasn&apos;t enough — clients needed
                leads, not awards. So we built the missing layers: ads strategy, landing design,
                CRM wiring and attribution.
              </p>
              <p>
                Today dc.prod is a full-cycle studio. We handle the complete journey from
                offer strategy and scriptwriting through shooting and post-production to ad
                launch, pixel verification and transparent analytics. Everything in one team,
                one brief, one invoice.
              </p>
              <div className="about-tags">
                {capabilities.map((t) => (
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

      {/* ── Values ── */}
      <section className="section s-dark2" id="values">
        <div className="s-bg-word" aria-hidden="true">Values</div>
        <div className="wrap">
          <p className="label">Our principles</p>
          <h2 className="sec-h">What we <em>stand for</em></h2>
          <div className="prob-cards" style={{ marginTop: 60 }}>
            {values.map((v) => (
              <div className="prob-card" key={v.n}>
                <span className="prob-card-n">{v.n}</span>
                <h3 className="prob-card-title">{v.title}</h3>
                <p className="prob-card-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section s-cream" id="impact">
        <div className="wrap">
          <p className="label">By the numbers</p>
          <h2 className="sec-h">Real <em>impact</em></h2>
        </div>
        <div className="cases-strip cases-strip-cream cases-strip-4">
          {[
            { value: "+38%", label: "average growth in inbound leads after first campaign wave" },
            { value: "−24%", label: "drop in cost per lead through iterative creative testing" },
            { value: "12", label: "days from brief signing to first ad live" },
            { value: "100+", label: "clients across video, ads, branding and SMM" },
          ].map((s, i) => (
            <div className="case-col" key={i}>
              <span className="case-col-n">0{i + 1}</span>
              <span className="case-col-val">{s.value}</span>
              <p className="case-col-desc">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section s-ink" id="cta">
        <div className="wrap" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <p className="label">Ready to start?</p>
          <h2 className="sec-h">Let&apos;s build<br />something <em>together</em></h2>
          <p style={{ color: "var(--cream2)", marginTop: 24, marginBottom: 40, fontSize: "1.05rem" }}>
            Drop us a brief and we&apos;ll send a proposal within one business day.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <a className="btn-p" href="/#lead">Get a brief ↗</a>
            <a className="btn-o" href="/portfolio">See our works ↗</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
