"use client";
import { useEffect, useRef, useState } from "react";

const KEY = "dc_intro_v1";
export const INTRO_EVENT = "dc:intro-done";

/**
 * Entry animation, once per session: "DC PRODUCTION" in large type holds for a
 * beat, then breaks into particles that drift up and fade, revealing the hero.
 * Skipped for reduced motion and on repeat visits in the same session.
 */
export function IntroDissolve() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try { if (sessionStorage.getItem(KEY) === "1") skip = true; sessionStorage.setItem(KEY, "1"); } catch { /* storage blocked */ }
    const done = () => { (window as unknown as { __dcIntroDone?: boolean }).__dcIntroDone = true; window.dispatchEvent(new Event(INTRO_EVENT)); };
    if (skip) { setShow(false); done(); return; }
    const html = document.documentElement;
    html.classList.add("intro-hold");

    let raf = 0, cancelled = false;
    const run = () => {
    if (cancelled) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    document.documentElement.style.overflow = "hidden";

    // lay the wordmark out off-screen and sample its pixels into particles
    const off = document.createElement("canvas");
    off.width = w; off.height = h;
    const o = off.getContext("2d")!;
    const fam = getComputedStyle(document.body).getPropertyValue("--font-hero").trim() || "Arial Black";
    const narrow = w < 700;
    const lines = narrow ? ["DC", "PRODUCTION"] : ["DC PRODUCTION"];
    let size = narrow ? w * 0.2 : w * 0.105;
    o.font = `400 ${size}px ${fam}, "Arial Black", sans-serif`;
    const widest = Math.max(...lines.map((l) => o.measureText(l).width));
    if (widest > w * 0.88) { size *= (w * 0.88) / widest; o.font = `400 ${size}px ${fam}, "Arial Black", sans-serif`; }
    o.fillStyle = "#fff"; o.textAlign = "center"; o.textBaseline = "middle";
    const lh = size * 0.95;
    lines.forEach((l, i) => o.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * lh));
    const data = o.getImageData(0, 0, w, h).data;
    const gap = narrow ? 3 : Math.max(3, Math.round(size / 42));
    type P = { x: number; y: number; vx: number; vy: number; d: number; a: number; amber: boolean };
    const ps: P[] = [];
    const left = w / 2 - widest / 2;
    for (let y = 0; y < h; y += gap) for (let x = 0; x < w; x += gap) {
      if (data[(y * w + x) * 4 + 3] > 128) {
        ps.push({ x, y, vx: 0, vy: 0, d: ((x - left) / Math.max(widest, 1)) * 0.55 + Math.random() * 0.25, a: 1, amber: Math.random() < 0.06 });
      }
    }

    const HOLD = 900, BREAK = 1500;
    const t0 = performance.now();
    let finished = false;
    const frame = (now: number) => {
      const t = now - t0;
      ctx.clearRect(0, 0, w, h);
      const prog = Math.max(0, (t - HOLD) / BREAK); // 0..1+
      for (const p of ps) {
        const local = Math.min(1, Math.max(0, (prog - p.d * 0.6) / 0.45));
        if (local > 0) {
          p.vx += (Math.random() - 0.5) * 0.5 + 0.12;
          p.vy += -0.18 - Math.random() * 0.22;
          p.x += p.vx * local; p.y += p.vy * local;
          p.a = 1 - local;
        }
        if (p.a <= 0.01) continue;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.amber && local > 0 ? "#e8a868" : "#f4f1ea";
        const s = local > 0 ? 1.6 : gap - 0.6;
        ctx.fillRect(p.x, p.y, s, s);
      }
      ctx.globalAlpha = 1;
      if (prog > 0.5 && !finished) { finished = true; setFade(true); html.classList.remove("intro-hold"); }
      if (prog < 1.4) raf = requestAnimationFrame(frame);
      else end();
    };
    const end = () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
      html.classList.remove("intro-hold");
      setShow(false);
      done();
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("keydown", end, { once: true });
    };
    // wait for the display face so the particles take the real letter shapes
    const fontReady = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fontReady, new Promise((r) => setTimeout(r, 700))]).then(run);
    return () => { cancelled = true; cancelAnimationFrame(raf); html.classList.remove("intro-hold"); document.documentElement.style.overflow = ""; };
  }, []);

  if (!show) return null;
  return (
    <div className={`intro${fade ? " is-fading" : ""}`} aria-hidden="true">
      <canvas ref={ref} className="intro-canvas" />
    </div>
  );
}
