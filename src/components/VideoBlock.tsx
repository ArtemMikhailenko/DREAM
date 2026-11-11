"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { homeCopy } from "@/lib/home-copy";

// thin line icons, one stroke weight: common mistakes, ads alone, guarantee
const FEAT_ICONS = [
  <>
    <path key="a" d="M12 3.5 21.5 20h-19z" />
    <path key="b" d="M12 10v4.5M12 17.2v.3" />
  </>,
  <>
    <path key="a" d="M4 10v4h3l6 4V6L7 10z" />
    <path key="b" d="M16.5 9.5a3.5 3.5 0 0 1 0 5M19 7a7 7 0 0 1 0 10" />
  </>,
  <>
    <path key="a" d="M12 3 19.5 6v5.5c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V6z" />
    <path key="b" d="m8.8 12.2 2.3 2.3 4.3-4.6" />
  </>,
];

export function VideoBlock() {
  const t = useTranslations("Showreel");
  const locale = useLocale();
  // Each locale has its own cut; anything else falls back to the English one.
  const lang = locale === "ru" ? "ru" : locale === "he" || locale === "ar" ? "he" : "en";
  const badge = lang === "ru" ? "RU" : lang === "he" ? "HE" : "EN";

  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [showCta, setShowCta] = useState(false);

  // the three points under the film: copy kept with the rest of the new home text
  const feats = homeCopy(locale).feats;
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

  // The home page's showreel prompt opens the film from anywhere on the page.
  useEffect(() => {
    const onOpen = () => openTheater();
    window.addEventListener("dc:open-reel", onOpen);
    return () => window.removeEventListener("dc:open-reel", onOpen);
  }, [openTheater]);

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
            <a className="btn-p vblock-book cta-pulse" href="#lead" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("dc:open-lead")); }}>
              {t("book")}
            </a>
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
              <span className="vblock-feat-bar" aria-hidden="true" />
              <span className="vblock-feat-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
          <a className="vblock-cta" href="#lead" onClick={(e) => { e.preventDefault(); closeTheater(); window.setTimeout(() => window.dispatchEvent(new CustomEvent("dc:open-lead")), 450); }}>
            {t("book")}
          </a>
        ) : null}
        </div>
      </div>
    </section>
  );
}
