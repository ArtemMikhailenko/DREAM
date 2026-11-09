"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { QuoteForm } from "@/components/QuoteForm";
import type { HomeCopy } from "@/lib/home-copy";

/**
 * The free-audit window. It never opens by itself: any "free audit" button on the
 * page opens it (event "dc:open-lead"). Inside is the regular lead form — the same
 * component, so the same tracking as the form at the bottom of the page.
 */
export function PromoPopups({ copy }: { copy: HomeCopy; poster?: string }) {
  const [lead, setLead] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const open = () => {
      lastFocus.current = document.activeElement as HTMLElement;
      setLead(true);
    };
    window.addEventListener("dc:open-lead", open);
    return () => window.removeEventListener("dc:open-lead", open);
  }, []);

  const closeLead = useCallback(() => {
    setLead(false);
    lastFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!lead) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeLead(); };
    window.addEventListener("keydown", onKey);
    window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input,select,textarea")?.focus({ preventScroll: true }), 420);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [lead, closeLead]);

  return (
    <div className={`pp-lead${lead ? " in" : ""}`} aria-hidden={!lead}>
      <div className="pp-scrim" onClick={closeLead} />
      <div ref={dialogRef} className="pp-dialog" role="dialog" aria-modal="true" aria-labelledby="pp-lead-title">
        <button type="button" className="pp-x" onClick={closeLead} aria-label={copy.close}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <div className="pp-dialog-intro">
          <span className="pp-chip">{copy.popLeadEyebrow}</span>
          <p className="pp-dialog-title" id="pp-lead-title">{copy.popLeadTitle}</p>
          <p className="pp-dialog-text">{copy.popLeadText}</p>
        </div>
        {lead && <QuoteForm />}
      </div>
    </div>
  );
}
