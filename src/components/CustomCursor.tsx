"use client";
import { useEffect, useRef } from "react";

/**
 * Studio cursor for mouse users: one soft white disc that inverts what's under it
 * and swells over anything clickable, a slim caret over text fields, and a faint
 * warm light trailing behind. Touch devices and reduced-motion users keep the
 * system cursor.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const d = dot.current!, r = ring.current!;
    document.documentElement.classList.add("has-cc");
    let x = innerWidth / 2, y = innerHeight / 2, dx = x, dy = y, rx = x, ry = y, raf = 0, shown = false;

    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; dx = rx = x; dy = ry = y; d.style.opacity = r.style.opacity = "1"; }
      const el = e.target as Element;
      const text = !!el?.closest?.("input:not([type=checkbox]):not([type=radio]):not([type=submit]),textarea,[contenteditable=true]");
      const hot = !text && !!el?.closest?.("a,button,[role=tab],select,label,summary");
      d.classList.toggle("is-text", text);
      r.classList.toggle("is-hot", hot);
      d.classList.toggle("is-hot", hot);
    };
    const onDown = () => { r.classList.add("is-down"); d.classList.add("is-down"); };
    const onUp = () => { r.classList.remove("is-down"); d.classList.remove("is-down"); };
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget) { shown = false; d.style.opacity = r.style.opacity = "0"; } };
    const loop = () => {
      dx += (x - dx) * 0.38; dy += (y - dy) * 0.38;
      rx += (x - rx) * 0.1; ry += (y - ry) * 0.1;
      d.style.transform = `translate(${dx}px, ${dy}px)`;
      r.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerout", onOut);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cc");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cc-ring" aria-hidden="true" />
      <div ref={dot} className="cc-dot" aria-hidden="true" />
    </>
  );
}
