"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export function HeroVideo() {
  const t = useTranslations("Showreel");
  const locale = useLocale();
  // RU has its own cut; EN + HE (until the Hebrew cut ships) use the English one.
  const lang = locale === "ru" ? "ru" : "en";
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" className="hero-reel" onClick={() => setOpen(true)}>
        <span
          className="hero-reel-poster"
          style={{ backgroundImage: `url(/videos/vsl-${lang}-poster.webp)` }}
        >
          <span className="hero-reel-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
        <span className="hero-reel-cap">
          <span className="hero-reel-label">{t("trigger")}</span>
          <span className="hero-reel-sub">{t("label")} · 0:60</span>
        </span>
      </button>

      {open ? (
        <div className="reel-modal" onClick={() => setOpen(false)}>
          <div className="reel-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="reel-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <video
              ref={videoRef}
              src={`/videos/vsl-${lang}.mp4`}
              poster={`/videos/vsl-${lang}-poster.webp`}
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
