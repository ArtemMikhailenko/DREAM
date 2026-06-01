import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { ScrollAnimations } from "@/components/ScrollAnimations";

export const metadata: Metadata = {
  title: "Client testimonials",
  description:
    "What dc.prod clients say about working with us: video production, ad campaigns, social media and full-funnel results.",
  alternates: { canonical: "/testimonials" },
};

export const reviews = [
  {
    quote:
      "The team understood the product fast and turned a complex service into a clear, compelling video. Leads came in warmer from the very first month.",
    name: "Marina K.",
    company: "Service Studio",
    role: "Founder",
  },
  {
    quote:
      "They didn't just make a video — they built a complete ad system. The best part: transparent analytics with zero duplicates.",
    name: "Alex P.",
    company: "Growth Agency",
    role: "Head of Sales",
  },
  {
    quote:
      "In 12 days from brief to first live campaign. The creative quality was way above what we expected at this price point.",
    name: "Diana S.",
    company: "EdTech Platform",
    role: "Marketing Director",
  },
  {
    quote:
      "CRM was a mess before dc.prod. Now every lead has a clean event_id, no duplicates, and our ads actually learn from real data.",
    name: "Roman V.",
    company: "B2B SaaS",
    role: "CEO",
  },
  {
    quote:
      "We shot a full brand film and launched paid social in one sprint. The cost per qualified lead dropped 24% in the first month.",
    name: "Olena M.",
    company: "Luxury Retail",
    role: "Brand Manager",
  },
  {
    quote:
      "Our content calendar used to be chaos. dc.prod built a content system with real metrics tied to leads — completely changed how we operate.",
    name: "Dmytro L.",
    company: "Lifestyle Brand",
    role: "Co-founder",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Page hero ── */}
      <section className="page-hero s-ink">
        <div className="s-bg-word" aria-hidden="true">Clients</div>
        <div className="wrap page-hero-inner">
          <p className="label">What clients say</p>
          <h1 className="page-hero-h">
            Clients <em>speak</em>
          </h1>
          <p className="page-hero-sub">
            Real feedback from real projects — video, ads, SMM and full-funnel builds.
          </p>
        </div>
      </section>

      {/* ── Featured carousel ── */}
      <section className="section s-dark2" id="featured">
        <div className="wrap">
          <p className="label">Featured testimonials</p>
          <ReviewsCarousel reviews={reviews} />
        </div>
      </section>

      {/* ── All reviews list ── */}
      <section className="section s-dark" id="all">
        <div className="s-bg-word" aria-hidden="true">Reviews</div>
        <div className="wrap">
          <p className="label">All testimonials</p>
          <h2 className="sec-h">Every <em>voice</em></h2>
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
          <p className="label">Your turn</p>
          <h2 className="sec-h">Become the<br />next <em>success story</em></h2>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 40 }}>
            <a className="btn-p" href="/#lead">Get a brief ↗</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
