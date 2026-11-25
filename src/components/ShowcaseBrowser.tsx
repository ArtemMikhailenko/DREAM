"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AdCard } from "@/components/home/AdCard";
import { currencyFor } from "@/lib/ad-results";
import type { AdCampaign } from "@/lib/ad-results";
import { SHOWCASE_LANGS, VIDEO_SLIDES, VOICE_BOT, WA_BOT, showcaseCopy, type Line, type TabId, type VideoTag } from "@/lib/showcase-copy";

type Site = { name: string; domain: string; url: string; desc: string; img: string; phone: string };

/* ───────── icons ───────── */
const PChev = () => <svg className="sc-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>;
const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>;
const Chev = ({ back }: { back?: boolean }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={back ? "M15 5 8 12l7 7" : "M9 5l7 7-7 7"} /></svg>;
const WaIcon = () => (
  <svg className="wa-ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" fill="currentColor" />
  </svg>
);
const Sun = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" /></svg>;
const Moon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" /></svg>;
const PhoneIc = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" fill="currentColor" /></svg>;
const Heart = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2 0 3.6 1.1 4.3 2.6.7-1.5 2.3-2.6 4.3-2.6 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21Z" fill="currentColor" /></svg>;
/** our logo (dc.) in a round frame */
const Logo = ({ size }: { size?: number }) => (
  <span className="sc-logo-img" style={size ? { width: size, height: size } : undefined} aria-hidden="true" />
);
const A11yIc = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.6" r="2" fill="currentColor" /><path d="M5 8.2c2.3.7 4.6 1 7 1s4.7-.3 7-1M12 9.2v5.2M12 14.4l-3 6.1M12 14.4l3 6.1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;

/* ───────── helpers ───────── */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on] as const;
}

/** Step counter 0..len that advances while `on`, holds at the end, then loops. */
function useSeq(len: number, on: boolean, step = 1300, hold = 3200) {
  const [k, setK] = useState(0);
  const [still, setStill] = useState(false);
  useEffect(() => { setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  useEffect(() => {
    if (!on || still) return;
    const t = window.setTimeout(() => setK((v) => (v >= len ? 0 : v + 1)), k >= len ? hold : k === 0 ? 700 : step);
    return () => window.clearTimeout(t);
  }, [k, on, len, step, hold, still]);
  return still ? len : k;
}

/** Animated frame: a slow light running round the border. */
const Glow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`sc-glow ${className}`}><div className="sc-glow-in">{children}</div></div>
);

/** A giant soft word that sits behind a block: one line, as wide as the screen. */
function BigWord({ text, cap = 300, className = "" }: { text: string; cap?: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const fit = useCallback(() => {
    const e = el.current;
    if (!e) return;
    e.style.fontSize = "100px";
    const w = e.scrollWidth || 1;
    const avail = document.documentElement.clientWidth * 0.94;
    e.style.fontSize = `${Math.max(Math.min((avail / w) * 100, cap, window.innerWidth * 0.26), 28)}px`;
  }, [cap]);
  useLayoutEffect(() => { fit(); }, [text, fit]);
  useEffect(() => {
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);
  return <span className={`sc-word ${className}`} aria-hidden="true"><span ref={el} key={text}>{text}</span></span>;
}

/**
 * Swipeable window (posts, video): native scroll-snap, so a finger swipe and a
 * trackpad both work; arrows and dots on top. `auto` advances while on screen
 * until the visitor touches it.
 */
function Swiper({ slides, auto, className = "", hint }: { slides: ReactNode[]; auto?: number; className?: string; hint?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [wrap, on] = useInView<HTMLDivElement>();
  const n = slides.length;
  const to = useCallback((k: number) => {
    const t = track.current;
    if (!t) return;
    const idx = ((k % n) + n) % n;
    const rtl = getComputedStyle(t).direction === "rtl";
    t.scrollTo({ left: (rtl ? -1 : 1) * idx * t.clientWidth, behavior: "smooth" });
  }, [n]);
  const onScroll = () => {
    const t = track.current;
    if (t) setI(Math.round(Math.abs(t.scrollLeft) / Math.max(1, t.clientWidth)));
  };
  useEffect(() => {
    if (!auto || held || !on || n < 2) return;
    const id = window.setTimeout(() => to(i + 1), auto);
    return () => window.clearTimeout(id);
  }, [auto, held, on, i, n, to]);
  const hold = () => setHeld(true);
  useEffect(() => {
    track.current?.querySelectorAll<HTMLElement>(".sc-sw-slide").forEach((sl, k) => {
      sl.querySelectorAll("video").forEach((v) => {
        if (k !== i || !on) v.pause();
        else if (v.dataset.loop) v.play().catch(() => {});
      });
    });
  }, [i, on]);
  return (
    <div ref={wrap} className={`sc-sw ${className}`} onPointerDown={hold} onWheel={hold}>
      <div ref={track} className="sc-sw-track" onScroll={onScroll}>
        {slides.map((s, k) => <div className={`sc-sw-slide${k === i ? " on" : ""}`} key={k}>{s}</div>)}
      </div>
      {n > 1 && (
        <>
          <button type="button" className="sc-sw-btn prev" aria-label="‹" onClick={() => { hold(); to(i - 1); }}><Chev back /></button>
          <button type="button" className="sc-sw-btn next" aria-label="›" onClick={() => { hold(); to(i + 1); }}><Chev /></button>
          <div className="sc-sw-dots">
            {slides.map((_, k) => <button type="button" key={k} aria-label={String(k + 1)} className={k === i ? "on" : ""} onClick={() => { hold(); to(k); }} />)}
          </div>
          {hint && !held && <span className="sc-sw-hint">{hint}</span>}
        </>
      )}
    </div>
  );
}

/* ───────── demos ───────── */
function ChatDemo({ lines, typing }: { lines: Line[]; typing: string }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const k = useSeq(lines.length * 2, on);
  const shown = Math.floor(k / 2);
  const next = k % 2 === 1 ? lines[shown] : undefined;
  return (
    <div ref={ref} className="sc-demo" aria-hidden="true">
      <Glow className="sc-chat">
        <div className="sc-chat-h">
          <span className="av"><Logo /></span>
          <span><b>DC Production · AI</b><small>{next?.me ? typing : "online"}</small></span>
        </div>
        <div className="sc-chat-b">
          {lines.slice(0, shown).map((l, i) => <p key={i} className={l.me ? "out" : "in"}>{l.t}</p>)}
          {next && <p className={`dots ${next.me ? "out" : "in"}`}><i /><i /><i /></p>}
        </div>
      </Glow>
    </div>
  );
}

function VoiceDemo({ lines, calling }: { lines: Line[]; calling: string }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const k = useSeq(lines.length, on, 1900, 3400);
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = window.setInterval(() => setSec((s) => (s >= 59 ? 0 : s + 1)), 1000);
    return () => window.clearInterval(t);
  }, [on]);
  useEffect(() => { if (k === 0) setSec(0); }, [k]);
  const last = lines[Math.max(0, k - 1)];
  return (
    <div ref={ref} className="sc-demo" aria-hidden="true">
      <Glow className="sc-call">
        <div className="sc-call-top">
          <span className="sc-call-st"><PhoneIc />{calling}</span>
          <span className="sc-call-t">00:{String(sec).padStart(2, "0")}</span>
        </div>
        <div className="sc-orb"><span /><span /><span /><b><Logo /></b><em className="sc-rec-dot">REC</em></div>
        <div className={`sc-wave${last?.me ? " me" : ""}`}>{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * -0.13}s` }} />)}</div>
        <div className="sc-say">
          {lines.slice(0, k).slice(-3).map((l, i) => <p key={k + "-" + i} className={l.me ? "me" : ""}>{l.t}</p>)}
        </div>
      </Glow>
    </div>
  );
}

/** one reel: poster + play button first, the file loads only when tapped */
function Reel({ src, poster, tag, play }: { src: string; poster: string; tag: string; play: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  return (
    <div className={`sc-reel${on ? " playing" : ""}`}>
      <video ref={v} playsInline preload="none" poster={poster} controls={on} onPause={() => setOn(false)} onEnded={() => setOn(false)}>
        <source src={src} type="video/mp4" />
      </video>
      <span className="sc-reel-tag">{tag}</span>
      {!on && (
        <button type="button" className="sc-reel-play" onClick={() => { setOn(true); v.current?.play().catch(() => setOn(false)); }} aria-label={play}>
          <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg></span>{play}
        </button>
      )}
    </div>
  );
}

function VideoWindow({ tags, play, hint }: { tags: Record<VideoTag, string>; play: string; hint: string }) {
  return (
    <div className="sc-demo">
      <Glow className="sc-vid">
        <Swiper className="sc-vid-sw" hint={hint} slides={VIDEO_SLIDES.map((r) => <Reel key={r.src} src={r.src} poster={r.poster} tag={tags[r.tag]} play={play} />)} />
      </Glow>
    </div>
  );
}

/** Text column of a service block: title, text, three points, WhatsApp button. */
function SvcText({ title, em, text, points, cta, href, note }: { title: string; em?: string; text: string; points?: string[]; cta: string; href: string; note?: string }) {
  return (
    <div className="sc-svc-txt">
      <h3>{title}{em && <> <em>{em}</em></>}</h3>
      <p>{text}</p>
      {points && <ul>{points.map((p) => <li key={p}>{p}</li>)}</ul>}
      <a className="sc-wa glass-btn cta-pulse" href={href} target="_blank" rel="noopener"><WaIcon />{cta}</a>
      {note && <small className="sc-note">{note}</small>}
    </div>
  );
}


/**
 * Floating bot: a round button in the corner that opens a WhatsApp-style chat.
 * Never opens by itself. The first message goes to the AI manager on WhatsApp,
 * where the bot answers and the conversation continues.
 */
function FabChat({ c, label }: { c: { title: string; status: string; hello: string; q: string[]; ph: string; note: string; send: string; close: string }; label: string }) {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const show = useCallback(() => {
    setOpen(true);
    setTyping(true);
    window.setTimeout(() => setTyping(false), 1100);
  }, []);
  useEffect(() => {
    const on = () => show();
    window.addEventListener("sc:open-chat", on);
    return () => window.removeEventListener("sc:open-chat", on);
  }, [show]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc);
    if (window.matchMedia("(pointer:fine)").matches) window.setTimeout(() => input.current?.focus({ preventScroll: true }), 350);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  const send = (msg: string) => {
    const m = msg.trim();
    if (!m) return;
    const url = `https://wa.me/${WA_BOT}?text=${encodeURIComponent(m)}`;
    const w = window.open(url, "_blank", "noopener");
    if (!w) window.location.href = url;
    setText("");
  };
  return (
    <div className={`sc-fc${open ? " open" : ""}`}>
      <div className="sc-fc-panel" role="dialog" aria-label={c.title} aria-hidden={!open}>
        <div className="sc-fc-h">
          <span className="av"><Logo /></span>
          <span className="sc-fc-who"><b>{c.title}</b><small>{typing ? "…" : c.status}</small></span>
          <button type="button" className="sc-fc-x" onClick={() => setOpen(false)} aria-label={c.close} tabIndex={open ? 0 : -1}>×</button>
        </div>
        <div className="sc-fc-b">
          {typing ? <p className="in dots"><i /><i /><i /></p> : <p className="in">{c.hello}</p>}
          {!typing && (
            <div className="sc-fc-q">
              {c.q.map((q) => <button type="button" key={q} onClick={() => send(q)} tabIndex={open ? 0 : -1}>{q}</button>)}
            </div>
          )}
        </div>
        <form className="sc-fc-f" onSubmit={(e) => { e.preventDefault(); send(text); }}>
          <input ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder={c.ph} aria-label={c.ph} tabIndex={open ? 0 : -1} enterKeyHint="send" />
          <button type="submit" aria-label={c.send} disabled={!text.trim()} tabIndex={open ? 0 : -1}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" fill="currentColor" /></svg></button>
        </form>
        <small className="sc-fc-note"><WaIcon />{c.note}</small>
      </div>
      <button type="button" className="sc-fab" onClick={() => (open ? setOpen(false) : show())} aria-expanded={open} aria-label={label}>
        <span className="sc-fab-orb">{open ? <span className="sc-fab-x">×</span> : <Logo />}</span>
        {!open && <span className="sc-fab-typing" aria-hidden="true"><i /><i /><i /></span>}
        {!open && <span className="sc-fab-txt">{label}</span>}
      </button>
    </div>
  );
}

/**
 * Our own glass button for the accessibility menu (UserWay keeps doing the work;
 * its stock round icon is hidden on this page by CSS). Shown once UserWay is loaded.
 */
type UW = { widgetToggle?: () => void; widgetOpen?: () => void };
function A11yButton() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const has = () => !!(window as unknown as { UserWay?: UW }).UserWay;
    if (has()) { setReady(true); return; }
    const on = () => setReady(true);
    document.addEventListener("userway:init_completed", on);
    const id = window.setInterval(() => { if (has()) { setReady(true); window.clearInterval(id); } }, 800);
    return () => { document.removeEventListener("userway:init_completed", on); window.clearInterval(id); };
  }, []);
  if (!ready) return null;
  const open = () => {
    const uw = (window as unknown as { UserWay?: UW }).UserWay;
    // widgetOpen is the call that reliably shows the menu; it has its own close button
    if (uw?.widgetOpen) uw.widgetOpen(); else uw?.widgetToggle?.();
  };
  return (
    <button type="button" className="sc-a11y sc-press" onClick={open} aria-label="Accessibility / נגישות / Доступность">
      <A11yIc />
    </button>
  );
}

/** Apple-style press: a ring pulses out of whatever glass button was tapped. */
function usePressPulse() {
  useEffect(() => {
    const on = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(".sc-press,.sc-tab,.sc-ico,.sc-langs a,.sc-wa,.sc-end-btn,.sc-fab");
      if (!el) return;
      el.classList.remove("pulsing");
      void el.offsetWidth; // restart the animation
      el.classList.add("pulsing");
      window.setTimeout(() => el.classList.remove("pulsing"), 650);
    };
    document.addEventListener("pointerdown", on);
    return () => document.removeEventListener("pointerdown", on);
  }, []);
}

/* ───────── page body ───────── */
type SecId = Exclude<TabId, "all">;
const ORDER: SecId[] = ["video", "results", "sites", "bot", "voice"];

export function ShowcaseBrowser({ locale, sites, results, waMain }: { locale: string; sites: Site[]; results: AdCampaign[]; waMain: string }) {
  const t = showcaseCopy(locale);
  const [active, setActive] = useState<SecId>("video");
  const [atTop, setAtTop] = useState(true);
  useEffect(() => {
    const on = () => setAtTop(window.scrollY < window.innerHeight * 0.18);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const strip = useRef<HTMLDivElement>(null);
  usePressPulse();

  // the visitor's saved theme, applied before the first paint after hydration
  useLayoutEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("sc-theme"); } catch {}
    if (saved === "light") {
      setTheme("light");
      const root = document.getElementById("sc-root");
      if (root) root.dataset.theme = "light";
    }
  }, []);
  const flip = () => {
    const nt = theme === "dark" ? "light" : "dark";
    setTheme(nt);
    const root = document.getElementById("sc-root");
    if (root) root.dataset.theme = nt;
    try { localStorage.setItem("sc-theme", nt); } catch {}
  };

  // services are pages side by side: swipe (phone) or tabs/arrows switch them; the strip follows
  const pager = useRef<HTMLDivElement>(null);
  const activeRef = useRef<SecId>("video");
  const atTopRef = useRef(true);
  useEffect(() => { atTopRef.current = atTop; }, [atTop]);
  const idxOf = (id: SecId) => ORDER.indexOf(id);
  // the pager is as tall as the page on screen, so a short page never leaves an empty tail
  const fit = useCallback(() => {
    const box = pager.current; if (!box) return;
    const page = box.children[ORDER.indexOf(activeRef.current)] as HTMLElement | undefined;
    if (page) box.style.height = `${page.offsetHeight}px`;
  }, []);
  // a new page starts at its top: if the visitor is deep inside the previous one, lift the window back up
  const lift = useCallback(() => {
    const box = pager.current; if (!box) return;
    const head = window.innerWidth < 600 ? 118 : 146;
    const y = box.getBoundingClientRect().top + window.scrollY - head;
    if (window.scrollY > y + 4) window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, []);
  useEffect(() => {
    const box = pager.current; if (!box) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(Math.abs(box.scrollLeft) / Math.max(1, box.clientWidth));
        const id = ORDER[Math.min(ORDER.length - 1, Math.max(0, i))];
        if (id !== activeRef.current) { activeRef.current = id; setActive(id); fit(); lift(); }
      });
    };
    box.addEventListener("scroll", on, { passive: true });
    const ro = new ResizeObserver(() => fit());
    Array.from(box.children).forEach((c) => ro.observe(c));
    ro.observe(box);
    fit();
    return () => { box.removeEventListener("scroll", on); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [fit, lift]);
  useEffect(() => {
    const box = strip.current, pill = box?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!box || !pill) return;
    const left = pill.offsetLeft - (box.clientWidth - pill.offsetWidth) / 2;
    box.scrollTo({ left, behavior: "smooth" });
  }, [active]);
  const go = (id: SecId) => {
    const box = pager.current; if (!box) return;
    const rtl = getComputedStyle(box).direction === "rtl";
    activeRef.current = id; setActive(id); fit();
    box.scrollTo({ left: (rtl ? -1 : 1) * idxOf(id) * box.clientWidth, behavior: "smooth" });
    const head = window.innerWidth < 600 ? 118 : 146;
    const y = box.getBoundingClientRect().top + window.scrollY - head;
    // from the welcome screen a tab brings the pages up; inside a page it returns to its top
    if (atTopRef.current || window.scrollY > y + 4) window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  const waTo = (base: string, text: string) => `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(text)}`;
  const nVid = VIDEO_SLIDES.length;
  const counts: Partial<Record<SecId, number>> = { video: nVid, results: results.length, sites: sites.length };
  // Russian and Hebrew pages: everything in shekels (the campaigns run in Israel)
  const cur = locale === "ru" || locale === "he" ? currencyFor("he") : undefined;
  const openChat = () => window.dispatchEvent(new Event("sc:open-chat"));
  const Head = ({ id, title, em, text, quiet }: { id: SecId; title: string; em?: string; text?: string; quiet?: boolean }) => (
    <div className={`sc-sh${quiet ? " quiet" : ""}`}>
      <h2 className={quiet ? "sr-only" : "sc-h"}>{title}{em && <> <em>{em}</em></>}{!quiet && counts[id] != null && <i>{counts[id]}</i>}</h2>
      {text && <p className="sc-sh-p">{text}</p>}
    </div>
  );

  // under every page: its neighbours, so a visitor on a computer moves sideways without hunting for the tabs
  const pageNav = (id: SecId) => {
    const i = idxOf(id), prev = ORDER[i - 1], next = ORDER[i + 1];
    return (
      <nav className="sc-pnav" aria-label={t.words.all}>
        {prev ? <button type="button" className="sc-pbtn glass-btn prev" onClick={() => go(prev)}><PChev /><span>{t.tabs[prev]}</span></button> : <span />}
        <span className="sc-pdots" aria-hidden="true">{ORDER.map((o) => <i key={o} className={o === id ? "on" : ""} />)}</span>
        {next ? <button type="button" className="sc-pbtn glass-btn next" onClick={() => go(next)}><span>{t.tabs[next]}</span><PChev /></button> : <span />}
      </nav>
    );
  };

  return (
    <>
      <header className="sc-head">
        <div className="wrap sc-head-in">
          <span className="sc-brand"><Logo size={32} /><b>DC.PRODUCTION</b></span>
          <div className="sc-head-r">
            <nav className="sc-langs" aria-label="Language">
              {SHOWCASE_LANGS.map((l) => (
                <a key={l.id} href={l.href} className={l.id === locale ? "on" : ""} aria-current={l.id === locale ? "page" : undefined} hrefLang={l.id}>{l.label}</a>
              ))}
            </nav>
            <button type="button" className="sc-ico" onClick={flip} aria-label={theme === "dark" ? t.light : t.dark} title={theme === "dark" ? t.light : t.dark}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>
          </div>
        </div>
      </header>

      <main className="sc-page">
        <div className="sc-bg" aria-hidden="true" />

        {/* one big word behind the whole page: «Портфолио» at the top, then the section you are in */}
        <BigWord text={atTop ? t.words.all : t.words[active]} cap={320} className="sc-word-fixed" />
        <section className="sc-hero">
          <h1 className="sr-only">{t.meta}</h1>
          <span className="sc-hero-brand"><Logo size={30} />DC Production</span>
        </section>

        <div className="sc-tabs-wrap">
          <div className="wrap">
            <nav className="sc-tabs" ref={strip} aria-label={t.words.all}>
              {ORDER.map((id) => (
                <button key={id} data-id={id} type="button" aria-current={active === id ? "true" : undefined} className={`sc-tab${!atTop && active === id ? " on" : ""}`} onClick={() => go(id)}>
                  <span>{t.tabs[id]}</span>
                  {counts[id] != null && <span className="sc-n">{counts[id]}</span>}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="sc-pager" ref={pager}>
          <section className="sc-sec" id="sc-video"><div className="wrap">
            <Head id="video" title={t.tabs.video} quiet />
            <div className="sc-svc">
              <SvcText title={t.video.title} text={t.video.text} cta={t.video.more} href={waTo(waMain, t.video.wa)} />
              <VideoWindow tags={t.video.tags} play={t.video.play} hint={t.posts.swipe} />
            </div>
          {pageNav("video")}</div></section>

          <section className="sc-sec" id="sc-results"><div className="wrap">
            <Head id="results" title={t.results.title} em={t.results.em} text={t.results.text} />
            <div className="pf-res-grid in-tab sc-res">
              {results.map((c) => (
                <figure className="pf-res-card" key={c.thumb}><AdCard c={c} locale={locale} currency={cur} /></figure>
              ))}
            </div>
          {pageNav("results")}</div></section>

          <section className="sc-sec" id="sc-sites"><div className="wrap">
            <Head id="sites" title={t.tabs.sites} text={t.sitesText} />
            <div className="sc-sites">
              {sites.map((s) => (
                <a className="sc-site" href={s.url} target="_blank" rel="noopener" key={s.domain}>
                  <span className="sc-site-vis">
                    <span className="sc-browser">
                      <span className="sc-bar" aria-hidden="true"><i /><i /><i /><b>{s.domain}</b></span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.img} alt={`${s.name} — ${s.domain}`} loading="lazy" decoding="async" />
                    </span>
                    <span className="sc-phone" aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.phone} alt="" loading="lazy" decoding="async" />
                    </span>
                  </span>
                  <span className="sc-site-info">
                    <b>{s.name}</b>
                    <small>{s.desc}</small>
                    <em>{t.open} <Arrow /></em>
                  </span>
                </a>
              ))}
            </div>
          {pageNav("sites")}</div></section>

          <section className="sc-sec" id="sc-bot"><div className="wrap">
            <Head id="bot" title={t.tabs.bot} quiet />
            <div className="sc-svc sc-df">
              <ChatDemo lines={t.bot.chat} typing={t.bot.typing} />
              <div className="sc-svc-txt">
                <h3>{t.bot.title} <em>{t.bot.em}</em></h3>
                <p>{t.bot.text}</p>
                <ul className="sc-steps">{t.bot.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <button type="button" className="sc-wa glass-btn cta-pulse" onClick={openChat}><WaIcon />{t.bot.cta}</button>
                <a className="sc-alt" href={waTo(`https://wa.me/${WA_BOT}`, t.bot.wa)} target="_blank" rel="noopener"><WaIcon />{t.bot.note}</a>
              </div>
            </div>
          {pageNav("bot")}</div></section>

          <section className="sc-sec" id="sc-voice"><div className="wrap">
            <Head id="voice" title={t.tabs.voice} quiet />
            <div className="sc-svc sc-df">
              <VoiceDemo lines={t.voice.script} calling={t.voice.calling} />
              <div className="sc-svc-txt">
                <h3>{t.voice.title} <em>{t.voice.em}</em></h3>
                <p>{t.voice.text}</p>
                <ul>{t.voice.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <a className="sc-wa sc-call-btn glass-btn cta-pulse" href={`tel:${VOICE_BOT.tel}`}>
                  <span className="sc-call-ic"><PhoneIc /></span>
                  <span className="sc-call-lbl">{t.voice.cta}<b dir="ltr">{VOICE_BOT.show}</b></span>
                </a>
                <small className="sc-note">{t.voice.note}</small>
                <a className="sc-alt" href={waTo(waMain, t.voice.wa)} target="_blank" rel="noopener"><WaIcon />{t.voice.or}</a>
              </div>
            </div>
          {pageNav("voice")}</div></section>
        </div>

        <div className="wrap">
          <section className="sc-end">
            <h2>{t.cta}</h2>
            <p>{t.ctaText}</p>
            <a className="glass-btn cta-pulse sc-end-btn" href={waTo(waMain, t.waMore)} target="_blank" rel="noopener"><WaIcon />{t.ctaBtn}</a>
          </section>
        </div>
      </main>
      <footer className="sc-foot"><div className="wrap">© DC Production</div></footer>

      <FabChat c={t.chat} label={t.float} />
      <A11yButton />
    </>
  );
}
