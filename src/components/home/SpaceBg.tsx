"use client";
import { useEffect, useRef } from "react";

/**
 * Light "space" backdrop for content sections: a slow star field with depth
 * (near stars drift faster), gentle twinkle and a few soft glowing motes, over a
 * dark nebula gradient set in CSS. Runs only while the section is on screen.
 */
export function SpaceBg({ tint = "warm" }: { tint?: "warm" | "cool" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = false, last = performance.now(), t = 0;
    type Star = { x: number; y: number; z: number; tw: number; warm: boolean };
    let stars: Star[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(420, Math.round((w * h) / 5200));
      stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, z: Math.random(), tw: Math.random() * 6.28, warm: Math.random() < (tint === "warm" ? 0.3 : 0.12) }));
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        s.y -= dt * (4 + s.z * 16);
        s.x += dt * (s.z - 0.5) * 3;
        if (s.y < -4) { s.y = h + 4; s.x = Math.random() * w; }
        const a = (0.18 + s.z * 0.7) * (0.6 + Math.sin(t * 1.6 + s.tw) * 0.4);
        const r = 0.5 + s.z * 1.4;
        ctx.fillStyle = s.warm ? `rgba(255,200,150,${a.toFixed(3)})` : `rgba(220,232,255,${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, 6.283); ctx.fill();
        if (s.z > 0.9) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 7);
          g.addColorStop(0, s.warm ? `rgba(255,190,130,${(a * 0.3).toFixed(3)})` : `rgba(200,220,255,${(a * 0.28).toFixed(3)})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, r * 7, 0, 6.283); ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      draw(dt);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };
    resize(); draw(0);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { resize(); draw(0); });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [tint]);

  return (
    <div className={`space-bg space-${tint}`} aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
