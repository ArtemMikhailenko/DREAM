"use client";
import { useEffect } from "react";

export function CursorFX() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const glow = document.getElementById("c-glow");
    if (!glow) return;

    const onMove = (e: MouseEvent) => {
      glow.style.background = `radial-gradient(circle 540px at ${e.clientX}px ${e.clientY}px,rgba(244,241,234,.07) 0%,transparent 68%)`;
    };

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return <div id="c-glow" aria-hidden="true" />;
}
