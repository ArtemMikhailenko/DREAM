"use client";
import { useEffect } from "react";

/**
 * Sections stack like pages: each one scrolls normally until its bottom reaches
 * the bottom of the screen, then it holds still while the next section rises
 * over it (rounded top edge, shadow), and the covered one dims. Only sticky
 * positioning and an overlay are used — no transforms on the sections — so the
 * film theater and other fixed layers inside keep working.
 */
export function StackSections({ ids }: { ids: string[] }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length < 2) return;
    const shades = els.map((el, i) => {
      el.classList.add("stk");
      if (i > 0) el.classList.add("stk-over");
      el.style.zIndex = String(10 + i);
      const s = document.createElement("div");
      s.className = "stk-shade";
      s.setAttribute("aria-hidden", "true");
      el.appendChild(s);
      return s;
    });

    const place = () => {
      const vh = window.innerHeight;
      els.forEach((el, i) => {
        if (i === els.length - 1) { el.style.position = "relative"; return; }
        el.style.position = "sticky";
        el.style.top = `${Math.min(0, vh - el.offsetHeight)}px`;
      });
    };
    let raf = 0;
    const shade = () => {
      raf = 0;
      const vh = window.innerHeight;
      els.forEach((el, i) => {
        const next = els[i + 1];
        if (!next) return;
        const top = next.getBoundingClientRect().top;
        const k = Math.min(1, Math.max(0, 1 - top / vh));
        shades[i].style.opacity = (k * 0.72).toFixed(3);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(shade); };
    place(); shade();
    const ro = new ResizeObserver(() => { place(); shade(); });
    els.forEach((el) => ro.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", place);
      els.forEach((el) => { el.classList.remove("stk", "stk-over"); el.style.position = ""; el.style.top = ""; el.style.zIndex = ""; });
      shades.forEach((s) => s.remove());
    };
  }, [ids]);
  return null;
}
