"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export function VideoBlock() {
  const t = useTranslations("Showreel");
  const locale = useLocale();
  // RU has its own cut; EN + HE (until the Hebrew cut ships) use the English one.
  const lang = locale === "ru" ? "ru" : "en";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showCta, setShowCta] = useState(false);

  function play() {
    void videoRef.current?.play();
    setPlaying(true);
  }

  // "Book a consultation" surfaces a few seconds into the film.
  useEffect(() => {
    if (!playing) {
      setShowCta(false);
      return;
    }
    const id = window.setTimeout(() => setShowCta(true), 3500);
    return () => window.clearTimeout(id);
  }, [playing]);

  return (
    <section className="section s-ink" id="showreel">
      <div className="bg-gray seam-mid pin" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <p className="label">{t("label")}</p>
        <h2 className="sec-h">
          {t("heading")} <em>{t("headingEm")}</em>
        </h2>

        <div className={`vblock${playing ? " is-playing" : ""}`}>
          <span className="vblock-corner tl" aria-hidden="true" />
          <span className="vblock-corner tr" aria-hidden="true" />
          <span className="vblock-corner bl" aria-hidden="true" />
          <span className="vblock-corner br" aria-hidden="true" />
          <span className="vblock-tag" aria-hidden="true">
            <i className="vblock-rec" /> SHOWREEL · 0:60
          </span>

          <video
            ref={videoRef}
            src={`/videos/vsl-${lang}.mp4`}
            poster={`/videos/vsl-${lang}-poster.webp`}
            preload="none"
            playsInline
            controls={playing}
            onEnded={() => setPlaying(false)}
          />

          {!playing ? (
            <button type="button" className="vblock-play" onClick={play}>
              <span className="vblock-play-btn" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="vblock-play-cap">{t("trigger")} · 0:60</span>
            </button>
          ) : null}

          {showCta ? (
            <a className="vblock-cta" href="#lead">
              {t("book")} <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
