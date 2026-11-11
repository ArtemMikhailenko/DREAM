"use client";
import { useEffect, useState } from "react";

/**
 * Cookie notice. Tracking keeps running exactly as before for everyone who accepts
 * or ignores the notice (GA4, Google Ads, Meta and TikTok pixels are untouched).
 * "Only necessary" sends the platforms their own consent signals (Google consent
 * mode "denied", Meta revoke, TikTok revoke) and the choice is remembered, so it
 * is re-applied on every next page.
 */
const KEY = "dc_cookies";
const T: Record<string, { text: string; ok: string; no: string }> = {
  en: { text: "We use cookies for analytics and ads, so we can show you relevant offers.", ok: "Accept", no: "Only necessary" },
  ru: { text: "Мы используем cookie для аналитики и рекламы, чтобы показывать вам полезные предложения.", ok: "Принять", no: "Только необходимые" },
  he: { text: "אנחנו משתמשים בעוגיות לניתוח ופרסום, כדי להציג לכם הצעות רלוונטיות.", ok: "אישור", no: "רק הכרחיות" },
  es: { text: "Usamos cookies de analítica y publicidad para mostrarte ofertas relevantes.", ok: "Aceptar", no: "Solo necesarias" },
  ar: { text: "نستخدم ملفات تعريف الارتباط للتحليلات والإعلانات لنعرض لك عروضاً مناسبة.", ok: "موافق", no: "الضرورية فقط" },
};

type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; ttq?: { revokeConsent?: () => void } };
function deny() {
  const w = window as W;
  try { w.gtag?.("consent", "update", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }); } catch { /* not loaded */ }
  try { w.fbq?.("consent", "revoke"); } catch { /* not loaded */ }
  try { w.ttq?.revokeConsent?.(); } catch { /* not loaded */ }
}

export function CookieBanner({ locale }: { locale: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let v: string | null = null;
    try { v = localStorage.getItem(KEY); } catch { /* storage blocked */ }
    if (v === "necessary") {
      // trackers load after hydration; apply the saved choice once they are there
      deny(); const t = window.setTimeout(deny, 2500); return () => window.clearTimeout(t);
    }
    if (!v) { const t = window.setTimeout(() => setShow(true), 1500); return () => window.clearTimeout(t); }
  }, []);
  const choose = (v: "all" | "necessary") => {
    try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ }
    if (v === "necessary") deny();
    setShow(false);
  };
  const t = T[locale] ?? T.en;
  return (
    <div className={`ck${show ? " in" : ""}`} role="dialog" aria-live="polite" aria-hidden={!show}>
      <p>🍪 {t.text}</p>
      <div className="ck-btns">
        <button type="button" className="ck-no" onClick={() => choose("necessary")} tabIndex={show ? 0 : -1}>{t.no}</button>
        <button type="button" className="ck-ok" onClick={() => choose("all")} tabIndex={show ? 0 : -1}>{t.ok}</button>
      </div>
    </div>
  );
}
