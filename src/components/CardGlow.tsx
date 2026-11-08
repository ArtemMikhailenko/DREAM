"use client";
import { useEffect } from "react";

/**
 * Pointer light + "water" ripple for cards: writes --gx/--gy (pointer position
 * inside the card) and drops an expanding ring where the pointer enters.
 */
export function CardGlow({ selector }: { selector: string }) {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const move = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement, r = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${e.clientX - r.left}px`);
      el.style.setProperty("--gy", `${e.clientY - r.top}px`);
    };
    const enter = (e: PointerEvent) => {
      if (reduce) return;
      const el = e.currentTarget as HTMLElement, r = el.getBoundingClientRect();
      const ring = document.createElement("span");
      ring.className = "cg-ripple";
      ring.style.left = `${e.clientX - r.left}px`;
      ring.style.top = `${e.clientY - r.top}px`;
      el.appendChild(ring);
      window.setTimeout(() => ring.remove(), 1200);
    };
    els.forEach((el) => {
      el.classList.add("cg");
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
    });
    return () => els.forEach((el) => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
    });
  }, [selector]);
  return null;
}
