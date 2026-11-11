"use client";
import { useEffect, useRef, useState } from "react";

/*
 * "From idea to result" as the road it really is: one glowing curve climbs from
 * the idea to the first customers. A light travels along it, each stop lights up
 * as it passes (idea, shoot, ads live, leads, customers) and the customer count
 * runs up at the end. It replays while the card is on screen.
 */
const T = {
  ru: { stops: ["Идея", "Съёмка", "Запуск рекламы", "Заявки", "Клиенты"], when: ["день 1", "день 3", "день 7", "через 48 часов", "первый месяц"], kpi: "новых клиентов в первый месяц", tag: "от идеи до результата" },
  he: { stops: ["רעיון", "צילום", "השקת פרסום", "לידים", "לקוחות"], when: ["יום 1", "יום 3", "יום 7", "תוך 48 שעות", "החודש הראשון"], kpi: "לקוחות חדשים בחודש הראשון", tag: "מרעיון לתוצאה" },
  es: { stops: ["Idea", "Rodaje", "Lanzamiento", "Leads", "Clientes"], when: ["día 1", "día 3", "día 7", "en 48 horas", "primer mes"], kpi: "clientes nuevos el primer mes", tag: "de la idea al resultado" },
  ar: { stops: ["الفكرة", "التصوير", "إطلاق الإعلانات", "الطلبات", "الزبائن"], when: ["اليوم 1", "اليوم 3", "اليوم 7", "خلال 48 ساعة", "الشهر الأول"], kpi: "زبون جديد في الشهر الأول", tag: "من الفكرة إلى النتيجة" },
  en: { stops: ["Idea", "Shoot", "Ads go live", "Leads", "Customers"], when: ["day 1", "day 3", "day 7", "within 48 hours", "first month"], kpi: "new customers in the first month", tag: "from idea to result" },
} as const;

const W = 520, H = 300;
// a calm start that bends upward: the work first, then the growth
const PATH = "M30 262 C 120 258, 170 240, 220 214 S 320 150, 370 110 S 450 40, 492 30";
const AT = [0, 0.27, 0.5, 0.74, 1]; // where each stop sits along the curve
const RUN = 3600, TOTAL = 100;

export function GrowthViz({ locale }: { locale: string }) {
  const t = T[(locale as keyof typeof T)] ?? T.en;
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [k, setK] = useState(0); // 0 → 1 along the road
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const [len, setLen] = useState(1);

  useEffect(() => {
    const p = path.current;
    if (!p) return;
    const L = p.getTotalLength();
    setLen(L);
    setPts(AT.map((a) => { const q = p.getPointAtLength(a * L); return { x: q.x, y: q.y }; }));
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setK(1); return; }
    let raf = 0, timer = 0, visible = false;
    const play = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / RUN);
        setK(p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
        if (p < 1) raf = requestAnimationFrame(tick);
        else timer = window.setTimeout(() => { if (visible) { setK(0); timer = window.setTimeout(play, 500); } }, 4200);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      const was = visible; visible = e.isIntersecting;
      if (visible && !was) { cancelAnimationFrame(raf); window.clearTimeout(timer); setK(0); play(); }
      if (!visible) { cancelAnimationFrame(raf); window.clearTimeout(timer); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.clearTimeout(timer); };
  }, []);

  const head = path.current && len > 1 ? path.current.getPointAtLength(k * len) : null;
  const done = AT.map((a) => k >= a - 0.001);
  const count = Math.round(TOTAL * Math.max(0, (k - 0.74) / 0.26));

  return (
    <div className="gj" ref={root}>
      <div className="gj-kpi" aria-hidden={k < 0.75}>
        <b>+{count}</b>
        <span>{t.kpi}</span>
      </div>
      <div className="gj-chart">
      <svg className="gj-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id="gjLine" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#e8a868" />
            <stop offset=".7" stopColor="#f0c49b" />
            <stop offset="1" stopColor="#5ee08f" />
          </linearGradient>
          <linearGradient id="gjArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8a868" stopOpacity=".22" />
            <stop offset="1" stopColor="#e8a868" stopOpacity="0" />
          </linearGradient>
          <filter id="gjGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        {[70, 140, 210].map((y) => <line key={y} x1="20" x2={W - 20} y1={y} y2={y} className="gj-grid" />)}
        <path d={`${PATH} L492 ${H - 20} L30 ${H - 20} Z`} fill="url(#gjArea)" style={{ opacity: k }} />
        <path d={PATH} className="gj-track" />
        <path ref={path} d={PATH} className="gj-glow" stroke="url(#gjLine)" filter="url(#gjGlow)" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
        <path d={PATH} className="gj-line" stroke="url(#gjLine)" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
        {pts.map((q, i) => (
          <g key={i} className={`gj-stop${done[i] ? " on" : ""}${i === pts.length - 1 ? " last" : ""}`}>
            <circle cx={q.x} cy={q.y} r="13" className="gj-ring" />
            <circle cx={q.x} cy={q.y} r="5.5" className="gj-dot" />
          </g>
        ))}
        {head && k > 0 && k < 1 && <circle cx={head.x} cy={head.y} r="7" className="gj-head" />}
      </svg>
      <ol className="gj-stops">
        {pts.map((q, i) => (
          <li key={i} className={done[i] ? "on" : ""} style={{ left: `${(q.x / W) * 100}%`, top: `${(q.y / H) * 100}%` }} data-i={i}>
            <b>{t.stops[i]}</b>
            <span>{t.when[i]}</span>
          </li>
        ))}
      </ol>
      </div>
      <p className="gj-tag brush">{t.tag}</p>
    </div>
  );
}
