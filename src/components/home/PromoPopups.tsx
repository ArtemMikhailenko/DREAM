"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { QuoteForm } from "@/components/QuoteForm";
import type { HomeCopy } from "@/lib/home-copy";

const VIDEO_AT = 3000;
const LEAD_AT = 5000;

/** True while the visitor is already at the lead form or watching the film. */
function busy() {
  const lead = document.getElementById("lead");
  if (lead) {
    const r = lead.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.8 && r.bottom > 0) return true;
  }
  return !!document.querySelector(".vblock-stage.is-open");
}

/**
 * Timed prompts on each visit to the home page: at 3s a small card offering the
 * showreel, at 5s the free-audit window with the regular lead form (the same
 * component, so the same tracking as the form at the bottom). Once the window
 * has shown, "dc:lead-prompted" fires so the chat button can appear. Any "free
 * audit" button also opens the window ("dc:open-lead").
 */
export function PromoPopups({ copy, poster }: { copy: HomeCopy; poster: string }) {
  const [video, setVideo] = useState(false);
  const [lead, setLead] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const videoClosed = useRef(false);
  const leadShown = useRef(false);

  const openLead = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement;
    setVideo(false);
    setLead(true);
    if (!leadShown.current) {
      leadShown.current = true;
      window.dispatchEvent(new Event("dc:lead-prompted"));
    }
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => { if (!busy() && !videoClosed.current) setVideo(true); }, VIDEO_AT));
    const tryLead = () => {
      if (leadShown.current) return;
      if (busy()) { timers.push(window.setTimeout(tryLead, 4000)); return; }
      openLead();
    };
    timers.push(window.setTimeout(tryLead, LEAD_AT));
    const onOpen = () => openLead();
    window.addEventListener("dc:open-lead", onOpen);
    return () => { timers.forEach((t) => window.clearTimeout(t)); window.removeEventListener("dc:open-lead", onOpen); };
  }, [openLead]);

  const closeLead = useCallback(() => {
    setLead(false);
    lastFocus.current?.focus?.();
    // the film card comes back after the window, unless the visitor closed it
    if (!videoClosed.current) window.setTimeout(() => { if (!busy()) setVideo(true); }, 900);
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
    videoClosed.current = true;
    setVideo(false);
    window.dispatchEvent(new CustomEvent("dc:open-reel"));
  };
  const closeVideo = () => { videoClosed.current = true; setVideo(false); };

  return (
    <>
      <aside className={`pp-video${video ? " in" : ""}`} aria-hidden={!video} aria-label={copy.popVideoTitle}>
        <button type="button" className="pp-x" onClick={closeVideo} aria-label={copy.close} tabIndex={video ? 0 : -1}>
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
          <button type="button" className="pp-btn glass-btn cta-pulse" onClick={playFilm} tabIndex={video ? 0 : -1}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>{copy.popVideoBtn}
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
