import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { ServiceGlyph } from "@/components/ServiceGlyph";
import { QuoteForm, type ServiceSlug } from "@/components/QuoteForm";

// WhatsApp CTA target. Set NEXT_PUBLIC_WHATSAPP_URL in prod, e.g. https://wa.me/9725XXXXXXXX
const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/972000000000";

// Canonical service order — drives the hero index and sibling cross-links.
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

// Site textures rotated behind feature blocks for per-page variety.
const BLOCK_BG = ["bg-gromophon", "bg-gray-pin", "bg-wood"];


type Block = {
  heading: string;
  intro: string;
  list: string[];
  ordered?: boolean;
};

export async function ServicePage({ namespace }: { namespace: string }) {
  const t = await getTranslations(namespace);
  const idx = await getTranslations("ServicesIndex");
  const body = t.raw("body") as string[];
  const blocks = t.raw("blocks") as Block[];

  const slug = namespace.split(".")[1] ?? "";
  const pos = SLUGS.indexOf(slug as (typeof SLUGS)[number]);
  const num = String((pos < 0 ? 0 : pos) + 1).padStart(2, "0");
  const total = String(SLUGS.length).padStart(2, "0");
  const others = SLUGS.filter((s) => s !== slug);

  // Short punchy phrases for the contrast marquee — the first block's list.
  const marquee = (blocks[0]?.list ?? []).length ? blocks[0].list : [t("label")];
  // Hero photo comes from the CMS (Услуги → Фото в шапке). Services without one
  // fall back to the "what's included" panel.
  const heroImage = t.has("image") ? (t.raw("image") as string | undefined) : undefined;

  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Hero ── */}
      <section className={`page-hero s-ink svc-hero${heroImage ? " svc-hero--photo" : ""}`}>
        {heroImage ? (
          <>
            <div className="svc-hero-media" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="" loading="eager" decoding="async" />
            </div>
            <div className="svc-hero-scrim" aria-hidden="true" />
          </>
        ) : (
          <div className="bg-gray seam-down pin" aria-hidden="true" />
        )}
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap page-hero-inner">
          <div className="svc-hero-grid">
            <div className="svc-hero-left">
              <div className="svc-hero-kicker">
                <span className="svc-hero-badge" aria-hidden="true"><ServiceGlyph slug={slug} /></span>
                <span className="svc-hero-index">{num} <i>/ {total}</i></span>
                <p className="label">{t("label")}</p>
              </div>
              <h1 className="page-hero-h">{t("h1")}</h1>
              {body[0] ? <p className="page-hero-sub">{body[0]}</p> : null}
              <div className="hero-actions">
                <a className="btn-p" href={WHATSAPP_URL} target="_blank" rel="noopener">
                  {t("cta")} ↗
                </a>
              </div>
            </div>
            {/* Quote form fills the right column, over the photo backdrop on the
                services that have one. It's in the hero per the SEO spec, and the
                dropdown preselects this page's own service. */}
            <div className="svc-hero-right">
              <QuoteForm service={slug as ServiceSlug} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Lead / intro ── */}
      {body.length > 1 ? (
        <section className="section s-dark">
          <div className="bg-gray seam-mid pin" aria-hidden="true" />
          <div className="wrap svc-lead-wrap">
            <p className="svc-lead">{body[1]}</p>
            {body.length > 2 ? (
              <div className="svc-lead-cols">
                {body.slice(2).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── Contrast marquee ── */}
      <div className="ticker ticker-cream" aria-hidden="true">
        <div className="ticker-track">
          {[...marquee, ...marquee, ...marquee].map((m, i) => (
            <span className="ticker-item" key={i}>{m}</span>
          ))}
        </div>
      </div>

      {/* ── Feature blocks ── */}
      {blocks.map((b, i) => (
        <section
          key={i}
          className={`section svc-block-sec ${i % 2 === 0 ? "s-dark2" : "s-dark"}${i % 2 === 1 ? " rev" : ""}`}
        >
          <div className={BLOCK_BG[(pos + i) % BLOCK_BG.length]} aria-hidden="true" />
          <div className="wrap svc-block2">
            <div className="svc-block2-head">
              <span className="svc-block2-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="svc-block2-glyph" aria-hidden="true"><ServiceGlyph slug={slug} /></span>
              <h2 className="sec-h">{b.heading}</h2>
              <p className="service-block-intro">{b.intro}</p>
            </div>
            <div className="svc-block2-body">
              {b.ordered ? (
                <ol className="svc-steps">
                  {b.list.map((li, j) => (
                    <li className="svc-step" key={j}>
                      <span className="svc-step-n" aria-hidden="true">{String(j + 1).padStart(2, "0")}</span>
                      <span className="svc-step-t">{li}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="svc-cards">
                  {b.list.map((li, j) => (
                    <div className="svc-card" key={j}>
                      <span className="svc-card-mark" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
                      </span>
                      <span className="svc-card-txt">{li}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* ── CTA ── */}
      <section className="section s-ink" id="cta">
        <div className="bg-gray seam-up pin" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 className="sec-h">{t("h1")}</h2>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 36 }}>
            <a className="btn-p" href={WHATSAPP_URL} target="_blank" rel="noopener">
              {t("cta")} ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Other services ── */}
      <section className="section s-dark2">
        <div className="bg-gray seam-mid pin" aria-hidden="true" />
        <div className="wrap svc-cross">
          <p className="label">{idx("other")}</p>
          <div className="svc-cross-grid">
            {others.map((s) => (
              <Link key={s} href={`/services/${s}`} className="svc-cross-card">
                {idx(`items.${s}.title`)} <i aria-hidden="true">↗</i>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
