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
    let raf = 0, visible = false, last = performance.now(), drift = 0, target = 0, cur = 0;

    const layout = (p: number) => {
      const w = el.clientWidth;
      const R = Math.min(w * 0.46, 680);
      const spin = -p * 260 + drift;
      const twist = Math.sin(p * Math.PI) * 14;
      const ring = `rotateX(${24 + twist * 0.3}deg) rotateZ(${-6 + twist * 0.4}deg) rotateY(${spin}deg)`;
      rb.style.transform = ring; rf.style.transform = ring;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 360;
        const wave = Math.sin((a * Math.PI) / 90 + p * 6 + drift * 0.02) * 46;
        const tr = `rotateY(${a}deg) translateZ(${R}px) translateY(${wave.toFixed(1)}px)`;
        cb[i].style.transform = tr; cf[i].style.transform = tr;
        const facing = Math.cos(((a + spin) * Math.PI) / 180); // 1 = facing the viewer
        const near = facing > 0.05;
        cf[i].style.opacity = near ? String(Math.min(1, 0.35 + facing * 0.75)) : "0";
        cb[i].style.opacity = near ? "0" : String(0.18 + Math.max(0, -facing) * 0.22);
      }
    };
    const measure = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      target = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      drift += dt * 7;
      cur += (target - cur) * 0.08;
      layout(cur);
      if (visible) raf = requestAnimationFrame(loop);
    };
    measure(); cur = target; layout(cur);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    io.observe(el);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("scroll", measure); window.removeEventListener("resize", measure); };
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
