"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { LeadButton } from "@/components/home/LeadButton";

/*
 * Ad budget → leads estimate. The cost of a lead comes from our own Meta
 * campaigns (the result screenshots on this page): ₪74.5K spent for 4,288
 * leads and conversations, about ₪17 each; most campaigns land between ₪12 and
 * ₪24. Clients assume 10–20% of leads close. It is an estimate, and says so.
 */
const CPL_LOW = 12, CPL_MID = 17, CPL_HIGH = 24;
const CLOSE_LOW = 0.1, CLOSE_HIGH = 0.2;
const MIN = 30, MAX = 500, STEP = 10;

const T = {
  ru: {
    label: "Калькулятор", h: "Сколько заявок", em: "даст ваш бюджет",
    sub: "Двигайте ползунок: посчитаем по средней цене заявки в наших кампаниях",
    perDay: "Бюджет в день", perMonth: "в месяц", leads: "заявок в месяц", clients: "новых клиентов",
    cpl: "средняя цена заявки", weeks: ["1 нед", "2 нед", "3 нед", "4 нед"],
    note: "Оценка по нашим кампаниям в Meta: ₪74.5K бюджета, 4 288 заявок и обращений. Точная цифра зависит от ниши и предложения",
    cta: "Получить точный расчёт",
  },
  he: {
    label: "מחשבון", h: "כמה לידים", em: "התקציב שלכם יביא",
    sub: "הזיזו את הסליידר: נחשב לפי המחיר הממוצע לליד בקמפיינים שלנו",
    perDay: "תקציב ליום", perMonth: "בחודש", leads: "לידים בחודש", clients: "לקוחות חדשים",
    cpl: "מחיר ממוצע לליד", weeks: ["שבוע 1", "שבוע 2", "שבוע 3", "שבוע 4"],
    note: "הערכה לפי הקמפיינים שלנו במטא: ₪74.5K תקציב, 4,288 לידים ופניות. המספר המדויק תלוי בתחום ובהצעה",
    cta: "לקבל חישוב מדויק",
  },
  es: {
    label: "Calculadora", h: "Cuántos clientes", em: "trae tu presupuesto",
    sub: "Mueve el control: calculamos con el precio medio por lead de nuestras campañas",
    perDay: "Presupuesto diario", perMonth: "al mes", leads: "leads al mes", clients: "clientes nuevos",
    cpl: "precio medio por lead", weeks: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    note: "Estimación basada en nuestras campañas en Meta: ₪74.5K de presupuesto, 4.288 leads y conversaciones. La cifra exacta depende de tu sector y tu oferta",
    cta: "Calcular mi caso",
  },
  en: {
    label: "Calculator", h: "How many leads", em: "your budget brings",
    sub: "Move the slider: we count by the average lead price in our campaigns",
    perDay: "Budget per day", perMonth: "per month", leads: "leads a month", clients: "new customers",
    cpl: "average lead price", weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],
    note: "Estimate from our Meta campaigns: ₪74.5K spent, 4,288 leads and conversations. The exact figure depends on your niche and offer",
    cta: "Get an exact estimate",
  },
} as const;

const fmt = (n: number, loc: string) => Math.round(n).toLocaleString(loc === "he" ? "he-IL" : loc === "ru" ? "ru-RU" : loc === "es" ? "es-ES" : "en-US");

/** Number that eases to its new value instead of jumping. */
function Rolling({ value, locale }: { value: number; locale: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now(), a = from.current, b = value;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 420);
      const v = a + (b - a) * (1 - Math.pow(1 - k, 3));
      setShown(v); from.current = v;
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{fmt(shown, locale)}</>;
}

export function BudgetCalc({ locale }: { locale: string }) {
  const t = T[(locale as keyof typeof T)] ?? T.en;
  const [day, setDay] = useState(100);
  const [seen, setSeen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const month = day * 30;
  const leadsLo = month / CPL_HIGH, leadsHi = month / CPL_LOW, leadsMid = month / CPL_MID;
  const clientsLo = leadsLo * CLOSE_LOW, clientsHi = leadsHi * CLOSE_HIGH;
  const pct = ((day - MIN) / (MAX - MIN)) * 100;

  // cumulative leads by week (the line grows; the band shows low–high)
  const W = 600, H = 220, P = 18;
  const top = Math.max(leadsHi * 1.15, 120); // the curve always fills the chart; the numbers carry the size
  const pts = useMemo(() => [0, 1, 2, 3, 4].map((w) => {
    const x = P + (w / 4) * (W - P * 2);
    const y = (v: number) => H - P - (v / top) * (H - P * 2);
    const ramp = w === 0 ? 0 : Math.min(1, 0.55 + w * 0.15) * (w / 4); // first week learns, then it speeds up
    return { x, lo: y(leadsLo * ramp), mid: y(leadsMid * ramp), hi: y(leadsHi * ramp) };
  }), [leadsLo, leadsMid, leadsHi, top]); // eslint-disable-line react-hooks/exhaustive-deps
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.mid.toFixed(1)}`).join(" ");
  const band = `${pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.hi.toFixed(1)}`).join(" ")} ${[...pts].reverse().map((p) => `L${p.x.toFixed(1)},${p.lo.toFixed(1)}`).join(" ")} Z`;
  const area = `${line} L${pts[4].x},${H - P} L${pts[0].x},${H - P} Z`;

  return (
    <div className={`bc${seen ? " is-seen" : ""}`} ref={root}>
      <div className="bc-ctl">
        <div className="bc-day">
          <span className="bc-k">{t.perDay}</span>
          <b className="bc-day-v">₪<Rolling value={day} locale={locale} /></b>
          <span className="bc-month">₪<Rolling value={month} locale={locale} /> {t.perMonth}</span>
        </div>
        <input
          className="bc-range"
          type="range" min={MIN} max={MAX} step={STEP} value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          aria-label={t.perDay}
          style={{ ["--p" as string]: `${pct}%` }}
        />
        <div className="bc-scale" aria-hidden="true"><span>₪{MIN}</span><span>₪{MAX}</span></div>
        <div className="bc-out">
          <div className="bc-out-i is-main">
            <b><Rolling value={leadsLo} locale={locale} />–<Rolling value={leadsHi} locale={locale} /></b>
            <span>{t.leads}</span>
          </div>
          <div className="bc-out-i">
            <b>≈ <Rolling value={Math.max(1, clientsLo)} locale={locale} />–<Rolling value={Math.max(1, clientsHi)} locale={locale} /></b>
            <span>{t.clients}</span>
          </div>
          <div className="bc-out-i">
            <b>₪{CPL_LOW}–{CPL_HIGH}</b>
            <span>{t.cpl}</span>
          </div>
        </div>
        <LeadButton className="bc-cta glass-btn cta-pulse">{t.cta}</LeadButton>
      </div>
      <div className="bc-chart">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="bcArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e8a868" stopOpacity=".42" />
              <stop offset="1" stopColor="#e8a868" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={P} x2={W - P} y1={P + g * (H - P * 2)} y2={P + g * (H - P * 2)} className="bc-grid" />)}
          <path d={band} className="bc-band" />
          <path d={area} fill="url(#bcArea)" className="bc-area" />
          <path d={line} className="bc-line" pathLength={1} />
          {pts.slice(1).map((p, i) => <circle key={i} cx={p.x} cy={p.mid} r="5" className="bc-dot" style={{ ["--d" as string]: `${0.5 + i * 0.18}s` }} />)}
        </svg>
        <div className="bc-weeks" aria-hidden="true">{t.weeks.map((w) => <span key={w}>{w}</span>)}</div>
      </div>
      <p className="bc-note">{t.note}</p>
    </div>
  );
}
