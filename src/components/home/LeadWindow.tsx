"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { QuoteForm } from "@/components/QuoteForm";
import type { HomeCopy } from "@/lib/home-copy";

/**
 * The free-audit window for inner pages. Opens only when a button asks for it
 * ("dc:open-lead"); inside is the regular lead form, so tracking is the same as
 * on the home page.
 */
export function LeadWindow({ copy }: { copy: HomeCopy }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = () => { lastFocus.current = document.activeElement as HTMLElement; setOpen(true); };
    window.addEventListener("dc:open-lead", onOpen);
    return () => window.removeEventListener("dc:open-lead", onOpen);
  }, []);
  const close = useCallback(() => { setOpen(false); lastFocus.current?.focus?.(); }, []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input,select,textarea")?.focus({ preventScroll: true }), 420);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, close]);

  return (
    <div className={`pp-lead${open ? " in" : ""}`} aria-hidden={!open}>
      <div className="pp-scrim" onClick={close} />
      <div ref={dialogRef} className="pp-dialog" role="dialog" aria-modal="true" aria-labelledby="lw-title">
        <button type="button" className="pp-x" onClick={close} aria-label={copy.close}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <div className="pp-dialog-intro">
          <span className="pp-chip">{copy.popLeadEyebrow}</span>
          <p className="pp-dialog-title" id="lw-title">{copy.popLeadTitle}</p>
          <p className="pp-dialog-text">{copy.popLeadText}</p>
        </div>
        {open && <QuoteForm />}
      </div>
    </div>
  );
}
