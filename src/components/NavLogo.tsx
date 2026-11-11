"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const WORDS: Record<string, string[]> = {
  en: ["VIDEO", "ADS", "BRANDING", "AUTOMATION", "CLIENTS", "GROWTH", "STUDIO"],
  ru: ["ВИДЕО", "РЕКЛАМА", "БРЕНДИНГ", "АВТОМАТИЗАЦИЯ", "КЛИЕНТЫ", "РОСТ", "СТУДИЯ"],
  he: ["וידאו", "פרסום", "מיתוג", "אוטומציה", "לקוחות", "צמיחה", "סטודיו"],
  es: ["VÍDEO", "ANUNCIOS", "BRANDING", "AUTOMATIZACIÓN", "CLIENTES", "CRECIMIENTO", "ESTUDIO"],
  ar: ["فيديو", "إعلانات", "هوية", "أتمتة", "زبائن", "نمو", "استوديو"],
};

/**
 * Wordmark + a second word in the same face. On hover the second word spins
 * through what the studio does like a slot reel — one continuous roll that
 * eases out and lands on "studio".
 */
export function NavLogo({ onClick }: { onClick?: () => void }) {
  const locale = useLocale();
  const words = WORDS[locale] ?? WORDS.en;
  const last = words.length - 1;
  // the reel holds the list twice so it can roll a full lap before landing
  const reel = [...words, ...words];
  const home = reel.length - 1;
  const [pos, setPos] = useState(home);
  const [rolling, setRolling] = useState(false);
  const busy = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const roll = () => {
    if (busy.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    busy.current = true;
    // jump (without transition) to the first copy's "studio", then roll a lap to the second
    setRolling(false);
    setPos(last);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setRolling(true);
      setPos(home);
      timer.current = window.setTimeout(() => { busy.current = false; }, 1700);
    }));
  };

  return (
    <Link href="/" className="nav-logo" onClick={onClick} onMouseEnter={roll} onFocus={roll} dir="ltr">
      <span className="nav-logo-word">DC.PRODUCTION</span>
      <span className="nl-slot" dir={locale === "he" || locale === "ar" ? "rtl" : "ltr"}>
        <span
          className={`nl-track${rolling ? " is-rolling" : ""}`}
          style={{ transform: `translateY(${-pos}em)` }}
        >
          {reel.map((word, i) => (
            <span key={i} className="nl-word" aria-hidden={i !== home}>{word}</span>
          ))}
        </span>
      </span>
    </Link>
  );
}
