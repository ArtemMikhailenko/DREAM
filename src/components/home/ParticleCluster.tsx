"use client";
import { useEffect, useRef } from "react";

/**
 * A dense glowing cluster of particles for the About visual. The particles hover
 * around their home spots; the pointer pushes them apart like a hand through
 * dust, and a click or tap sends them flying out before they drift back.
 * Runs only while it is on screen; one static frame for reduced motion.
 */
export function ParticleCluster() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = false, t = 0, last = performance.now();
    let mx = -9999, my = -9999;
    type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; warm: number; ph: number };
    let ps: P[] = [];

    const sprite = (rgb: string) => {
      const c = document.createElement("canvas"); c.width = c.height = 24;
      const g = c.getContext("2d")!;
      const gr = g.createRadialGradient(12, 12, 0, 12, 12, 12);
      gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.25, `rgba(${rgb},.55)`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.fillRect(0, 0, 24, 24);
      return c;
    };
    const sWarm = sprite("255,196,140"), sHot = sprite("255,236,214"), sCool = sprite("170,190,255");

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = w < 500 ? 700 : 1300;
      const R = Math.min(w, h) * 0.34;
      ps = Array.from({ length: n }, () => {
        // gaussian-ish radius: very dense core, soft halo
        const rr = Math.pow(Math.random(), 1.9) * R;
        const a = Math.random() * Math.PI * 2;
        const hx = w / 2 + Math.cos(a) * rr * 1.15, hy = h / 2 + Math.sin(a) * rr * 0.9;
        return { hx, hy, x: hx, y: hy, vx: 0, vy: 0, r: Math.random() * 2.2 + 0.8, warm: rr / R, ph: Math.random() * 6.28 };
      });
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of ps) {
        const ox = Math.cos(t * 0.8 + p.ph) * 3, oy = Math.sin(t * 0.7 + p.ph) * 3;
        let fx = (p.hx + ox - p.x) * 0.035, fy = (p.hy + oy - p.y) * 0.035;
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) { const d = Math.sqrt(d2) || 1, f = (1 - d / 120) * 4.2; fx += (dx / d) * f; fy += (dy / d) * f; }
        p.vx = (p.vx + fx) * 0.86; p.vy = (p.vy + fy) * 0.86;
        p.x += p.vx * dt * 60; p.y += p.vy * dt * 60;
        const s = p.warm < 0.25 ? sHot : p.warm < 0.75 ? sWarm : sCool;
        const size = p.r * 4;
        ctx.globalAlpha = p.warm < 0.25 ? 0.75 : 0.5;
        ctx.drawImage(s, p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      draw(dt);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };
    const pos = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const leave = () => { mx = my = -9999; };
    const burst = (e: PointerEvent) => {
      pos(e);
      for (const p of ps) {
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy) || 1;
        const k = 26 * Math.max(0.15, 1 - d / Math.max(w, h));
        p.vx += (dx / d) * k; p.vy += (dy / d) * k;
      }
    };
    build(); draw(0);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting; cancelAnimationFrame(raf);
      if (visible && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { build(); draw(0); });
    ro.observe(canvas);
    canvas.addEventListener("pointermove", pos);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointerdown", burst);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      canvas.removeEventListener("pointermove", pos); canvas.removeEventListener("pointerleave", leave); canvas.removeEventListener("pointerdown", burst);
    };
  }, []);

  return <canvas ref={ref} className="pc-canvas" aria-hidden="true" />;
}
