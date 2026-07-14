"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export function Showreel() {
  const t = useTranslations("Showreel");
  const locale = useLocale();
  // RU has its own cut; EN + HE (until the Hebrew cut ships) use the English one.
  const lang = locale === "ru" ? "ru" : "en";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    const v = videoRef.current;
    if (!v) return;
    void v.play();
    setPlaying(true);
  }

  return (
    <section className="section s-ink" id="showreel">
      <div className="bg-gray seam-mid pin" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <p className="label">{t("label")}</p>
        <h2 className="sec-h">
          {t("heading")} <em>{t("headingEm")}</em>
        </h2>
        <div className={`showreel-player${playing ? " is-playing" : ""}`}>
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
            <button type="button" className="showreel-play" onClick={play} aria-label={t("play")}>
              <span className="showreel-play-btn" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="showreel-play-label">{t("play")}</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
