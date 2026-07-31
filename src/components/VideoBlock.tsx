"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

const FEAT_ICONS = [
  // fast — bolt
  <path key="i" d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  // real cases — target
  <>
    <circle key="c1" cx="12" cy="12" r="9" />
    <circle key="c2" cx="12" cy="12" r="3.5" />
  </>,
  // results — spark
  <path key="s" d="M12 2c.6 4.5 2.9 6.8 7.4 7.4-4.5.6-6.8 2.9-7.4 7.4-.6-4.5-2.9-6.8-7.4-7.4C9.1 8.8 11.4 6.5 12 2z" />,
];

export function VideoBlock() {
  const t = useTranslations("Showreel");
  const locale = useLocale();
  // Each locale has its own cut; anything else falls back to the English one.
  const lang = locale === "ru" ? "ru" : locale === "he" ? "he" : "en";
  const badge = lang === "ru" ? "RU" : lang === "he" ? "HE" : "EN";

  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [showCta, setShowCta] = useState(false);

  const feats = t.raw("feats") as { t: string; s: string; d: string }[];
  const orbit = t.raw("orbit") as string[];

  // Emphasise only the first word of the accent phrase (amber), like the ref.
  const emWords = t("headingEm").split(" ");
  const emFirst = emWords[0];
  const emRest = emWords.slice(1).join(" ");

  // Morph the theater frame between the inline card rect and its full-screen
  // rect (FLIP) so the player looks like it flies out and expands to fill the view.
  const flip = useCallback((collapsing: boolean) => {
    const card = cardRef.current;
    const frame = frameRef.current;
    if (!card || !frame) return;
    const from = card.getBoundingClientRect();
    const to = frame.getBoundingClientRect();
    const invert =
      `translate(${from.left - to.left}px, ${from.top - to.top}px) ` +
      `scale(${from.width / to.width}, ${from.height / to.height})`;
    frame.style.transformOrigin = "top left";
    if (collapsing) {
      frame.style.transition = "transform .46s cubic-bezier(.4,0,.2,1)";
      frame.style.transform = invert;
    } else {
      frame.style.transition = "none";
      frame.style.transform = invert;
      void frame.offsetWidth; // reflow so the next change animates
      frame.style.transition = "transform .62s cubic-bezier(.2,.85,.25,1)";
      frame.style.transform = "none";
    }
  }, []);

  const openTheater = useCallback(() => {
    setOpen(true);
    flip(false);
    document.body.style.overflow = "hidden";
    void videoRef.current?.play();
  }, [flip]);

  const closeTheater = useCallback(() => {
    setOpen(false);
    flip(true);
    document.body.style.overflow = "";
    const v = videoRef.current;
    window.setTimeout(() => {
      const frame = frameRef.current;
      if (frame) {
        frame.style.transition = "none";
        frame.style.transform = "none";
      }
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    }, 470);
  }, [flip]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeTheater();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeTheater]);

  // "Book a consultation" surfaces a few seconds into the film.
  useEffect(() => {
    if (!open) {
      setShowCta(false);
      return;
    }
    const id = window.setTimeout(() => setShowCta(true), 3500);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <section className="section s-ink vblock-sec" id="showreel">
      <div className="bg-gray seam-mid pin" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="s-bg-word" aria-hidden="true">Reel</div>

      <div className="wrap vblock-layout">
        {/* ── Copy ── */}
        <div className="vblock-copy">
          <p className="label">{t("label")}</p>
          <h2 className="sec-h">
            {t("heading")} <em>{emFirst}</em>{emRest ? ` ${emRest}` : ""}
          </h2>
          <p className="vblock-lead">{t("lead")}</p>
          <div className="vblock-meta" aria-hidden="true">
            <span><i className="vblock-rec" /> Showreel</span>
            <span>0:60</span>
            <span>{badge}</span>
          </div>
          <div className="vblock-actions">
            <a className="btn-p vblock-book" href="#lead">
              {t("book")} <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              className="vblock-round"
              onClick={openTheater}
              aria-label={t("trigger")}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Orbit decoration ── */}
        <div className="vblock-orbit" aria-hidden="true">
          <span className="vb-ring vb-ring-1" />
          <span className="vb-ring vb-ring-2" />
          <span className="vb-orbit-dot vb-dot-1" />
          <span className="vb-orbit-dot vb-dot-2" />
          <span className="vb-orbit-node vb-node-t">
            <span className="vb-node-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
            </span>
            <span className="vb-node-l">{orbit[0]}</span>
          </span>
          <span className="vb-orbit-node vb-node-b">
            <span className="vb-node-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><circle cx="9" cy="10.5" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="10.5" r="1" fill="currentColor" stroke="none" /><path d="M8.5 15.5c1-1 5-1 7 0" /></svg>
            </span>
            <span className="vb-node-l">{orbit[1]}</span>
          </span>
          <span className="vb-orbit-core">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </div>

        {/* ── Player card (opens theater) ── */}
        <div ref={cardRef} className={`vblock${open ? " is-open" : ""}`}>
          <span className="vblock-corner tl" aria-hidden="true" />
          <span className="vblock-corner tr" aria-hidden="true" />
          <span className="vblock-corner bl" aria-hidden="true" />
          <span className="vblock-corner br" aria-hidden="true" />
          <span className="vblock-tag" aria-hidden="true">
            <i className="vblock-rec" /> SHOWREEL · 0:60
          </span>
          <button
            type="button"
            className="vblock-expand"
            onClick={openTheater}
            aria-label={t("trigger")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="vblock-poster"
            src={`/videos/vsl-${lang}-poster.webp`}
            alt=""
            loading="lazy"
            decoding="async"
          />

          <button type="button" className="vblock-play" onClick={openTheater}>
            <span className="vblock-play-btn" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span className="vblock-play-cap">{t("trigger")} · 0:60</span>
          </button>

          <div className="vblock-scrub" aria-hidden="true">
            <span className="vblock-scrub-ic">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span className="vblock-scrub-t">0:00</span>
            <span className="vblock-scrub-track"><i className="vblock-scrub-fill" /></span>
            <span className="vblock-scrub-t">0:60</span>
            <span className="vblock-wave">
              {[6, 12, 8, 16, 10, 14, 7].map((h, i) => (
                <i key={i} style={{ height: `${h}px` }} />
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* ── Feature strip ── */}
      <div className="wrap">
        <ul className="vblock-feats">
          {feats.map((f, i) => (
            <li className="vblock-feat" key={i}>
              <span className="vblock-feat-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill={i === 0 || i === 2 ? "currentColor" : "none"} stroke={i === 1 ? "currentColor" : "none"} strokeWidth="1.6">
                  {FEAT_ICONS[i]}
                </svg>
              </span>
              <div>
                <p className="vblock-feat-t">{f.t}<br />{f.s}</p>
                <p className="vblock-feat-d">{f.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Full-screen theater ── */}
      <div className={`vblock-stage${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <div className="vblock-scrim" onClick={closeTheater} />
        {/* Wrapper so the CTA can sit over the video on desktop but below it on
            phones, where overlaying it collides with the burned-in subtitles. */}
        <div className="vblock-box">
        <div ref={frameRef} className="vblock-theater">
          <button type="button" className="vblock-close" onClick={closeTheater} aria-label={t("close")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <span className="vblock-tag theater" aria-hidden="true">
            <i className="vblock-rec" /> SHOWREEL · 0:60 · {badge}
          </span>
          <video
            ref={videoRef}
            src={`/videos/vsl-${lang}.mp4`}
            poster={`/videos/vsl-${lang}-poster.webp`}
            preload="none"
            playsInline
            controls={open}
            onEnded={closeTheater}
          />
        </div>
        {showCta ? (
          <a className="vblock-cta" href="#lead" onClick={closeTheater}>
            {t("book")} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
        </div>
      </div>
    </section>
  );
}
