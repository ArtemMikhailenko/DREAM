"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Seven-step process. On first view a glowing marker travels the rail: it runs
 * to the shoot (step 4), where the dot blinks red like a camera on REC, holds
 * there, then runs on to the last step — and the whole rail flashes in the
 * accent colour: mission complete. Any step opens (hover / tap) for a short note.
 */
export function ProcessSteps({ steps }: { steps: { name: string; desc: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [lit, setLit] = useState(-1);
  const [active, setActive] = useState(0);
  const [rec, setRec] = useState(-1);
  const [done, setDone] = useState(false);
  const touched = useRef(false);
  const at = useRef(0);

  // put the marker (and the filled part of the rail) on step i
  const place = useCallback((i: number, animate = true) => {
    const el = root.current, m = marker.current, f = fill.current;
    if (!el || !m || !f) return;
    const dot = el.querySelectorAll<HTMLElement>(".ps-dot")[i];
    if (!dot) return;
    const box = el.getBoundingClientRect(), d = dot.getBoundingClientRect();
    const vertical = window.matchMedia("(max-width:820px)").matches;
    const rtl = getComputedStyle(el).direction === "rtl";
    m.style.transition = f.style.transition = animate ? "" : "none";
    if (vertical) {
      const y = d.top + d.height / 2 - box.top;
      m.style.transform = `translate(${d.left + d.width / 2 - box.left}px, ${y}px)`;
      f.style.transform = `scaleY(${y / box.height})`;
    } else {
      const x = d.left + d.width / 2 - box.left;
      m.style.transform = `translate(${x}px, ${d.top + d.height / 2 - box.top}px)`;
      f.style.transform = `scaleX(${(rtl ? box.width - x : x) / box.width})`;
    }
    at.current = i;
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    place(0, false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (reduce) { setLit(steps.length - 1); place(steps.length - 1, false); setDone(true); return; }
      const STEP = 560, TRAVEL = 440, HOLD = 1700;
      const pause = Math.min(3, steps.length - 1);
      setLit(0);
      let t = 300;
      for (let i = 1; i < steps.length; i++) {
        const at = t;
        timers.push(window.setTimeout(() => { setRec(-1); place(i); }, at));
        timers.push(window.setTimeout(() => {
          setLit(i);
          if (!touched.current) setActive(i);
          if (i === pause) setRec(i);
        }, at + TRAVEL));
        t += STEP + (i === pause ? HOLD : 0);
      }
      timers.push(window.setTimeout(() => setDone(true), t + 200));
    }, { threshold: 0.5 });
    io.observe(el);
    const onResize = () => place(at.current, false);
    window.addEventListener("resize", onResize);
    return () => { io.disconnect(); timers.forEach(clearTimeout); window.removeEventListener("resize", onResize); };
  }, [steps, place]);

  const pick = (i: number) => { touched.current = true; setActive(i); };

  return (
    <div className={`ps${done ? " is-done" : ""}`} ref={root} style={{ ["--n" as string]: steps.length }}>
      <div className="ps-rail" aria-hidden="true"><span className="ps-fill" ref={fill} /></div>
      <span className="ps-marker" ref={marker} aria-hidden="true" />
      <ol className="ps-list" role="tablist">
        {steps.map((s, i) => (
          <li key={s.name} className="ps-item">
            <button
              type="button"
              role="tab"
              id={`ps-tab-${i}`}
              aria-selected={active === i}
              aria-controls="ps-panel"
              className={`ps-step${i <= lit ? " lit" : ""}${active === i ? " on" : ""}${rec === i ? " rec" : ""}`}
              onClick={() => pick(i)}
              onMouseEnter={() => pick(i)}
            >
              <span className="ps-dot" aria-hidden="true" />
              <span className="ps-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="ps-name">{s.name}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="ps-panel" id="ps-panel" role="tabpanel" aria-labelledby={`ps-tab-${active}`}>
        <span className="ps-panel-n">{String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
        <p className="ps-panel-name">{steps[active]?.name}</p>
        <p className="ps-panel-desc" key={active}>{steps[active]?.desc}</p>
      </div>
    </div>
  );
}
