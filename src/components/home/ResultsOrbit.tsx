"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * A 3D band of ad-result screenshots that winds around the numbers block, like
 * a ring around a planet: it turns as you scroll (plus a slow drift of its own),
 * tilts and waves. The band is drawn twice from the same maths — the far half
 * behind the numbers, the near half in front — so it really wraps around them.
 * Phones and reduced motion get a simple swipe strip under the numbers.
 */
export function ResultsOrbit({ items, children }: { items: { src: string; alt: string }[]; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current, rb = back.current, rf = front.current;
    if (!el || !rb || !rf) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 700px)").matches) { el.classList.add("ro-static"); return; }
    const cb = Array.from(rb.children) as HTMLElement[];
    const cf = Array.from(rf.children) as HTMLElement[];
    const n = cb.length;
    let raf = 0, visible = false, last = performance.now(), drift = 0, target = 0, cur = 0, lastSpin = NaN;

    // Cards sit on the ring once (re-placed only on resize). Each frame only the two
    // bands turn, and the browser decides which face shows (backface-visibility):
    // a near card is drawn in front of the numbers, the same card seen from behind
    // is drawn on the far layer, turned round so it never reads mirrored.
    const place = () => {
      const w = el.clientWidth;
      const R = Math.max(380, Math.min(w * 0.44, 660));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 360;
        const tr = `rotateY(${a}deg) translateZ(${R}px)`;
        cf[i].style.transform = tr;
        cb[i].style.transform = `${tr} rotateY(180deg)`;
      }
    };
    const layout = (p: number) => {
      const spin = -p * 200 + drift;
      if (Math.abs(spin - lastSpin) < 0.02) return;
      lastSpin = spin;
      const ring = `rotateX(20deg) rotateZ(-5deg) rotateY(${spin.toFixed(2)}deg)`;
      rb.style.transform = ring; rf.style.transform = ring;
    };
    const measure = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      target = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      drift += dt * 6;
      cur += (target - cur) * 0.08;
      layout(cur);
      if (visible) raf = requestAnimationFrame(loop);
    };
    place(); measure(); cur = target; layout(cur);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    io.observe(el);
    window.addEventListener("scroll", measure, { passive: true });
    const onResize = () => { place(); measure(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("scroll", measure); window.removeEventListener("resize", onResize); };
  }, [items.length]);

  const cards = (key: string) => items.map((it, i) => (
    <figure className="ro-card" key={`${key}${i}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={it.src} alt="" loading="lazy" decoding="async" />
    </figure>
  ));

  return (
    <div className="ro" ref={root}>
      <div className="ro-stage ro-back" aria-hidden="true"><div className="ro-band" ref={back}>{cards("b")}</div></div>
      <div className="ro-content">{children}</div>
      <div className="ro-stage ro-front" aria-hidden="true"><div className="ro-band" ref={front}>{cards("f")}</div></div>
      <div className="ro-strip" aria-hidden="true">{cards("s")}</div>
    </div>
  );
}
