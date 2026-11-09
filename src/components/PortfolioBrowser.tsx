"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

type Case = { title: string; tag: string; client: string; result: string };

export function PortfolioBrowser({
  categories,
  cases,
  images,
  slugs,
  empty,
  resultsLabel,
  results = [],
}: {
  categories: string[];
  cases: Case[];
  images: string[];
  slugs: string[];
  empty?: string;
  resultsLabel?: string;
  results?: string[];
}) {
  // categories[0] is the "All" option.
  const [active, setActive] = useState(categories[0]);
  const showAll = active === categories[0];
  const showResults = !!resultsLabel && active === resultsLabel;
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

      {showResults ? resultsGrid : (
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
      {!showAll && !showResults && !cases.some((c) => c.tag === active) && empty && <p className="pf-empty">{empty}</p>}
      {showAll && results.length > 0 && resultsLabel && (
        <div className="pf-all-res">
          <p className="pf-all-res-h">{resultsLabel}</p>
          {resultsGrid}
        </div>
      )}
    </>
  );
}
