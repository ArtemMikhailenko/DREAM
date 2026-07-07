import { getTranslations } from "next-intl/server";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollAnimations } from "@/components/ScrollAnimations";

// WhatsApp CTA target. Set NEXT_PUBLIC_WHATSAPP_URL in prod, e.g. https://wa.me/9725XXXXXXXX
const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/972000000000";

type Block = {
  heading: string;
  intro: string;
  list: string[];
  ordered?: boolean;
};

export async function ServicePage({ namespace }: { namespace: string }) {
  const t = await getTranslations(namespace);
  const body = t.raw("body") as string[];
  const blocks = t.raw("blocks") as Block[];

  return (
    <>
      <ScrollAnimations />
      <SiteNav />

      {/* ── Hero ── */}
      <section className="page-hero s-ink">
        <div className="bg-gray seam-down pin" aria-hidden="true" />
        <div className="wrap page-hero-inner">
          <p className="label">{t("label")}</p>
          <h1 className="page-hero-h">{t("h1")}</h1>
          {body[0] ? <p className="page-hero-sub">{body[0]}</p> : null}
        </div>
      </section>

      {/* ── Intro body ── */}
      {body.length > 1 ? (
        <section className="section s-dark">
          <div className="bg-gray seam-mid pin" aria-hidden="true" />
          <div className="wrap service-body">
            {body.slice(1).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Feature blocks ── */}
      {blocks.map((b, i) => (
        <section
          key={i}
          className={`section ${i % 2 === 0 ? "s-dark2" : "s-dark"}`}
        >
          <div className="bg-gray seam-mid pin" aria-hidden="true" />
          <div className="wrap service-block">
            <h2 className="sec-h">{b.heading}</h2>
            <p className="service-block-intro">{b.intro}</p>
            {b.ordered ? (
              <ol className="service-list service-list-ol">
                {b.list.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ol>
            ) : (
              <ul className="service-list">
                {b.list.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      {/* ── CTA ── */}
      <section className="section s-ink" id="cta">
        <div className="bg-gray seam-up pin" aria-hidden="true" />
        <div className="wrap" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <h2 className="sec-h">{t("h1")}</h2>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 36 }}>
            <a className="btn-p" href={WHATSAPP_URL} target="_blank" rel="noopener">
              {t("cta")} ↗
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
