"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AdCard } from "@/components/home/AdCard";
import type { AdCampaign } from "@/lib/ad-results";
import { POST_SLIDES, SHOWCASE_LANGS, VIDEO_SLIDES, VOICE_BOT, WA_BOT, showcaseCopy, type Line, type TabId } from "@/lib/showcase-copy";

type Site = { name: string; domain: string; url: string; desc: string; img: string; phone: string };

/* ───────── icons ───────── */
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
/** the bot mark: a speech bubble with a spark — used on the floating button and chat avatar */
const BotMark = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <defs>
      <linearGradient id="sc-bm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" /><stop offset=".55" stopColor="#ffe0bf" /><stop offset="1" stopColor="#e8a868" /></linearGradient>
    </defs>
    <path d="M16 4C9.1 4 4 8.6 4 14.3c0 3.1 1.5 5.8 3.9 7.7L7 27.5l5.6-2.8c1.1.3 2.2.4 3.4.4 6.9 0 12-4.6 12-10.8S22.9 4 16 4Z" fill="none" stroke="url(#sc-bm)" strokeWidth="2" strokeLinejoin="round" />
    <path d="M16 9.2l1.3 3.6 3.6 1.3-3.6 1.3-1.3 3.6-1.3-3.6-3.6-1.3 3.6-1.3z" fill="url(#sc-bm)" />
  </svg>
);

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

/** The giant word: always one line, as wide as the page allows. */
function BigWord({ text }: { text: string }) {
  const box = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLSpanElement>(null);
  const fit = useCallback(() => {
    const b = box.current, e = el.current;
    if (!b || !e) return;
    e.style.fontSize = "100px";
    const w = e.scrollWidth || 1;
    // one fixed height for every tab, so the tabs below never jump
    const cap = Math.min(window.innerWidth * 0.19, 250);
    const size = Math.min((b.clientWidth / w) * 100 * 0.985, cap);
    e.style.fontSize = `${Math.max(size, 28)}px`;
    b.style.height = `${cap * 0.98}px`;
  }, []);
  useLayoutEffect(() => { fit(); }, [text, fit]);
  useEffect(() => {
    const ro = new ResizeObserver(fit);
    if (box.current) ro.observe(box.current);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [fit]);
  return (
    <div ref={box} className="sc-word-box">
      <h1 className="sc-word"><span ref={el} key={text}>{text}</span></h1>
    </div>
  );
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
          <span className="av"><BotMark /></span>
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
        <div className="sc-orb"><span /><span /><span /><b>AI</b></div>
        <div className={`sc-wave${last?.me ? " me" : ""}`}>{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * -0.13}s` }} />)}</div>
        <div className="sc-say">
          {lines.slice(0, k).slice(-3).map((l, i) => <p key={k + "-" + i} className={l.me ? "me" : ""}>{l.t}</p>)}
        </div>
      </Glow>
    </div>
  );
}

function PostsWindow({ slides, hint }: { slides: string[]; hint: string }) {
  const items: ReactNode[] = POST_SLIDES.length
    ? POST_SLIDES.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" loading="lazy" decoding="async" />
      ))
    : slides.map((p, i) => <div key={i} className={`sc-art g${i % 3}`}><b>{p}</b></div>);
  return (
    <div className="sc-demo">
      <Glow className="sc-post">
        <div className="sc-post-h"><span className="av"><BotMark /></span><span><b>your.brand</b><small>Sponsored</small></span></div>
        <Swiper slides={items} auto={3200} className="sc-post-img" hint={hint} />
        <div className="sc-post-cta"><span>Learn more</span><Arrow /></div>
        <div className="sc-post-f"><span className="hrt"><Heart /></span><i /><i /></div>
      </Glow>
    </div>
  );
}

function VideoWindow({ locale }: { locale: string }) {
  const vids = VIDEO_SLIDES(locale);
  return (
    <div className="sc-demo sc-demo-wide">
      <Glow className="sc-vid">
        <Swiper
          className="sc-vid-sw"
          slides={vids.map((v) => (
            <video key={v.src} controls playsInline preload="none" poster={v.poster}>
              <source src={v.src} type="video/mp4" />
            </video>
          ))}
        />
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

/* ───────── page body ───────── */
export function ShowcaseBrowser({ locale, sites, results, waMain }: { locale: string; sites: Site[]; results: AdCampaign[]; waMain: string }) {
  const t = showcaseCopy(locale);
  const [tab, setTab] = useState<TabId>("all");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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

  const waTo = (base: string, text: string) => `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(text)}`;
  const nVid = VIDEO_SLIDES(locale).length;

  const order: TabId[] = ["all", "video", "posts", "results", "sites", "bot", "voice"];
  const counts: Partial<Record<TabId, number>> = { video: nVid, results: results.length, sites: sites.length };
  const show = (id: TabId) => tab === "all" || tab === id;
  const all = tab === "all";
  const go = (id: TabId) => {
    setTab(id);
    const el = document.getElementById("sc-top");
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const H = ({ id }: { id: TabId }) => (all ? <h2 className="sc-h"><span>{t.tabs[id]}</span>{counts[id] != null && <i>{counts[id]}</i>}</h2> : null);

  return (
    <>
      <header className="sc-head">
        <div className="wrap sc-head-in">
          <span className="sc-logo">DC.PRODUCTION</span>
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
        <div className="wrap">
          <BigWord text={t.words[tab]} />
          <p className="sc-sub">{t.sub}</p>

          <div className="sc-tabs-wrap" id="sc-top">
            <div className="sc-tabs" role="tablist">
              {order.map((id) => (
                <button key={id} type="button" role="tab" aria-selected={tab === id} className={`sc-tab${tab === id ? " on" : ""}`} onClick={() => go(id)}>
                  <span>{t.tabs[id]}</span>
                  {counts[id] != null && <span className="sc-n">{counts[id]}</span>}
                </button>
              ))}
            </div>
          </div>

          {show("video") && (
            <section className="sc-sec" key={`v-${tab}`} aria-label={t.tabs.video}>
              <H id="video" />
              <div className="sc-svc sc-svc-video">
                <SvcText title={t.video.title} text={t.video.text} cta={t.video.more} href={waTo(waMain, t.video.wa)} />
                <VideoWindow locale={locale} />
              </div>
            </section>
          )}

          {show("posts") && (
            <section className="sc-sec" key={`p-${tab}`} aria-label={t.tabs.posts}>
              <H id="posts" />
              <div className="sc-svc">
                <SvcText {...t.posts} href={waTo(waMain, t.posts.wa)} />
                <PostsWindow slides={t.posts.slides} hint={t.posts.swipe} />
              </div>
            </section>
          )}

          {show("results") && (
            <section className="sc-sec" key={`r-${tab}`} aria-label={t.tabs.results}>
              <H id="results" />
              <div className="pf-res-grid in-tab sc-res">
                {results.map((c) => (
                  <figure className="pf-res-card" key={c.thumb}><AdCard c={c} locale={locale} /></figure>
                ))}
              </div>
            </section>
          )}

          {show("sites") && (
            <section className="sc-sec" key={`s-${tab}`} aria-label={t.tabs.sites}>
              <H id="sites" />
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
            </section>
          )}

          {show("bot") && (
            <section className="sc-sec" key={`b-${tab}`} aria-label={t.tabs.bot}>
              <H id="bot" />
              <div className="sc-svc">
                <SvcText {...t.bot} href={waTo(`https://wa.me/${WA_BOT}`, t.bot.wa)} />
                <ChatDemo lines={t.bot.chat} typing={t.bot.typing} />
              </div>
            </section>
          )}

          {show("voice") && (
            <section className="sc-sec" key={`vo-${tab}`} aria-label={t.tabs.voice}>
              <H id="voice" />
              <div className="sc-svc">
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
                <VoiceDemo lines={t.voice.script} calling={t.voice.calling} />
              </div>
            </section>
          )}

          <section className="sc-end">
            <h2>{t.cta}</h2>
            <p>{t.ctaText}</p>
            <a className="glass-btn cta-pulse sc-end-btn" href={waTo(waMain, t.waMore)} target="_blank" rel="noopener"><WaIcon />{t.ctaBtn}</a>
          </section>
        </div>
      </main>
      <footer className="sc-foot"><div className="wrap">© DC Production</div></footer>

      {/* floating bot button: opens WhatsApp, never pops up by itself */}
      <a className="sc-fab" href={waTo(waMain, t.waMore)} target="_blank" rel="noopener" aria-label={`${t.float} — WhatsApp`}>
        <span className="sc-fab-orb"><BotMark /><i className="sc-fab-wa"><WaIcon /></i></span>
        <span className="sc-fab-txt">{t.float}</span>
      </a>
    </>
  );
}
