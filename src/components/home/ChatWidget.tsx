"use client";
import { useEffect, useRef, useState } from "react";
import { CONTACTS } from "@/lib/contacts";

const T = {
  ru: { open: "Задать вопрос", title: "dc.production", status: "Онлайн · отвечаем быстро", hello: "Здравствуйте! Чем можем помочь? Выберите вопрос или напишите свой", q: ["Хочу больше клиентов", "Сколько это стоит?", "Как быстро будет результат?"], ph: "Напишите сообщение…", send: "Отправить", note: "Ответим в WhatsApp", close: "Закрыть", audit: "Оставить заявку на аудит" },
  en: { open: "Ask a question", title: "dc.production", status: "Online · quick replies", hello: "Hi! How can we help? Pick a question or type your own", q: ["I want more customers", "How much does it cost?", "How fast will I see results?"], ph: "Type a message…", send: "Send", note: "We'll reply on WhatsApp", close: "Close", audit: "Request a free audit" },
  he: { open: "שאלו אותנו", title: "dc.production", status: "מחוברים · עונים מהר", hello: "היי! איך נוכל לעזור? בחרו שאלה או כתבו משלכם", q: ["אני רוצה יותר לקוחות", "כמה זה עולה?", "תוך כמה זמן יש תוצאות?"], ph: "כתבו הודעה…", send: "שליחה", note: "נחזור אליכם בוואטסאפ", close: "סגירה", audit: "השאירו פרטים לאודיט חינם" },
} as const;

/**
 * Chat button in the bottom corner. It appears a second after the free-audit
 * window first shows (or after 8s if that never happens). For now the chat hands
 * the visitor's message over to WhatsApp; a real bot can be plugged in here later.
 */
export function ChatWidget({ locale }: { locale: string }) {
  const t = T[(locale as keyof typeof T)] ?? T.en;
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // the chat pops up by itself once: right after the audit window is closed
  // (or at 12s if that window never got a chance), "typing…" first, then the greeting
  useEffect(() => {
    const timers: number[] = [];
    let done = false;
    const pop = (delay: number) => {
      if (done) return;
      done = true;
      timers.push(window.setTimeout(() => {
        if (document.querySelector(".pp-lead.in")) { done = false; pop(1500); return; }
        setShown(true);
        if (window.innerWidth >= 700) timers.push(window.setTimeout(() => { setOpen(true); setTyping(true); }, 450));
        timers.push(window.setTimeout(() => setTyping(false), 2000));
      }, delay));
    };
    // pops up by itself only on the first page view of the visit; later the button simply sits in the corner
    let first = true;
    try { first = sessionStorage.getItem("dc_chat_v2") !== "1"; sessionStorage.setItem("dc_chat_v2", "1"); } catch { /* storage blocked */ }
    if (!first) { setShown(true); return; }
    timers.push(window.setTimeout(() => pop(0), 12000));
    const onClosed = () => pop(2000);
    window.addEventListener("dc:lead-closed", onClosed);
    return () => { timers.forEach((t) => window.clearTimeout(t)); window.removeEventListener("dc:lead-closed", onClosed); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toWhatsApp = (msg: string) => {
    const url = `${CONTACTS.whatsapp}${CONTACTS.whatsapp.includes("?") ? "&" : "?"}text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className={`chw${shown ? " is-shown" : ""}${open ? " is-open" : ""}`}>
      <div className="chw-panel" role="dialog" aria-label={t.title} aria-hidden={!open}>
        <div className="chw-head">
          <span className="chw-ava" aria-hidden="true">dc</span>
          <span className="chw-who"><b>{t.title}</b><em><i aria-hidden="true" />{t.status}</em></span>
          <button type="button" className="chw-x" onClick={() => setOpen(false)} aria-label={t.close} tabIndex={open ? 0 : -1}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="chw-body">
          {typing ? (
            <p className="chw-msg chw-typing" aria-label="…"><i /><i /><i /></p>
          ) : (
            <p className="chw-msg chw-in">{t.hello}</p>
          )}
          <div className={`chw-quick${typing ? "" : " chw-in"}`}>
            {t.q.map((q) => (
              <button type="button" key={q} onClick={() => toWhatsApp(q)} tabIndex={open ? 0 : -1}>{q}</button>
            ))}
            <button type="button" className="is-audit" onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent("dc:open-lead")); }} tabIndex={open ? 0 : -1}>{t.audit}</button>
          </div>
        </div>
        <form className="chw-form" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { toWhatsApp(text.trim()); setText(""); } }}>
          <input ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.ph} aria-label={t.ph} tabIndex={open ? 0 : -1} />
          <button type="submit" aria-label={t.send} tabIndex={open ? 0 : -1}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12 20 4l-6 16-3-7-7-1z" /></svg>
          </button>
        </form>
        <p className="chw-note">{t.note}</p>
      </div>
      <button type="button" className="chw-btn" onClick={() => setOpen((o) => !o)} aria-label={t.open} aria-expanded={open} tabIndex={shown ? 0 : -1}>
        <span className="chw-ping" aria-hidden="true" />
        <svg className="chw-ic-chat" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z" /><path d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01" /></svg>
        <svg className="chw-ic-x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
    </div>
  );
}
