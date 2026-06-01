"use client";

import { useState, useEffect, useCallback } from "react";

export interface Review {
  quote: string;
  name: string;
  role: string;
  company?: string;
}

export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0);

  const prev = useCallback(
    () => setActive((i) => (i - 1 + reviews.length) % reviews.length),
    [reviews.length]
  );
  const next = useCallback(
    () => setActive((i) => (i + 1) % reviews.length),
    [reviews.length]
  );

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="rev-car">
      <div className="rev-car-overflow">
        <div
          className="rev-car-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {reviews.map((r, i) => (
            <div
              className="rev-car-slide"
              key={i}
              aria-hidden={i !== active}
            >
              <span className="rev-car-qmark" aria-hidden="true">&ldquo;</span>
              <blockquote className="rev-car-quote">{r.quote}</blockquote>
              <div className="rev-car-author">
                <span className="rev-car-name">{r.name}</span>
                {r.company && (
                  <span className="rev-car-company">{r.company}</span>
                )}
                <span className="rev-car-role">{r.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rev-car-controls">
        <button className="rev-car-btn" onClick={prev} aria-label="Previous review">
          ←
        </button>
        <div className="rev-car-dots" role="tablist">
          {reviews.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              className={`rev-car-dot${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
        <button className="rev-car-btn" onClick={next} aria-label="Next review">
          →
        </button>
        <span className="rev-car-counter">
          {active + 1} / {reviews.length}
        </span>
      </div>
    </div>
  );
}
