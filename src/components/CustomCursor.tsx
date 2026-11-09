"use client";
import { useEffect, useRef } from "react";

/**
 * "Star" cursor for mouse users, matching the galaxy in the hero: a small bright
 * core with a soft warm halo that leaves a short trail of fading stardust. Over
 * anything clickable the core opens into a glowing ring. Text fields keep the
 * normal text cursor. Touch devices and reduced-motion users keep the system cursor.
 */
export function CustomCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = ref.current;
    if (!fine || reduce || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    document.documentElement.classList.add("has-cc");

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    type Dust = { x: number; y: number; vx: number; vy: number; life: number; r: number; warm: boolean };
    const dust: Dust[] = [];
    let x = -100, y = -100, cx = -100, cy = -100, shown = false, hot = 0, hotT = 0, down = 0, downT = 0, raf = 0, lastX = 0, lastY = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; cx = lastX = x; cy = lastY = y; }
      const el = e.target as Element;
      const text = !!el?.closest?.("input:not([type=checkbox]):not([type=radio]):not([type=submit]),textarea,select,[contenteditable=true]");
      canvas.style.opacity = text ? "0" : "1";
      hotT = !text && el?.closest?.("a,button,[role=tab],label,summary") ? 1 : 0;
      // drop stardust along the path, more when moving fast
      const dist = Math.hypot(x - lastX, y - lastY);
      const n = Math.min(4, Math.floor(dist / 9));
      for (let i = 0; i < n; i++) {
        const k = i / Math.max(n, 1);
        dust.push({
          x: lastX + (x - lastX) * k + (Math.random() - 0.5) * 4, y: lastY + (y - lastY) * k + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 + 0.08,
          life: 1, r: Math.random() * 1.3 + 0.5, warm: Math.random() < 0.6,
        });
      }
      if (dust.length > 140) dust.splice(0, dust.length - 140);
      lastX = x; lastY = y;
      wake();
    };
    const onDown = () => { downT = 1; wake(); };
    const onUp = () => { downT = 0; wake(); };
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget) { shown = false; } };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      cx += (x - cx) * 0.32; cy += (y - cy) * 0.32;
      hot += (hotT - hot) * 0.16; down += (downT - down) * 0.3;

      ctx.globalCompositeOperation = "lighter";
      for (let i = dust.length - 1; i >= 0; i--) {
        const d = dust[i];
        d.x += d.vx; d.y += d.vy; d.life -= 0.022;
        if (d.life <= 0) { dust.splice(i, 1); continue; }
        const a = d.life * 0.85;
        ctx.fillStyle = d.warm ? `rgba(255,196,140,${a})` : `rgba(225,232,255,${a})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r * d.life + 0.2, 0, 6.283); ctx.fill();
      }

      if (shown) {
        // halo
        const haloR = 22 + hot * 18;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
        g.addColorStop(0, `rgba(255,214,170,${0.32 + hot * 0.1})`);
        g.addColorStop(0.4, `rgba(232,168,104,${0.12 + hot * 0.06})`);
        g.addColorStop(1, "rgba(232,168,104,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, haloR, 0, 6.283); ctx.fill();
        // ring over clickable things
        if (hot > 0.02) {
          ctx.strokeStyle = `rgba(255,236,214,${0.75 * hot})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(cx, cy, (6 + hot * 14) * (1 - down * 0.18), 0, 6.283); ctx.stroke();
        }
        // core
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#fff8ee";
        ctx.beginPath(); ctx.arc(x, y, (3.2 - hot * 1.4) * (1 - down * 0.3), 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      // sleep when nothing moves: no frames at all while the mouse rests
      const settled = !dust.length && Math.abs(x - cx) < 0.3 && Math.abs(y - cy) < 0.3 && Math.abs(hotT - hot) < 0.01 && Math.abs(downT - down) < 0.01;
      raf = settled ? 0 : requestAnimationFrame(loop);
    };
    function wake() { if (!raf) raf = requestAnimationFrame(loop); }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("resize", resize);
    wake();
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cc");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="cc-canvas" aria-hidden="true" />;
}
