"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Seven-step process. The rail fills once when the block scrolls into view and
 * lights the steps one after another; any step can be opened for a short note.
 */
export function ProcessSteps({ steps }: { steps: { name: string; desc: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(-1);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const touchedRef = useRef(false);
  touchedRef.current = touched;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.classList.add("is-filling");
      if (reduce) { setLit(steps.length - 1); return; }
      steps.forEach((_, i) => timers.push(window.setTimeout(() => {
        setLit(i);
        setActive((a) => (touchedRef.current ? a : i));
      }, 180 + i * 230)));
    }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); timers.forEach((t) => window.clearTimeout(t)); };
  }, [steps]);

  const pick = (i: number) => { setTouched(true); setActive(i); };

  return (
    <div className="ps" ref={root} style={{ ["--n" as string]: steps.length }}>
      <div className="ps-rail" aria-hidden="true"><span className="ps-fill" /></div>
      <ol className="ps-list" role="tablist">
        {steps.map((s, i) => (
          <li key={s.name} className="ps-item">
            <button
              type="button"
              role="tab"
              id={`ps-tab-${i}`}
              aria-selected={active === i}
              aria-controls="ps-panel"
              className={`ps-step${i <= lit ? " lit" : ""}${active === i ? " on" : ""}`}
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
