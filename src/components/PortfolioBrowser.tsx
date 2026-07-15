"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

type Case = { title: string; tag: string; client: string; result: string };

export function PortfolioBrowser({
  categories,
  cases,
  images,
  slugs,
}: {
  categories: string[];
  cases: Case[];
  images: string[];
  slugs: string[];
}) {
  // categories[0] is the "All" option.
  const [active, setActive] = useState(categories[0]);
  const showAll = active === categories[0];

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
              <span className="portfolio-case-arrow" aria-hidden="true">↗</span>
            </Link>
          ) : null,
        )}
      </div>
    </>
  );
}
