"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { QuoteForm } from "@/components/QuoteForm";
import type { HomeCopy } from "@/lib/home-copy";
import "./lead-window.css";

/**
 * The one lead window for the whole site, mounted once in the layout. Any
 * button asks for it with "dc:open-lead" (on every page, service landings
 * included). It is rendered straight into <body>, so no transformed or pinned
 * section can trap it, and on phones the page behind is frozen in place (iOS
 * ignores overflow:hidden on body) and restored to the same spot on close.
 * Inside is the regular lead form, so tracking is the same everywhere.
 *
 * Events: "dc:lead-prompted" the first time it opens in a visit (the chat
 * button waits for it), "dc:lead-closed" every time it closes.
 */
export function LeadWindow({ copy }: { copy: HomeCopy }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const prompted = useRef(false);

  useEffect(() => {
    setMounted(true);
    const onOpen = () => {
      lastFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
      if (!prompted.current) { prompted.current = true; window.dispatchEvent(new Event("dc:lead-prompted")); }
    };
    window.addEventListener("dc:open-lead", onOpen);
    return () => window.removeEventListener("dc:open-lead", onOpen);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.({ preventScroll: true });
    window.dispatchEvent(new Event("dc:lead-closed"));
  }, []);

  useEffect(() => {
    if (!open) return;
    const body = document.body, y = window.scrollY;
    const prev = { position: body.style.position, top: body.style.top, left: body.style.left, right: body.style.right, overflow: body.style.overflow };
    Object.assign(body.style, { position: "fixed", top: `-${y}px`, left: "0", right: "0", overflow: "hidden" });
    body.classList.add("lead-open");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    // focus the first field only with a mouse/keyboard; on touch it would pop the keyboard over the form
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const t = fine ? window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input,select,textarea")?.focus({ preventScroll: true }), 420) : 0;
    return () => {
      window.clearTimeout(t);
      Object.assign(body.style, prev);
      body.classList.remove("lead-open");
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!mounted) return null;
  return createPortal(
    <div className={`pp-lead${open ? " in" : ""}`} aria-hidden={!open}>
      <div className="pp-scrim" onClick={close} />
      <div ref={dialogRef} className="pp-dialog" role="dialog" aria-modal="true" aria-labelledby="lw-title">
        <button type="button" className="pp-x" onClick={close} aria-label={copy.close} tabIndex={open ? 0 : -1}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <div className="pp-dialog-intro">
          <span className="pp-chip">{copy.popLeadEyebrow}</span>
          <p className="pp-dialog-title" id="lw-title">{copy.popLeadTitle}</p>
          <p className="pp-dialog-text">{copy.popLeadText}</p>
        </div>
        {open && <QuoteForm />}
      </div>
    </div>,
    document.body,
  );
}
