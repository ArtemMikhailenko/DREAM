"use client";
import { useEffect, useRef } from "react";

/**
 * Hero backdrop: a slow tunnel of dotted wave lines, monochrome with a few amber
 * sparks. Pure canvas, paused off-screen and drawn once for reduced motion.
 */
export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, t = 0;
    const sparks = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.3,
      s: Math.random() * 0.00025 + 0.00008, a: Math.random() * 0.5 + 0.15,
      amber: Math.random() < 0.18,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5, cy = h * 0.56;
      const lines = w < 700 ? 26 : 38;
      const step = w < 700 ? 9 : 7;
      // concentric, breathing wave rings, squashed into a tunnel
      for (let i = 0; i < lines; i++) {
        const k = i / lines;
        const base = 90 + k * Math.max(w, h) * 0.62;
        const alpha = 0.05 + (1 - k) * 0.22;
        ctx.fillStyle = `rgba(244,241,234,${alpha.toFixed(3)})`;
        const pts = Math.floor((base * 2 * Math.PI) / step);
        for (let p = 0; p < pts; p++) {
          const a = (p / pts) * Math.PI * 2;
          const wave = Math.sin(a * 3 + t * 0.6 + i * 0.32) * (14 + k * 46) + Math.cos(a * 5 - t * 0.4 + i * 0.2) * 9;
          const r = base + wave;
          const x = cx + Math.cos(a + t * 0.04 * (1 - k)) * r * 1.18;
          const y = cy + Math.sin(a + t * 0.04 * (1 - k)) * r * 0.62;
          if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
          ctx.fillRect(x, y, 1.1, 1.1);
        }
      }
      for (const s of sparks) {
        s.y -= s.s * (reduce ? 0 : 16);
        if (s.y < -0.02) { s.y = 1.02; s.x = Math.random(); }
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.amber ? `rgba(232,168,104,${s.a})` : `rgba(244,241,234,${s.a * 0.7})`;
        ctx.fill();
      }
    };

    const loop = () => {
      t += 0.012;
      draw();
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };

    resize();
    draw();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const onResize = () => { resize(); draw(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={ref} className="h2-field" aria-hidden="true" />;
}

/** Camera-style running timecode for the viewfinder frame. */
export function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const ms = performance.now() - start;
      const f = Math.floor((ms / 1000) * 25) % 25;
      const s = Math.floor(ms / 1000);
      if (ref.current) ref.current.textContent = `00:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
      raf = requestAnimationFrame(tick);
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={ref} className="h2-tc">00:00:00:00</span>;
}
