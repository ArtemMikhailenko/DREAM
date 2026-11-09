"use client";
import { useEffect, useState } from "react";
import { CONTACTS } from "@/lib/contacts";

/**
 * Phone-only action bar pinned to the bottom: the main offer + WhatsApp, always
 * one tap away. Shows once the hero's own button has scrolled off, hides while
 * the lead form itself is on screen.
 */
export function MobileCta({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".h2-cta");
    const lead = document.getElementById("lead");
    let heroGone = false, leadIn = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroGone = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === lead) leadIn = e.isIntersecting;
      }
      setShow(heroGone && !leadIn);
    });
    if (hero) io.observe(hero);
    if (lead) io.observe(lead);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`mcta${show ? " in" : ""}`} aria-hidden={!show}>
      <a className="mcta-main glass-btn cta-pulse" href="#lead" tabIndex={show ? 0 : -1} onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("dc:open-lead")); }}>{label}</a>
      <a className="mcta-wa" href={CONTACTS.whatsapp} target="_blank" rel="noopener" aria-label="WhatsApp" tabIndex={show ? 0 : -1}>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3 1.8.7 2.5.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.5z"/><path d="M20.5 3.5C18.2 1.2 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.6 1.4 5.5 1.4h.1c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.3-8.3zM12 21.8h-.1c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.5-1.5-3.3-1.5-5.1 0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9 1.8 1.9 2.9 4.4 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8z"/></svg>
      </a>
    </div>
  );
}
