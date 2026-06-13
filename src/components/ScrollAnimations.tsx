"use client";
import { useEffect } from "react";

export function ScrollAnimations() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    // Reveal failsafe — set up SYNCHRONOUSLY (independent of the async GSAP import).
    // After a soft <Link> navigation ScrollTrigger sometimes never fires, leaving
    // headings/labels stuck (clip-path / opacity:0) until a hard reload. This sweeps
    // in-view targets still hidden and reveals them with a plain CSS transition — no
    // GSAP dependency, so it works even if the gsap import is slow or a trigger is dead.
    const REVEAL_SEL =
      ".label,.sec-h,.page-hero-h,.portfolio-case,.case-col,.faq-item,.rev-item,.svc-row,.problem-row,.process-step,.pkg-card";
    const revealStuck = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(REVEAL_SEL).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh * 0.82) return; // not solidly in view — let GSAP play
        const cs = getComputedStyle(el);
        if (parseFloat(cs.opacity) < 0.05 || cs.clipPath.includes("100%")) {
          el.style.transition = "opacity .5s ease, clip-path .5s ease, transform .5s ease";
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.clipPath = "inset(0px 0px 0px 0px)";
        }
      });
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { revealStuck(); ticking = false; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const sweepTimers = [350, 900, 1800, 3200].map((t) => window.setTimeout(revealStuck, t));

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {

        /* ═══════════════════════════════════════
           HERO — load animations
        ═══════════════════════════════════════ */
        // Simple whole-headline reveal — no per-word clip masks, so the metallic
        // 3D-extrude treatment on .hero-h1 isn't clipped.
        const h1 = document.querySelector<HTMLElement>(".hero-h1");
        if (h1) {
          gsap.from(h1, { y: 28, opacity: 0, duration: 0.9, ease: "power4.out", delay: 0.15 });
          gsap.from(".hero-h1-arrow", {
            scaleX: 0, transformOrigin: "left center",
            duration: 0.85, ease: "power3.out", delay: 0.55,
          });
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-kicker",         { y: 16, opacity: 0, duration: 0.45 }, 0.08)
          .from(".hero-desc",           { y: 22, opacity: 0, duration: 0.6  }, 0.52)
          .from(".hero .hero-actions .btn-p", { y: 20, opacity: 0, duration: 0.5  }, 0.64)
          .from(".hero .hero-actions .btn-o", { y: 20, opacity: 0, duration: 0.5  }, 0.72);

        gsap.from(".hero-rail", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.45 });
        gsap.from(".hero-rail li", { x: 16, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", delay: 0.65 });

        // subtle parallax on hero bg + dim on scroll
        gsap.to(".hero-bg img", {
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
          yPercent: 12, scale: 1.08, ease: "none",
        });

        /* ═══════════════════════════════════════
           SECTION HEADINGS — clip-path wipe
        ═══════════════════════════════════════ */
        gsap.utils.toArray<HTMLElement>(".sec-h").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 1.15, ease: "power4.inOut",
              scrollTrigger: { trigger: el, start: "top 88%" } }
          );
        });
        gsap.utils.toArray<HTMLElement>(".label").forEach((el) => {
          gsap.from(el, {
            x: -28, opacity: 0, duration: 0.5, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          });
        });

        /* ═══════════════════════════════════════
           PROBLEM — editorial rows
        ═══════════════════════════════════════ */
        gsap.utils.toArray<HTMLElement>(".problem-row").forEach((row, i) => {
          gsap.from(row.querySelector(".problem-row-n"), {
            scrollTrigger: { trigger: row, start: "top 88%" },
            opacity: 0, duration: 0.5, ease: "power2.out",
          });
          gsap.from(row.querySelector(".problem-row-title"), {
            scrollTrigger: { trigger: row, start: "top 88%" },
            x: -40, opacity: 0, duration: 0.75, delay: 0.05, ease: "power3.out",
          });
          gsap.from(row.querySelector(".problem-row-desc"), {
            scrollTrigger: { trigger: row, start: "top 88%" },
            x: 30, opacity: 0, duration: 0.7, delay: 0.12, ease: "power3.out",
          });
        });

        /* Border draw on scroll */
        document.querySelectorAll<HTMLElement>(".problem-row").forEach((row) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 91%",
            onEnter: () => row.classList.add("drawn"),
          });
        });

        /* ═══════════════════════════════════════
           SERVICES
        ═══════════════════════════════════════ */
        gsap.from(".svc-row", {
          scrollTrigger: { trigger: ".svc-list", start: "top 78%" },
          x: 50, opacity: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        });
        gsap.utils.toArray<HTMLElement>(".svc-side-img").forEach((el, i) => {
          gsap.from(el, {
            scrollTrigger: { trigger: ".svc-layout", start: "top 85%" },
            scale: 1.1, opacity: 0, duration: 0.9, delay: i * 0.15, ease: "power3.out",
          });
          gsap.to(el, {
            scrollTrigger: { trigger: ".svc-layout", scrub: 2 },
            y: i === 0 ? -70 : 50, ease: "none",
          });
        });

        /* ═══════════════════════════════════════
           PROCESS STEPS — dot timeline
        ═══════════════════════════════════════ */
        gsap.from(".process-step", {
          scrollTrigger: { trigger: ".process-steps", start: "top 80%" },
          y: 36, opacity: 0, stagger: 0.07, duration: 0.6, ease: "power3.out",
        });
        gsap.from(".process-step-dot", {
          scrollTrigger: { trigger: ".process-steps", start: "top 80%" },
          opacity: 0, y: 6, stagger: 0.07, duration: 0.45, delay: 0.15, ease: "power2.out",
        });
        gsap.from(".process-track-line", {
          scrollTrigger: { trigger: ".process-wrap", start: "top 80%" },
          scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power3.inOut",
        });

        /* ═══════════════════════════════════════
           STATEMENT section
        ═══════════════════════════════════════ */
        gsap.from(".statement-h", {
          scrollTrigger: { trigger: ".s-statement", start: "top 75%" },
          y: 60, opacity: 0, duration: 1.1, ease: "power4.out",
        });
        gsap.from(".statement-cta", {
          scrollTrigger: { trigger: ".s-statement", start: "top 65%" },
          y: 20, opacity: 0, duration: 0.6, ease: "power3.out",
        });

        /* ═══════════════════════════════════════
           PORTFOLIO BENTO
        ═══════════════════════════════════════ */
        gsap.utils.toArray<HTMLElement>(".portfolio-case").forEach((el, i) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 88%" },
            scale: 0.94, opacity: 0, duration: 0.75,
            delay: i * 0.1, ease: "power3.out",
          });
        });

        /* ═══════════════════════════════════════
           PORTFOLIO — 3D card tilt
        ═══════════════════════════════════════ */
        gsap.utils.toArray<HTMLElement>(".portfolio-case").forEach((card) => {
          card.addEventListener("mousemove", (e) => {
            const ev = e as MouseEvent;
            const r  = card.getBoundingClientRect();
            const dx = (ev.clientX - r.left - r.width  / 2) / (r.width  / 2);
            const dy = (ev.clientY - r.top  - r.height / 2) / (r.height / 2);
            gsap.to(card, { rotateY: dx * 10, rotateX: -dy * 6, transformPerspective: 900, duration: 0.35, ease: "power2.out" });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "elastic.out(1,0.55)" });
          });
        });

        /* ═══════════════════════════════════════
           CASES — pop up + counter
        ═══════════════════════════════════════ */
        gsap.from(".case-col", {
          scrollTrigger: { trigger: ".cases-strip", start: "top 78%" },
          y: 70, opacity: 0, stagger: 0.14, duration: 0.9, ease: "power3.out",
        });
        document.querySelectorAll<HTMLElement>(".case-col-val").forEach((el) => {
          const raw = el.textContent ?? "";
          const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
          if (isNaN(num)) return;
          const prefix = raw.match(/^[^\d]*/)?.[0] ?? "";
          const suffix = raw.match(/[^\d.]+$/)?.[0] ?? "";
          const obj = { val: 0 };
          gsap.to(obj, {
            scrollTrigger: { trigger: ".cases-strip", start: "top 80%" },
            val: num, duration: 1.8, ease: "power2.out",
            onUpdate() { el.textContent = prefix + Math.round(obj.val) + suffix; },
          });
        });

        /* ═══════════════════════════════════════
           PRICING CARDS + row stagger
        ═══════════════════════════════════════ */
        // cards rise from different levels — side cards shallow, featured one deeper
        const pkgOffsets = [80, 150, 80];
        gsap.utils.toArray<HTMLElement>(".pkg-card").forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: { trigger: ".pkg-cards", start: "top 82%" },
            y: pkgOffsets[i] ?? 80, opacity: 0,
            duration: 0.95, delay: i * 0.12, ease: "power3.out",
          });
        });
        gsap.utils.toArray<HTMLElement>(".pkg-card").forEach((card) => {
          const rows = card.querySelectorAll<HTMLElement>(".pkg-rows-li");
          if (rows.length) {
            gsap.from(rows, {
              scrollTrigger: { trigger: card, start: "top 78%" },
              x: -20, opacity: 0, stagger: 0.06, duration: 0.5, ease: "power2.out", delay: 0.2,
            });
          }
        });



        /* ═══════════════════════════════════════
           REVIEWS
        ═══════════════════════════════════════ */
        gsap.utils.toArray<HTMLElement>(".rev-item").forEach((el) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 84%" },
            y: 50, opacity: 0, duration: 0.85, ease: "power3.out",
          });
          const qmark = el.querySelector<HTMLElement>(".rev-qmark");
          if (qmark) {
            gsap.from(qmark, {
              scrollTrigger: { trigger: el, start: "top 84%" },
              scale: 0.3, opacity: 0, duration: 0.7, delay: 0.2, ease: "back.out(2.5)",
            });
          }
        });

        /* ═══════════════════════════════════════
           FAQ
        ═══════════════════════════════════════ */
        gsap.from(".faq-item", {
          scrollTrigger: { trigger: ".faq-wrap", start: "top 82%" },
          y: 22, opacity: 0, stagger: 0.08, duration: 0.55, ease: "power2.out",
        });

        /* ═══════════════════════════════════════
           MAGNETIC BUTTONS
        ═══════════════════════════════════════ */
        document.querySelectorAll<HTMLElement>(".btn-p, .btn-o, .nav-cta").forEach((btn) => {
          const onMove = (e: MouseEvent) => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * 0.3;
            const y = (e.clientY - r.top - r.height / 2) * 0.3;
            gsap.to(btn, { x, y, duration: 0.3, ease: "power2.out" });
          };
          const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
          btn.addEventListener("mousemove", onMove);
          btn.addEventListener("mouseleave", onLeave);
        });
      });

      // Recompute trigger positions after layout settles. On client-side route
      // transitions (Next <Link>) the "load" event never refires and layout/images
      // settle a frame or two late, so a single refresh latches stale positions and
      // in-view triggers never fire — leaving content stuck at opacity:0 until a hard
      // reload. Refresh across a double rAF, several timeouts, and each image load.
      const refresh = () => ScrollTrigger.refresh();
      requestAnimationFrame(() => requestAnimationFrame(refresh));
      const onLoad = () => refresh();
      window.addEventListener("load", onLoad);
      const timers = [120, 400, 900, 1600].map((t) => window.setTimeout(refresh, t));
      const pendingImgs = Array.from(document.querySelectorAll("img")).filter((im) => !im.complete);
      pendingImgs.forEach((im) => im.addEventListener("load", refresh, { once: true }));

      cleanupExtras = () => {
        window.removeEventListener("load", onLoad);
        timers.forEach((t) => window.clearTimeout(t));
        pendingImgs.forEach((im) => im.removeEventListener("load", refresh));
      };
    }

    let cleanupExtras: (() => void) | undefined;
    init();
    return () => {
      window.removeEventListener("scroll", onScroll);
      sweepTimers.forEach((t) => window.clearTimeout(t));
      cleanupExtras?.();
      ctx?.revert();
    };
  }, []);

  return null;
}
