"use client";
import { useEffect, useRef, useState } from "react";

/*
 * "From idea to result", shown as a result: a campaign month on a small
 * dashboard. The budget is set, bars of leads rise week by week, the line of
 * customers climbs after them and the counters run up. It replays every few
 * seconds while on screen. Figures follow our average lead price (~₪17).
 */
const T = {
  ru: { budget: "Бюджет на рекламу", leads: "Заявки", clients: "Клиенты", weeks: ["1 нед", "2 нед", "3 нед", "4 нед"], tag: "от идеи до результата" },
  he: { budget: "תקציב פרסום", leads: "לידים", clients: "לקוחות", weeks: ["שבוע 1", "שבוע 2", "שבוע 3", "שבוע 4"], tag: "מרעיון לתוצאה" },
  es: { budget: "Presupuesto publicitario", leads: "Leads", clients: "Clientes", weeks: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"], tag: "de la idea al resultado" },
  en: { budget: "Ad budget", leads: "Leads", clients: "Customers", weeks: ["Week 1", "Week 2", "Week 3", "Week 4"], tag: "from idea to result" },
} as const;

const BUDGET = 3000, LEADS = [22, 41, 52, 61], CLIENTS = [3, 7, 9, 11];

export function GrowthViz({ locale }: { locale: string }) {
  const t = T[(locale as keyof typeof T)] ?? T.en;
  const root = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0); // increments to replay
  const [k, setK] = useState(0); // 0 → 1 progress of the counters

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let visible = false, timer = 0;
    const loop = () => { if (visible) { setRun((r) => r + 1); timer = window.setTimeout(loop, 7000); } };
    const io = new IntersectionObserver(([e]) => {
      const was = visible; visible = e.isIntersecting;
      if (visible && !was) loop();
      if (!visible) window.clearTimeout(timer);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (!run) return;
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 2600);
      setK(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setK(0); raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);

  const total = LEADS.reduce((a, b) => a + b, 0), clients = CLIENTS.reduce((a, b) => a + b, 0);
  const max = Math.max(...LEADS);
  const W = 400, H = 190, bw = 52;
  const xs = LEADS.map((_, i) => 40 + i * ((W - 80) / (LEADS.length - 1)));
  const cmax = Math.max(...CLIENTS.map((_, i) => CLIENTS.slice(0, i + 1).reduce((a, b) => a + b, 0)));
  const cy = CLIENTS.map((_, i) => H - 16 - (CLIENTS.slice(0, i + 1).reduce((a, b) => a + b, 0) / cmax) * (H - 50));
  const path = xs.map((x, i) => `${i ? "L" : "M"}${x},${cy[i]}`).join(" ");

  return (
    <div className="gv" ref={root}>
      <div className="gv-top">
        <div className="gv-kpi">
          <span>{t.budget}</span>
          <b>₪{Math.round(BUDGET * Math.min(1, k * 1.6)).toLocaleString("en-US")}</b>
        </div>
        <div className="gv-kpi is-leads">
          <span>{t.leads}</span>
          <b>{Math.round(total * k)}</b>
        </div>
        <div className="gv-kpi is-clients">
          <span>{t.clients}</span>
          <b>{Math.round(clients * k)}</b>
        </div>
      </div>
      <svg key={run} className={`gv-chart${run ? " go" : ""}`} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id="gvBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0c49b" />
            <stop offset="1" stopColor="#e8a868" stopOpacity=".25" />
          </linearGradient>
        </defs>
        <line x1="10" x2={W - 10} y1={H - 16} y2={H - 16} className="gv-base" />
        {LEADS.map((v, i) => {
          const h = (v / max) * (H - 50);
          return <rect key={i} x={xs[i] - bw / 2} y={H - 16 - h} width={bw} height={h} rx="8" className="gv-bar" fill="url(#gvBar)" style={{ ["--d" as string]: `${0.25 + i * 0.32}s` }} />;
        })}
        <path d={path} className="gv-line" pathLength={1} />
        {xs.map((x, i) => <circle key={i} cx={x} cy={cy[i]} r="6" className="gv-dot" style={{ ["--d" as string]: `${0.9 + i * 0.32}s` }} />)}
      </svg>
      <div className="gv-weeks" aria-hidden="true">{t.weeks.map((w) => <span key={w}>{w}</span>)}</div>
      <p className="gv-tag brush">{t.tag}</p>
    </div>
  );
}
