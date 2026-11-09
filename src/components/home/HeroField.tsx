"use client";
import { useEffect, useRef } from "react";

/**
 * Hero backdrop: deep space. Slow nebula light, a 3D star field drifting toward
 * the viewer with parallax to the pointer, and glowing dust that swirls around
 * the cursor. An occasional shooting star crosses the sky. Also writes --mx/--my
 * (-1..1) on the hero so the viewfinder frame can tilt toward the cursor.
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
    let tx = -1, ty = -1, px = -1, py = -1, inside = false;
    const small = window.innerWidth < 700;

    // stars live in a box: x,y in -1..1, z in 0..1 (0 = at the viewer)
    const STARS = small ? 260 : 560;
    const stars = Array.from({ length: STARS }, () => ({
      x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random(),
      tw: Math.random() * 6.28, warm: Math.random() < 0.18, big: Math.random() < 0.06,
    }));
    // dust: bigger soft particles that react to the cursor
    const DUST = small ? 26 : 60;
    const dust = Array.from({ length: DUST }, () => ({
      x: Math.random(), y: Math.random(), vx: 0, vy: 0,
      r: Math.random() * 1.8 + 0.8, ph: Math.random() * 6.28, sp: Math.random() * 0.5 + 0.3, warm: Math.random() < 0.5,
    }));
    let shoot: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextShoot = 4 + Math.random() * 4;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (px < 0) { px = tx = w / 2; py = ty = h * 0.5; }
    };

    const nebula = (x: number, y: number, r: number, rgb: string, a: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${rgb},${a})`);
      g.addColorStop(0.45, `rgba(${rgb},${a * 0.35})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      px += (tx - px) * 0.06; py += (ty - py) * 0.06;
      const nx = px / Math.max(w, 1) - 0.5, ny = py / Math.max(h, 1) - 0.5;
      hero.style.setProperty("--mx", (nx * 2).toFixed(3));
      hero.style.setProperty("--my", (ny * 2).toFixed(3));

      // nebula light, drifting slowly and leaning a little with the pointer
      const m = Math.max(w, h);
      ctx.globalCompositeOperation = "lighter";
      nebula(w * (0.78 + Math.sin(t * 0.05) * 0.04) - nx * 40, h * (0.72 + Math.cos(t * 0.04) * 0.04) - ny * 30, m * 0.55, "232,150,80", 0.085);
      nebula(w * (0.18 + Math.cos(t * 0.045) * 0.05) - nx * 60, h * (0.25 + Math.sin(t * 0.05) * 0.05) - ny * 40, m * 0.5, "70,120,190", 0.07);
      nebula(w * 0.55 - nx * 20, h * 0.45 - ny * 20, m * 0.35, "150,110,200", 0.03);
      // warm light under the pointer
      nebula(px, py, m * 0.22, "240,180,120", inside ? 0.07 : 0.025);

      // star field flying gently toward the viewer
      const cx = w / 2 - nx * w * 0.06, cy = h / 2 - ny * h * 0.06;
      const fov = Math.min(w, h) * 0.55;
      for (const s of stars) {
        s.z -= dt * 0.018;
        if (s.z <= 0.02) { s.z = 1; s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; }
        const k = 1 / s.z;
        const sx = cx + s.x * fov * k * 0.9 - nx * (1 - s.z) * 60;
        const sy = cy + s.y * fov * k * 0.6 - ny * (1 - s.z) * 40;
        if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;
        const near = 1 - s.z;
        const tw = 0.65 + Math.sin(t * 2.2 + s.tw) * 0.35;
        const a = Math.min(1, (0.15 + near * 0.95) * tw);
        const r = (s.big ? 1.5 : 0.7) + near * (s.big ? 2.2 : 1.3);
        ctx.fillStyle = s.warm ? `rgba(255,200,150,${a})` : `rgba(235,240,255,${a})`;
        ctx.beginPath(); ctx.arc(sx, sy, r, 0, 6.283); ctx.fill();
        if (s.big && near > 0.45) {
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 6);
          g.addColorStop(0, s.warm ? `rgba(255,190,130,${a * 0.35})` : `rgba(200,220,255,${a * 0.3})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, r * 6, 0, 6.283); ctx.fill();
        }
      }

      // dust that drifts on its own and swirls around the cursor
      for (const d of dust) {
        let fx = Math.cos(t * d.sp + d.ph) * 0.004, fy = Math.sin(t * d.sp * 0.8 + d.ph) * 0.004 - 0.0015;
        if (inside) {
          const dx = px - d.x * w, dy = py - d.y * h, dist = Math.hypot(dx, dy);
          if (dist < 280 && dist > 1) {
            const f = (1 - dist / 280);
            fx += (dx / dist) * f * 0.05 + (-dy / dist) * f * 0.09;
            fy += (dy / dist) * f * 0.05 + (dx / dist) * f * 0.09;
          }
        }
        d.vx = (d.vx + fx) * 0.92; d.vy = (d.vy + fy) * 0.92;
        d.x += d.vx / w * 6; d.y += d.vy / h * 6;
        if (d.y < -0.05) d.y = 1.05; if (d.y > 1.05) d.y = -0.05;
        if (d.x < -0.05) d.x = 1.05; if (d.x > 1.05) d.x = -0.05;
        const near = inside ? Math.max(0, 1 - Math.hypot(px - d.x * w, py - d.y * h) / 240) : 0;
        const X = d.x * w, Y = d.y * h, R = d.r * (1 + near * 1.2);
        const g = ctx.createRadialGradient(X, Y, 0, X, Y, R * 5);
        const rgb = d.warm ? "255,190,130" : "210,225,255";
        g.addColorStop(0, `rgba(${rgb},${0.55 + near * 0.4})`);
        g.addColorStop(0.25, `rgba(${rgb},${0.18 + near * 0.2})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, Y, R * 5, 0, 6.283); ctx.fill();
      }

      // an occasional shooting star
      nextShoot -= dt;
      if (!shoot && nextShoot <= 0) {
        const fromLeft = Math.random() < 0.5;
        shoot = { x: fromLeft ? w * 0.1 : w * 0.9, y: h * (0.08 + Math.random() * 0.25), vx: (fromLeft ? 1 : -1) * w * 0.55, vy: h * 0.22, life: 1 };
        nextShoot = 7 + Math.random() * 6;
      }
      if (shoot) {
        shoot.x += shoot.vx * dt; shoot.y += shoot.vy * dt; shoot.life -= dt * 0.9;
        const tailX = shoot.x - shoot.vx * 0.18, tailY = shoot.y - shoot.vy * 0.18;
        const g = ctx.createLinearGradient(shoot.x, shoot.y, tailX, tailY);
        g.addColorStop(0, `rgba(255,235,210,${Math.max(0, shoot.life) * 0.9})`);
        g.addColorStop(1, "rgba(255,235,210,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(tailX, tailY); ctx.stroke();
        if (shoot.life <= 0) shoot = null;
      }
      ctx.globalCompositeOperation = "source-over";
    };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      t += dt;
      draw(dt);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      inside = ty >= 0 && ty <= r.height;
    };
    const onLeave = () => { inside = false; tx = w / 2; ty = h * 0.5; };

    resize();
    draw(0.016);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    io.observe(canvas);
    const onResize = () => { resize(); draw(0.016); };
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
