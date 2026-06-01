import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";

export const metadata: Metadata = {
  title: "Portfolio — our works",
  description:
    "dc.prod portfolio: promotional videos, brand films, ad campaigns, social content systems. Real cases with measurable results.",
  alternates: { canonical: "/portfolio" },
};

const cases = [
  {
    title: "Brand Identity Film",
    tag: "Image video",
    client: "Luxury retail brand",
    result: "+42% brand recall",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Performance Campaign",
    tag: "Ads & creatives",
    client: "EdTech startup",
    result: "−31% CPL in 3 weeks",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Social Content System",
    tag: "SMM",
    client: "Lifestyle brand",
    result: "+120% organic reach",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Product Launch Video",
    tag: "Promotional video",
    client: "SaaS platform",
    result: "12K views in 48h",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Cinematic Brand Story",
    tag: "Image video",
    client: "Architecture firm",
    result: "2× more qualified leads",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=70",
  },
  {
    title: "Full Funnel Build",
    tag: "Full funnel",
    client: "B2B services company",
    result: "+38% inbound leads",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=70",
  },
];

const categories = ["All", "Image video", "Ads & creatives", "SMM", "Full funnel", "Promotional video"];

export default function PortfolioPage() {
  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Page hero ── */}
      <section className="page-hero s-ink">
        <div className="s-bg-word" aria-hidden="true">Works</div>
        <div className="wrap page-hero-inner">
          <p className="label">Selected works</p>
          <h1 className="page-hero-h">
            Our<br /><em>portfolio</em>
          </h1>
          <p className="page-hero-sub">
            Cases across video, ads, branding and social — each with a measurable outcome.
          </p>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <div className="section s-dark2" style={{ paddingBlock: "40px" }}>
        <div className="wrap">
          <div className="portfolio-filter">
            {categories.map((c) => (
              <span className="portfolio-filter-item" key={c}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cases grid ── */}
      <section className="section s-dark" id="cases" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="portfolio-grid portfolio-grid-lg">
            {cases.map((c, i) => (
              <a className="portfolio-case" href="#" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="portfolio-case-img"
                  src={c.img}
                  alt={c.title}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="portfolio-case-grad" />
                <div className="portfolio-case-info">
                  <span className="portfolio-case-tag">{c.tag}</span>
                  <h2 className="portfolio-case-title">{c.title}</h2>
                  <p className="portfolio-case-meta">{c.client} · <strong>{c.result}</strong></p>
                </div>
                <span className="portfolio-case-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section s-concrete" id="cta">
        <div className="wrap" style={{ textAlign: "center" }}>
          <p className="label">Your project next?</p>
          <h2 className="sec-h">Let&apos;s make<br />something <em>great</em></h2>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 40 }}>
            <a className="btn-p" href="/#lead">Get a brief ↗</a>
            <a className="btn-o" href="/about">About the studio ↗</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
