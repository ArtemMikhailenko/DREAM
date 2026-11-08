"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const WORDS: Record<string, string[]> = {
  en: ["video", "automation", "branding", "clients", "growth", "studio"],
  ru: ["видео", "автоматизация", "брендинг", "клиенты", "рост", "студия"],
  he: ["וידאו", "אוטומציה", "מיתוג", "לקוחות", "צמיחה", "סטודיו"],
};

/**
 * Logo with two hover moments that take turns: a growth chart that draws itself,
 * or the word after the wordmark rolling through what the studio does and landing
 * back on "studio".
 */
export function NavLogo({ onClick }: { onClick?: () => void }) {
  const locale = useLocale();
  const words = WORDS[locale] ?? WORDS.en;
  const last = words.length - 1;
  const [idx, setIdx] = useState(last);
  const [mode, setMode] = useState<"chart" | "words" | null>(null);
  const turn = useRef(0);
  const timers = useRef<number[]>([]);
  const slotRef = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<number | undefined>(undefined);

  // size the slot to the visible word so the logo never jumps
  useEffect(() => {
    const el = slotRef.current?.querySelectorAll<HTMLElement>(".nl-word")[idx];
    if (el) setW(el.offsetWidth);
  }, [idx, locale]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const enter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const next = turn.current++ % 2 === 0 ? "chart" : "words";
    setMode(next);
    if (next === "words") {
      words.forEach((_, i) => timers.current.push(window.setTimeout(() => setIdx(i), 60 + i * 300)));
    }
  };
  const leave = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setMode(null);
    setIdx(last);
  };

  return (
    <Link
      href="/"
      className={`nav-logo${mode ? ` nl-${mode}` : ""}`}
      onClick={onClick}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      dir="ltr"
    >
      <span className="nav-logo-word">DC.PRODUCTION</span>
      <span className="nav-logo-chart" aria-hidden="true">
        <svg viewBox="0 0 28 18">
          <rect x="1" y="11" width="4" height="6" rx="1" />
          <rect x="8" y="8" width="4" height="9" rx="1" />
          <rect x="15" y="5" width="4" height="12" rx="1" />
          <rect x="22" y="1" width="4" height="16" rx="1" />
          <polyline points="2,9 10,6 17,4 26,0" />
        </svg>
      </span>
      <span className="nl-slot" ref={slotRef} style={{ width: w }} dir={locale === "he" ? "rtl" : "ltr"}>
        <span className="nl-track" style={{ transform: `translateY(${-idx * 1.3}em)` }}>
          {words.map((word, i) => (
            <span key={word} className="nl-word" aria-hidden={i !== last}>{word}</span>
          ))}
        </span>
      </span>
    </Link>
  );
}
