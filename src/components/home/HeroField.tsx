"use client";
import { useEffect, useRef } from "react";

/**
 * Hero backdrop: a tunnel of dotted wave rings plus a swarm of sparks. Both lean
 * toward the cursor (the swarm follows it, the tunnel's centre drifts after it)
 * with a soft warm glow under the pointer. Also writes --mx/--my (-1..1) on the
 * hero so the viewfinder frame can tilt and stretch toward the cursor.
 */
export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const hero = canvas.parentElement as HTMLElement;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, t = 0;
    // pointer target (tx,ty) and eased position (px,py), in px
    let tx = -1, ty = -1, px = -1, py = -1, inside = false;
    const sparks = Array.from({ length: 90 }, () => {
      const x = Math.random(), y = Math.random();
      return { hx: x, hy: y, x, y, vx: 0, vy: 0, r: Math.random() * 1.5 + 0.4, a: Math.random() * 0.5 + 0.2, amber: Math.random() < 0.22, ph: Math.random() * 6.28, k: Math.random() * 0.6 + 0.4 };
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (px < 0) { px = tx = w / 2; py = ty = h * 0.55; }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      px += (tx - px) * 0.06; py += (ty - py) * 0.06;
      const nx = px / Math.max(w, 1) - 0.5, ny = py / Math.max(h, 1) - 0.55;
      hero.style.setProperty("--mx", (nx * 2).toFixed(3));
      hero.style.setProperty("--my", (ny * 2).toFixed(3));

      // warm glow under the pointer
      const g = ctx.createRadialGradient(px, py, 0, px, py, Math.max(w, h) * 0.32);
      g.addColorStop(0, `rgba(232,168,104,${inside ? 0.11 : 0.05})`);
      g.addColorStop(1, "rgba(232,168,104,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5 + nx * w * 0.16, cy = h * 0.56 + ny * h * 0.16;
      const lines = w < 700 ? 26 : 38;
      const step = w < 700 ? 9 : 7;
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
          // inner rings follow the pointer more than outer ones -> the tunnel bends toward it
          const lean = (1 - k) * 0.9;
          const x = cx + (px - cx) * lean * 0.25 + Math.cos(a + t * 0.04 * (1 - k)) * r * 1.18;
          const y = cy + (py - cy) * lean * 0.25 + Math.sin(a + t * 0.04 * (1 - k)) * r * 0.62;
          if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
          ctx.fillRect(x, y, 1.1, 1.1);
        }
      }

      // sparks: orbit their home spot, and get pulled after the cursor when it's near
      for (const s of sparks) {
        const hx = s.hx * w + Math.cos(t * 0.5 * s.k + s.ph) * 14;
        const hy = s.hy * h + Math.sin(t * 0.4 * s.k + s.ph) * 10;
        let fx = (hx - s.x * w) * 0.012, fy = (hy - s.y * h) * 0.012;
        if (inside) {
          const dx = px - s.x * w, dy = py - s.y * h, d = Math.hypot(dx, dy);
          if (d < 260) { const pull = (1 - d / 260) * 0.09 * s.k; fx += dx * pull * 0.12; fy += dy * pull * 0.12; }
        }
        s.vx = (s.vx + fx) * 0.86; s.vy = (s.vy + fy) * 0.86;
        s.x += s.vx / w; s.y += s.vy / h;
        const near = inside ? Math.max(0, 1 - Math.hypot(px - s.x * w, py - s.y * h) / 220) : 0;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r * (1 + near * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = s.amber ? `rgba(232,168,104,${Math.min(1, s.a + near * 0.5)})` : `rgba(244,241,234,${Math.min(1, s.a * 0.7 + near * 0.4)})`;
        ctx.fill();
      }
    };

    const loop = () => {
      t += 0.012;
      draw();
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      inside = ty >= 0 && ty <= r.height;
    };
    const onLeave = () => { inside = false; tx = w / 2; ty = h * 0.55; };

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
    if (!reduce) { hero.addEventListener("pointermove", onMove); hero.addEventListener("pointerleave", onLeave); }
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", onResize);
      hero.removeEventListener("pointermove", onMove); hero.removeEventListener("pointerleave", onLeave);
    };
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
