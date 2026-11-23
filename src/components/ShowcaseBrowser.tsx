"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AdCard } from "@/components/home/AdCard";
import type { AdCampaign } from "@/lib/ad-results";
import { SHOWCASE_LANGS, WA_BOT, showcaseCopy, type Line } from "@/lib/showcase-copy";

type Site = { name: string; domain: string; url: string; desc: string; img: string; phone: string };
type Tab = "all" | "sites" | "results" | "video" | "posts" | "bot" | "voice" | "tel";

/* ───────── icons ───────── */
const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>;
const WaIcon = () => (
  <svg className="wa-ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" fill="currentColor" />
  </svg>
);
const Sun = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" /></svg>;
const Moon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" /></svg>;
const PhoneIc = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" fill="currentColor" /></svg>;
const Heart = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2 0 3.6 1.1 4.3 2.6.7-1.5 2.3-2.6 4.3-2.6 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21Z" fill="currentColor" /></svg>;

/* ───────── animation helpers ───────── */
/** true once the element is on screen (and while it stays there) */
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
  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
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
          <span className="av">dc.</span>
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

function TelDemo({ calls, head, rec }: { calls: { who: string; src: string; st: string }[]; head: string; rec: string }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const k = useSeq(calls.length, on, 1500, 3400);
  const now = [9, 11, 13, 16];
  return (
    <div ref={ref} className="sc-demo" aria-hidden="true">
      <Glow className="sc-tel">
        <div className="sc-tel-h"><b>{head}</b><span>{k}</span></div>
        <ul>
          {calls.slice(0, k).map((c, i) => (
            <li key={i}>
              <span className="ic"><PhoneIc /></span>
              <span className="who"><b>{c.who}</b><small>{String(now[i] ?? 10).padStart(2, "0")}:{String((i * 17 + 4) % 60).padStart(2, "0")} · <em className={`src s-${c.src.toLowerCase()}`}>{c.src}</em></small></span>
              <span className="st">{c.st}</span>
            </li>
          ))}
        </ul>
        <div className={`sc-rec${k > 0 ? " on" : ""}`}>
          <span className="play" />
          <span className="bars">{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ height: `${25 + ((i * 37) % 70)}%` }} />)}</span>
          <small>{rec}</small>
        </div>
      </Glow>
    </div>
  );
}

function PostsDemo({ points }: { points: string[] }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const k = useSeq(3, on, 2600, 2600);
  const slide = k % 3;
  return (
    <div ref={ref} className="sc-demo" aria-hidden="true">
      <Glow className="sc-post">
        <div className="sc-post-h"><span className="av">dc.</span><span><b>your.brand</b><small>Sponsored</small></span></div>
        <div className="sc-post-img">
          {points.map((p, i) => (
            <div key={i} className={`sc-slide g${i}${slide === i ? " on" : ""}`}><b>{p}</b></div>
          ))}
          <div className="sc-post-dots">{points.map((_, i) => <i key={i} className={slide === i ? "on" : ""} />)}</div>
        </div>
        <div className="sc-post-cta"><span>Learn more</span><Arrow /></div>
        <div className="sc-post-f"><span className={`hrt${on ? " beat" : ""}`} key={slide}><Heart /></span><i /><i /></div>
      </Glow>
    </div>
  );
}

function VideoBox({ langs, first }: { langs: Record<string, string>; first: string }) {
  const ids = Object.keys(langs);
  const [lang, setLang] = useState(ids.includes(first) ? first : ids[0]);
  return (
    <div className="sc-video">
      <div className="sc-video-frame">
        <video key={lang} controls playsInline preload="none" poster={`/videos/vsl-${lang}-poster.webp`}>
          <source src={`/videos/vsl-${lang}.mp4`} type="video/mp4" />
        </video>
      </div>
      <div className="sc-video-langs" role="group">
        {ids.map((id) => (
          <button key={id} type="button" className={lang === id ? "on" : ""} aria-pressed={lang === id} onClick={() => setLang(id)}>{langs[id]}</button>
        ))}
      </div>
    </div>
  );
}

/** Text column of a service block: title, text, three points, WhatsApp button. */
function SvcText({ title, em, text, points, cta, href, note }: { title: string; em: string; text: string; points: string[]; cta: string; href: string; note?: string }) {
  return (
    <div className="sc-svc-txt">
      <h3>{title} <em>{em}</em></h3>
      <p>{text}</p>
      <ul>{points.map((p) => <li key={p}>{p}</li>)}</ul>
      <a className="sc-wa glass-btn cta-pulse" href={href} target="_blank" rel="noopener"><WaIcon />{cta}</a>
      {note && <small className="sc-note">{note}</small>}
    </div>
  );
}

/* ───────── page body ───────── */
export function ShowcaseBrowser({ locale, sites, results, waMain }: { locale: string; sites: Site[]; results: AdCampaign[]; waMain: string }) {
  const t = showcaseCopy(locale);
  const [tab, setTab] = useState<Tab>("all");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // the visitor's saved choice, applied before the first paint after hydration
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
  const waBot = waTo(`https://wa.me/${WA_BOT}`, t.bot.wa);
  const vids = Object.keys(t.langs).length;

  const tabs: { id: Tab; label: string; n?: number }[] = [
    { id: "all", label: t.tabs.all },
    { id: "sites", label: t.tabs.sites, n: sites.length },
    { id: "results", label: t.tabs.results, n: results.length },
    { id: "video", label: t.tabs.video, n: vids },
    { id: "posts", label: t.tabs.posts },
    { id: "bot", label: t.tabs.bot },
    { id: "voice", label: t.tabs.voice },
    { id: "tel", label: t.tabs.tel },
  ];
  const show = (id: Tab) => tab === "all" || tab === id;
  const all = tab === "all";
  const go = (id: Tab) => {
    setTab(id);
    const el = document.getElementById("sc-top");
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const H = ({ label, n }: { label: string; n?: number }) => (all ? <h2 className="sc-h"><span>{label}</span>{n != null && <i>{n}</i>}</h2> : null);

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
            <a className="sc-ico sc-ico-wa" href={waTo(waMain, t.waMore)} target="_blank" rel="noopener" aria-label="WhatsApp"><WaIcon /></a>
          </div>
        </div>
      </header>

      <main className="sc-page">
        <div className="sc-bg" aria-hidden="true" />
        <div className="wrap">
          <div className="sc-hero">
            <h1>{t.kicker}</h1>
            <p>{t.sub}</p>
          </div>

          <div className="sc-tabs-wrap" id="sc-top">
            <div className="sc-tabs" role="tablist">
              {tabs.map((x) => (
                <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} className={`sc-tab${tab === x.id ? " on" : ""}`} onClick={() => go(x.id)}>
                  {x.label}
                  {x.n != null && <span className="sc-n">{x.n}</span>}
                </button>
              ))}
            </div>
          </div>

          {show("sites") && (
            <section className="sc-sec" aria-label={t.tabs.sites} key={`s-${tab}`}>
              <H label={t.tabs.sites} n={sites.length} />
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

          {show("results") && (
            <section className="sc-sec" aria-label={t.tabs.results} key={`r-${tab}`}>
              <H label={t.tabs.results} n={results.length} />
              <div className="pf-res-grid in-tab sc-res">
                {results.map((c) => (
                  <figure className="pf-res-card" key={c.thumb}><AdCard c={c} locale={locale} /></figure>
                ))}
              </div>
            </section>
          )}

          {show("video") && (
            <section className="sc-sec" aria-label={t.tabs.video} key={`v-${tab}`}>
              <H label={t.tabs.video} n={vids} />
              <div className="sc-svc sc-svc-video">
                <div className="sc-svc-txt">
                  <h3>{t.videoTitle}</h3>
                  <p>{t.videoText}</p>
                  <a className="sc-wa glass-btn" href={waTo(waMain, t.videoWa)} target="_blank" rel="noopener"><WaIcon />{t.videoMore}</a>
                </div>
                <VideoBox langs={t.langs} first={locale} />
              </div>
            </section>
          )}

          {show("posts") && (
            <section className="sc-sec" aria-label={t.tabs.posts} key={`p-${tab}`}>
              <H label={t.tabs.posts} />
              <div className="sc-svc">
                <SvcText {...t.posts} href={waTo(waMain, t.posts.wa)} />
                <PostsDemo points={t.posts.points} />
              </div>
            </section>
          )}

          {show("bot") && (
            <section className="sc-sec" aria-label={t.tabs.bot} key={`b-${tab}`}>
              <H label={t.tabs.bot} />
              <div className="sc-svc">
                <SvcText {...t.bot} href={waBot} />
                <ChatDemo lines={t.bot.chat} typing={t.bot.typing} />
              </div>
            </section>
          )}

          {show("voice") && (
            <section className="sc-sec" aria-label={t.tabs.voice} key={`vo-${tab}`}>
              <H label={t.tabs.voice} />
              <div className="sc-svc">
                <SvcText {...t.voice} href={waTo(waMain, t.voice.wa)} />
                <VoiceDemo lines={t.voice.script} calling={t.voice.calling} />
              </div>
            </section>
          )}

          {show("tel") && (
            <section className="sc-sec" aria-label={t.tabs.tel} key={`t-${tab}`}>
              <H label={t.tabs.tel} />
              <div className="sc-svc">
                <SvcText {...t.tel} href={waTo(waMain, t.tel.wa)} />
                <TelDemo calls={t.tel.calls} head={t.tel.head} rec={t.tel.rec} />
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
      <footer className="sc-foot"><div className="wrap">© {new Date().getFullYear()} DC Production</div></footer>
    </>
  );
}
