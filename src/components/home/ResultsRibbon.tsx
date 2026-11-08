"use client";
import { useEffect, useRef } from "react";

export type RibbonItem = { src: string; alt: string };

/**
 * Scroll-driven 3D ribbon: a twisting band of cards (ad results / screenshots)
 * that winds between two split headline words while the section is pinned.
 * Pure CSS 3D transforms driven by one scroll value; static fallback for
 * reduced motion.
 */
export function ResultsRibbon({ items, words, note }: { items: RibbonItem[]; words: [string, string]; note: string }) {
  const root = useRef<HTMLElement>(null);
  const ribbon = useRef<HTMLDivElement>(null);
  const wl = useRef<HTMLSpanElement>(null);
  const wr = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current, rb = ribbon.current;
    if (!el || !rb) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("rr-static"); return; }
    const cards = Array.from(rb.children) as HTMLElement[];
    const n = cards.length;
    let raf = 0, target = 0, cur = 0;

    const layout = (p: number) => {
      const w = window.innerWidth;
      const R = Math.min(w * 0.42, 620);             // band radius
      const spin = -p * 300 + 40;                     // whole band rotates as you scroll
      const twist = Math.sin(p * Math.PI) * 26;       // band tilts in the middle of the scroll
      rb.style.transform = `translateY(${(0.5 - p) * 18}vh) rotateX(${12 - twist * 0.4}deg) rotateZ(${-8 + twist * 0.5}deg) rotateY(${spin}deg)`;
      cards.forEach((c, i) => {
        const a = (i / n) * 360;
        const wave = Math.sin((a * Math.PI) / 180 * 2 + p * 6) * 70;
        c.style.transform = `rotateY(${a}deg) translateZ(${R}px) translateY(${wave}px)`;
        // fade the cards on the far side of the band
        const facing = Math.cos(((a + spin) * Math.PI) / 180);
        c.style.opacity = String(0.25 + Math.max(0, facing) * 0.75);
      });
      const spread = 2 + p * 12;
      if (wl.current) wl.current.style.transform = `translateX(${-spread}vw)`;
      if (wr.current) wr.current.style.transform = `translateX(${spread}vw)`;
    };

    const measure = () => {
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      target = Math.min(1, Math.max(0, -r.top / Math.max(total, 1)));
    };
    const tick = () => {
      cur += (target - cur) * 0.12;
      layout(cur);
      if (Math.abs(target - cur) > 0.0005) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    const onScroll = () => { measure(); if (!raf) raf = requestAnimationFrame(tick); };
    measure(); cur = target; layout(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return (
    <section className="rr" ref={root} aria-label={`${words[0]} ${words[1]}`}>
      <div className="rr-pin">
        <div className="rr-words" aria-hidden="true">
          <span ref={wl} className="rr-w rr-wl">{words[0]}</span>
          <span ref={wr} className="rr-w rr-wr">{words[1]}</span>
        </div>
        <p className="rr-note">{note}</p>
        <div className="rr-stage">
          <div className="rr-ribbon" ref={ribbon}>
            {items.map((it, i) => (
              <figure className="rr-card" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt={it.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
