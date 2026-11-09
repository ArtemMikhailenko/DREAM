"use client";
import { useEffect, useRef, useState } from "react";

export const INTRO_EVENT = "dc:intro-done";

/**
 * Entry animation on every fresh load of the home page: the dc.production logo
 * appears in the middle of a dark screen (blur to sharp, the script line writes
 * itself, a light sweeps across), then flies into its place in the hero while
 * the dark screen dissolves and the rest of the page comes in around it.
 * Skipped for reduced motion or when the page opens scrolled down.
 */
export function IntroDissolve() {
  const [show, setShow] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const done = () => {
      html.classList.remove("intro-hold");
      (window as unknown as { __dcIntroDone?: boolean }).__dcIntroDone = true;
      window.dispatchEvent(new Event(INTRO_EVENT));
    };
    const target = document.querySelector<HTMLElement>(".h2-word");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !target || window.scrollY > 40 || !stage.current || !logo.current) { setShow(false); done(); return; }

    html.classList.add("intro-hold", "intro-played");
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    // put a copy of the hero logo exactly where the real one sits, then pull it to the centre
    const copy = target.cloneNode(true) as HTMLElement;
    copy.classList.add("intro-word");
    copy.style.translate = "none";
    logo.current.appendChild(copy);
    const r = target.getBoundingClientRect();
    const box = logo.current;
    Object.assign(box.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    const dx = window.innerWidth / 2 - (r.left + r.width / 2);
    const dy = window.innerHeight / 2 - (r.top + r.height / 2);
    const scale = window.innerWidth < 700 ? 1.08 : 1.12;
    box.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

    const timers: number[] = [];
    const phone = window.innerWidth < 700;
    const T_IN = 0, T_FLY = phone ? 1500 : 1750, T_END = T_FLY + 900;
    timers.push(window.setTimeout(() => stage.current?.classList.add("is-in"), T_IN + 30));
    timers.push(window.setTimeout(() => {
      box.style.transform = "translate(0px, 0px) scale(1)";
      stage.current?.classList.add("is-flying");
      html.classList.remove("intro-hold"); // the rest of the hero starts its entrance now
    }, T_FLY));
    timers.push(window.setTimeout(() => {
      html.style.overflow = prevOverflow;
      html.classList.add("intro-landed");
      setShow(false);
      done();
    }, T_END));
    return () => { timers.forEach((t) => window.clearTimeout(t)); html.style.overflow = prevOverflow; };
  }, []);

  if (!show) return null;
  return (
    <div className="intro2" ref={stage} aria-hidden="true">
      <div className="intro2-glow" />
      <div className="intro2-logo" ref={logo} />
    </div>
  );
}
