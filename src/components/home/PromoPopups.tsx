"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { QuoteForm } from "@/components/QuoteForm";
import type { HomeCopy } from "@/lib/home-copy";

const VIDEO_AT = 3000;
const LEAD_AT = 5000;

/** True while the visitor is already at the lead form or watching the film
 *  (on phones also while the hero is still on screen: nothing may cover it). */
function busy() {
  if (window.innerWidth < 700 && window.scrollY < window.innerHeight * 0.75) return true;
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
  const [teaser, setTeaser] = useState(false);
  const videoClosed = useRef(false);
  const leadShown = useRef(false);

  // the window itself is the site-wide LeadWindow (in the layout)
  const openLead = useCallback(() => {
    leadShown.current = true;
    window.dispatchEvent(new CustomEvent("dc:open-lead"));
  }, []);

  useEffect(() => {
    // the film card stays (or comes back) after the window, unless the visitor closed it
    const onClosed = () => { if (!videoClosed.current) window.setTimeout(() => { if (!busy()) setVideo(true); }, 400); };
    const onOpened = () => { leadShown.current = true; setTeaser(false); };
    window.addEventListener("dc:lead-closed", onClosed);
    window.addEventListener("dc:lead-prompted", onOpened);
    return () => { window.removeEventListener("dc:lead-closed", onClosed); window.removeEventListener("dc:lead-prompted", onOpened); };
  }, []);

  useEffect(() => {
    // only on the first page view of the visit: coming back to the home page via the logo never re-triggers them
    let first = true;
    try { first = sessionStorage.getItem("dc_prompts_v2") !== "1"; sessionStorage.setItem("dc_prompts_v2", "1"); } catch { /* storage blocked */ }
    if (!first) return;
    const timers: number[] = [];
    const tryVideo = () => {
      if (videoClosed.current) return;
      if (busy()) { timers.push(window.setTimeout(tryVideo, 1500)); return; }
      setVideo(true);
    };
    timers.push(window.setTimeout(tryVideo, VIDEO_AT));
    const tryLead = () => {
      if (leadShown.current) return;
      if (busy()) { timers.push(window.setTimeout(tryLead, window.innerWidth < 700 ? 2500 : 4000)); return; }
      // on phones a full-screen form out of nowhere is too much: offer it in a small card instead
      if (window.innerWidth < 700) {
        leadShown.current = true;
        setVideo(false);
        window.dispatchEvent(new Event("dc:lead-prompted"));
        setTeaser(true);
        return;
      }
      openLead();
    };
    timers.push(window.setTimeout(tryLead, LEAD_AT));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [openLead]);

  const playFilm = () => {
    videoClosed.current = true;
    setVideo(false);
    window.dispatchEvent(new CustomEvent("dc:open-reel"));
  };
  const closeVideo = () => { videoClosed.current = true; setVideo(false); };
  const closeTeaser = () => { setTeaser(false); window.dispatchEvent(new Event("dc:lead-closed")); };

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

      <aside className={`pp-teaser${teaser ? " in" : ""}`} aria-hidden={!teaser}>
        <button type="button" className="pp-teaser-main" onClick={() => { setTeaser(false); openLead(); }} tabIndex={teaser ? 0 : -1}>
          <span className="pp-chip">{copy.popLeadEyebrow}</span>
          <b>{copy.popLeadTitle}</b>
        </button>
        <button type="button" className="pp-x" onClick={closeTeaser} aria-label={copy.close} tabIndex={teaser ? 0 : -1}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </aside>

    </>
  );
}
