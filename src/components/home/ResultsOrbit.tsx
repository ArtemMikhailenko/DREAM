"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Ad-result screenshots orbiting around the numbers block: an elliptical path
 * where the cards in front pass below the content and the cards behind pass
 * above it, smaller and dimmer. Placeholder images until the real campaign
 * screenshots arrive. Static ring for reduced motion.
 */
export function ResultsOrbit({ items, children }: { items: { src: string; alt: string }[]; children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = items.length;
    let raf = 0, t = 0, last = performance.now(), visible = false, speed = 1, target = 1;

    const place = () => {
      const w = el.clientWidth, h = el.clientHeight;
      const small = w < 700;
      const rx = w * (small ? 0.5 : 0.5), ry = h * (small ? 0.44 : 0.42);
      cards.current.forEach((c, i) => {
        if (!c) return;
        const a = t * 0.16 + (i / n) * Math.PI * 2;
        const s = Math.sin(a);               // +1 = in front (bottom), -1 = behind (top)
        const x = Math.cos(a) * rx, y = s * ry;
        const depth = (s + 1) / 2;
        const scale = 0.62 + depth * 0.5;
        c.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(3)}) rotate(${(Math.cos(a) * -6).toFixed(2)}deg)`;
        // only the cards passing under the content come in front; the rest stay behind it, dimmed
        const front = s > 0.45;
        c.style.opacity = (front ? 0.45 + depth * 0.55 : 0.18 + depth * 0.32).toFixed(3);
        c.style.zIndex = front ? "3" : "1";
        c.style.filter = front ? "none" : `blur(${((1 - depth) * 1.8 + 0.4).toFixed(2)}px)`;
      });
    };
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      speed += (target - speed) * 0.05;
      t += dt * speed;
      place();
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };
    place();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    io.observe(el);
    const slow = () => { target = 0.25; };
    const fast = () => { target = 1; };
    el.addEventListener("pointerenter", slow);
    el.addEventListener("pointerleave", fast);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", place);
      el.removeEventListener("pointerenter", slow); el.removeEventListener("pointerleave", fast);
    };
  }, [items.length]);

  return (
    <div className="ro" ref={stage}>
      <div className="ro-ring" aria-hidden="true">
        {items.map((it, i) => (
          <div className="ro-card" key={i} ref={(n) => { cards.current[i] = n; }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.src} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
      <div className="ro-content">{children}</div>
    </div>
  );
}
