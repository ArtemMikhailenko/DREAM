"use client";
import type { ReactNode } from "react";

/**
 * Main call to action. Opens the lead form in a window right where the visitor
 * is, instead of scrolling them down the whole page. Without JS it stays a plain
 * link to the form at the bottom (#lead).
 */
export function LeadButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      className={className}
      href="#lead"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("dc:open-lead"));
      }}
    >
      {children}
    </a>
  );
}
