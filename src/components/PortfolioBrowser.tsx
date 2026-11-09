"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

type Case = { title: string; tag: string; client: string; result: string };
type Site = { name: string; domain: string; url: string; desc: string; img: string; phone: string };

export function PortfolioBrowser({
  categories,
  cases,
  images,
  slugs,
  empty,
  resultsLabel,
  results = [],
  sitesLabel,
  sites = [],
  siteOpen = "",
}: {
  categories: string[];
  cases: Case[];
  images: string[];
  slugs: string[];
  empty?: string;
  resultsLabel?: string;
  results?: string[];
  sitesLabel?: string;
  sites?: Site[];
  siteOpen?: string;
}) {
  // categories[0] is the "All" option.
  const [active, setActive] = useState(categories[0]);
  const showAll = active === categories[0];
  const showResults = !!resultsLabel && active === resultsLabel;
  const showSites = !!sitesLabel && active === sitesLabel && sites.length > 0;
  const sitesList = (
    <div className="pf-sites">
      {sites.map((s, i) => (
        <article className={`pf-site${i % 2 ? " is-flip" : ""}`} key={s.domain}>
          <a className="pf-site-vis" href={s.url} target="_blank" rel="noopener" aria-label={`${s.name} — ${siteOpen}`}>
            <span className="pf-browser">
              <span className="pf-browser-bar" aria-hidden="true"><i /><i /><i /><span className="pf-browser-url">{s.domain}</span></span>
              <span className="pf-browser-screen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={`${s.name} — ${s.domain}`} loading="lazy" decoding="async" />
              </span>
            </span>
            <span className="pf-phone" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.phone} alt="" loading="lazy" decoding="async" />
            </span>
          </a>
          <div className="pf-site-info">
            <span className="pf-site-num">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="pf-site-name">{s.name}</h2>
            <p className="pf-site-domain">{s.domain}</p>
            <p className="pf-site-desc">{s.desc}</p>
            <a className="pf-site-btn glass-btn" href={s.url} target="_blank" rel="noopener">
              {siteOpen}
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
            </a>
          </div>
        </article>
      ))}
    </div>
  );
  const resultsGrid = (
    <div className="pf-res-grid in-tab">
      {results.map((src) => (
        <figure className="pf-res-card" key={src}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" loading="lazy" decoding="async" />
        </figure>
      ))}
    </div>
  );

  return (
    <>
      <div className="portfolio-filter">
        {categories.map((c) => (
          <button
            type="button"
            className={`portfolio-filter-item${active === c ? " active" : ""}`}
            onClick={() => setActive(c)}
            key={c}
          >
            {c}
          </button>
        ))}
      </div>

      {showSites ? sitesList : showResults ? resultsGrid : (
      <div className="portfolio-grid portfolio-grid-lg">
        {cases.map((c, i) =>
          showAll || c.tag === active ? (
            <Link className="portfolio-case" href={`/portfolio/${slugs[i]}`} key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="portfolio-case-img"
                src={images[i]}
                alt={c.title}
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="portfolio-case-grad" />
              <div className="portfolio-case-info">
                <span className="portfolio-case-tag">{c.tag}</span>
                <h2 className="portfolio-case-title">{c.title}</h2>
                <p className="portfolio-case-meta">
                  {c.client} · <strong>{c.result}</strong>
                </p>
              </div>
            </Link>
          ) : null,
        )}
      </div>
      )}
      {!showAll && !showResults && !showSites && !cases.some((c) => c.tag === active) && empty && <p className="pf-empty">{empty}</p>}
      {showAll && sites.length > 0 && sitesLabel && (
        <div className="pf-all-res">
          <p className="pf-all-res-h">{sitesLabel}</p>
          {sitesList}
        </div>
      )}
      {showAll && results.length > 0 && resultsLabel && (
        <div className="pf-all-res">
          <p className="pf-all-res-h">{resultsLabel}</p>
          {resultsGrid}
        </div>
      )}
    </>
  );
}
