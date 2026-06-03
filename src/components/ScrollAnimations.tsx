"use client";
import { useEffect } from "react";

export function ScrollAnimations() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {

        /* ═══════════════════════════════════════
           HERO — load animations
        ═══════════════════════════════════════ */
        const h1 = document.querySelector<HTMLElement>(".hero-h1");
        if (h1) {
          // Walk text nodes only — leaves <br>, <span class="hero-h1-arrow"/>, <em> children intact.
          // Wrap each visible word in a clip-mask span for the reveal animation.
          const wrapWord = (w: string) =>
            `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.08em"><span class="hw" style="display:inline-block">${w}</span></span>`;
          const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
          const textNodes: Text[] = [];
          let t: Node | null;
          while ((t = walker.nextNode())) textNodes.push(t as Text);
          textNodes.forEach((tn) => {
            const raw = tn.nodeValue ?? "";
            if (!raw.trim()) return;
            const html = raw.replace(/\S+/g, (w) => wrapWord(w));
            const tpl = document.createElement("span");
            tpl.innerHTML = html;
            tn.replaceWith(...Array.from(tpl.childNodes));
          });
          // <em> blocks also need to slide in as a single unit
          h1.querySelectorAll<HTMLElement>("em").forEach((emEl) => {
            const inner = emEl.innerHTML;
            emEl.innerHTML = `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.08em"><span class="hw" style="display:inline-block">${inner}</span></span>`;
          });
          gsap.from(".hero-h1 .hw", {
            yPercent: 110, skewX: 6, stagger: 0.055,
            duration: 0.88, ease: "power4.out", delay: 0.15,
          });
          gsap.from(".hero-h1-arrow", {
            scaleX: 0, transformOrigin: "left center",
            duration: 0.85, ease: "power3.out", delay: 0.55,
          });
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-kicker",         { y: 16, opacity: 0, duration: 0.45 }, 0.08)
          .from(".hero-desc",           { y: 22, opacity: 0, duration: 0.6  }, 0.52)
          .from(".hero-actions .btn-p", { y: 20, opacity: 0, duration: 0.5  }, 0.64)
          .from(".hero-actions .btn-o", { y: 20, opacity: 0, duration: 0.5  }, 0.72);

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
           SERVICES — cursor image follower
        ═══════════════════════════════════════ */
        const svcFollower = document.getElementById("svc-follower");
        const svcFollowerImg = document.getElementById("svc-follower-img") as HTMLImageElement | null;
        if (svcFollower && svcFollowerImg) {
          document.querySelectorAll<HTMLElement>(".svc-row").forEach((row) => {
            row.addEventListener("mouseenter", () => {
              const src = row.dataset.img;
              if (src && svcFollowerImg.getAttribute("src") !== src) svcFollowerImg.src = src;
              svcFollower.classList.add("active");
            });
            row.addEventListener("mouseleave", () => {
              svcFollower.classList.remove("active");
            });
          });
          document.getElementById("services")?.addEventListener("mouseleave", () => {
            svcFollower.classList.remove("active");
          });
          document.getElementById("services")?.addEventListener("mousemove", (e) => {
            const me = e as MouseEvent;
            gsap.to(svcFollower, { x: me.clientX + 28, y: me.clientY - 40, duration: 0.55, ease: "power3.out" });
          });
        }

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
        gsap.from(".pkg-card", {
          scrollTrigger: { trigger: ".pkg-cards", start: "top 80%" },
          y: 50, opacity: 0, stagger: 0.14, duration: 0.8, ease: "power3.out",
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

      // Recompute trigger positions after layout settles (fixes client-side route
      // transitions where ScrollTrigger latches stale positions and triggers never fire).
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      const tRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
      cleanupExtras = () => {
        window.removeEventListener("load", onLoad);
        window.clearTimeout(tRefresh);
      };
    }

    let cleanupExtras: (() => void) | undefined;
    init();
    return () => {
      cleanupExtras?.();
      ctx?.revert();
    };
  }, []);

  return null;
}
