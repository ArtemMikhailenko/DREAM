"use client";

import { useState } from "react";
import { AdCard } from "@/components/home/AdCard";
import type { AdCampaign } from "@/lib/ad-results";
import { WA_BOT, showcaseCopy } from "@/lib/showcase-copy";

type Site = { name: string; domain: string; url: string; desc: string; img: string; phone: string };
type Tab = "all" | "sites" | "results" | "bot";

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>;
const WaIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" fill="currentColor" />
  </svg>
);

/** Hidden client showcase: tabs on top, one section per kind of work. */
export function ShowcaseBrowser({ locale, sites, results }: { locale: string; sites: Site[]; results: AdCampaign[] }) {
  const t = showcaseCopy(locale);
  const [tab, setTab] = useState<Tab>("all");
  const wa = `https://wa.me/${WA_BOT}?text=${encodeURIComponent(t.waHello)}`;
  const tabs: { id: Tab; label: string; n?: number }[] = [
    { id: "all", label: t.all, n: sites.length + results.length + 1 },
    { id: "sites", label: t.sites, n: sites.length },
    { id: "results", label: t.results, n: results.length },
    { id: "bot", label: t.bot },
  ];
  const show = (id: Tab) => tab === "all" || tab === id;
  const go = (id: Tab) => {
    setTab(id);
    document.getElementById("sc-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="sc-tabs-wrap" id="sc-top">
        <div className="sc-tabs" role="tablist">
          {tabs.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} className={`sc-tab${tab === x.id ? " on" : ""}`} onClick={() => go(x.id)}>
              {x.label}
              {x.n != null && <span className="sc-n">{x.n}</span>}
            </button>
          ))}
        </div>
      </div>

      {show("sites") && (
        <section className="sc-sec" aria-label={t.sites}>
          {tab === "all" && <h2 className="sc-h"><span>{t.sites}</span><i>{sites.length}</i></h2>}
          <div className="sc-sites">
            {sites.map((s) => (
              <a className="sc-site" href={s.url} target="_blank" rel="noopener" key={s.domain}>
                <span className="sc-site-vis">
                  <span className="sc-browser">
                    <span className="sc-bar" aria-hidden="true"><i /><i /><i /><b>{s.domain}</b></span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.img} alt={`${s.name} — ${s.domain}`} loading="lazy" decoding="async" />
                  </span>
                  <span className="sc-phone" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.phone} alt="" loading="lazy" decoding="async" />
                  </span>
                </span>
                <span className="sc-site-info">
                  <b>{s.name}</b>
                  <small>{s.desc}</small>
                  <em>{t.open} <Arrow /></em>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {show("results") && (
        <section className="sc-sec" aria-label={t.results}>
          {tab === "all" && <h2 className="sc-h"><span>{t.results}</span><i>{results.length}</i></h2>}
          <div className="pf-res-grid in-tab sc-res">
            {results.map((c) => (
              <figure className="pf-res-card" key={c.thumb}><AdCard c={c} locale={locale} /></figure>
            ))}
          </div>
        </section>
      )}

      {show("bot") && (
        <section className="sc-sec" aria-label={t.bot}>
          {tab === "all" && <h2 className="sc-h"><span>{t.bot}</span></h2>}
          <div className="sc-bot">
            <div className="sc-bot-txt">
              <h3>{t.botTitle} <em>{t.botEm}</em></h3>
              <p>{t.botText}</p>
              <ul>{t.botPoints.map((p) => <li key={p}>{p}</li>)}</ul>
              <a className="sc-wa glass-btn cta-pulse" href={wa} target="_blank" rel="noopener"><WaIcon />{t.botCta}</a>
              <small className="sc-note">{t.botNote}</small>
            </div>
            <div className="sc-chat" aria-hidden="true">
              <div className="sc-chat-h"><span className="av">dc.</span><span><b>DC Production</b><small>online</small></span></div>
              <div className="sc-chat-b">
                <p className="in">{t.waHello}</p>
                <p className="out">{t.botReply}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
