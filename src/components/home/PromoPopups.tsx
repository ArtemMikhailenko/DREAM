"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { QuoteForm } from "@/components/QuoteForm";
import type { HomeCopy } from "@/lib/home-copy";

const SEEN_KEY = "dc_popups_v1";
const VIDEO_AT = 3000;
const LEAD_AT = 6000;

function seen() {
  try { return sessionStorage.getItem(SEEN_KEY) === "1"; } catch { return false; }
}
function markSeen() {
  try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* storage blocked: show once per load */ }
}

/** True while the visitor is already looking at the lead form or watching the film. */
function busy() {
  const lead = document.getElementById("lead");
  if (lead) {
    const r = lead.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.8 && r.bottom > 0) return true;
  }
  return !!document.querySelector(".vblock-stage.is-open");
}

/**
 * Two timed prompts, once per session: at 3s a small card offering the showreel,
 * at 6s a consultation window with the regular lead form (same component, same
 * tracking). Neither interrupts someone who is already watching or filling the form.
 */
export function PromoPopups({ copy, poster }: { copy: HomeCopy; poster: string }) {
  const [video, setVideo] = useState(false);
  const [lead, setLead] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (seen()) return;
    markSeen();
    const timers: number[] = [];
    const start = () => {
    timers.push(window.setTimeout(() => { if (!busy()) setVideo(true); }, VIDEO_AT));
    const tryLead = () => {
      if (document.querySelector(".pp-lead.in")) return;
      if (busy()) { timers.push(window.setTimeout(tryLead, 4000)); return; }
      setVideo(false);
      lastFocus.current = document.activeElement as HTMLElement;
      setLead(true);
    };
    timers.push(window.setTimeout(tryLead, LEAD_AT));
    };
    // the clock starts once the entry animation has handed over to the page
    if ((window as unknown as { __dcIntroDone?: boolean }).__dcIntroDone) start();
    else window.addEventListener("dc:intro-done", start, { once: true });
    return () => { window.removeEventListener("dc:intro-done", start); timers.forEach((t) => window.clearTimeout(t)); };
  }, []);

  // any "free audit" button on the page opens the same window right away
  useEffect(() => {
    const open = () => {
      markSeen();
      setVideo(false);
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

  const playFilm = () => {
    setVideo(false);
    window.dispatchEvent(new CustomEvent("dc:open-reel"));
  };

  return (
    <>
      <aside className={`pp-video${video ? " in" : ""}`} aria-hidden={!video} aria-label={copy.popVideoTitle}>
        <button type="button" className="pp-x" onClick={() => setVideo(false)} aria-label={copy.close} tabIndex={video ? 0 : -1}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <button type="button" className="pp-video-thumb" onClick={playFilm} tabIndex={video ? 0 : -1} aria-label={copy.popVideoBtn}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt="" />
          <span className="pp-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
        </button>
        <div className="pp-video-body">
          <span className="pp-eyebrow"><i className="pp-rec" aria-hidden="true" />{copy.popVideoEyebrow}</span>
          <p className="pp-video-title">{copy.popVideoTitle}</p>
          <button type="button" className="pp-link" onClick={playFilm} tabIndex={video ? 0 : -1}>
            {copy.popVideoBtn} <span aria-hidden="true">→</span>
          </button>
        </div>
      </aside>

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
    </>
  );
}
