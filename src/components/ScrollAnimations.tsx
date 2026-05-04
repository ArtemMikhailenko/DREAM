"use client";
import { useEffect } from "react";

export function ScrollAnimations() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    async function init() {
      const { gsap } = await import("gsap");
      // ── FULL REWRITE MARKER ──
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {

        /* ═══════════════════════════════════════
           HERO — load animations
        ═══════════════════════════════════════ */
        const h1 = document.querySelector<HTMLElement>(".hero-h1");
        if (h1) {
          h1.innerHTML = h1.innerHTML.replace(
            /(<em>[^<]+<\/em>|[^\s<]+)/g,
            (m) =>
              `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.06em"><span class="hw" style="display:inline-block">${m}</span></span>`
          );
          gsap.from(".hero-h1 .hw", {
            yPercent: 110, skewX: 6, stagger: 0.055,
            duration: 0.88, ease: "power4.out", delay: 0.15,
          });
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-kicker",       { y: 16, opacity: 0, duration: 0.45 }, 0.08)
          .from(".hero-desc",         { y: 22, opacity: 0, duration: 0.6  }, 0.52)
          .from(".hero-actions .btn-p", { y: 20, opacity: 0, duration: 0.5 }, 0.64)
          .from(".hero-actions .btn-o", { y: 20, opacity: 0, duration: 0.5 }, 0.7)
          .from(".h-stat",            { y: 14, opacity: 0, stagger: 0.08, duration: 0.5 }, 0.72)
          .from(".hero-foot-tag",     { opacity: 0, duration: 0.4 }, 0.88);

        gsap.from(".hero-reel", { x: 70, opacity: 0, duration: 1.1, ease: "power3.out", delay: 0.08 });

        gsap.to(".hero-reel-inner img", {
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
          yPercent: -16, ease: "none",
        });
        gsap.to(".spin-badge-svg", {
          scrollTrigger: { trigger: ".hero", start: "top top", end: "+=700", scrub: 1.8 },
          rotate: "+=180", ease: "none", transformOrigin: "44px 44px",
        });
        gsap.to(".hero-decor-ring", {
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 2 },
          rotate: 45, scale: 1.18, ease: "none",
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
           PROBLEM
        ═══════════════════════════════════════ */
        gsap.from(".prob-row", {
          scrollTrigger: { trigger: ".prob-list", start: "top 80%" },
          y: 56, opacity: 0, stagger: 0.13, duration: 0.75, ease: "power3.out",
        });
        gsap.utils.toArray<HTMLElement>(".prob-n").forEach((el) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el.closest(".prob-row") ?? el, start: "top 82%" },
            scale: 0.4, opacity: 0, duration: 0.65, ease: "back.out(1.8)",
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
           PORTFOLIO — alternating x direction
        ═══════════════════════════════════════ */
        gsap.utils.toArray<HTMLElement>(".work-row").forEach((el, i) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 87%" },
            x: i % 2 === 0 ? -44 : 44, opacity: 0, duration: 0.65, ease: "power3.out",
          });
          const thumb = el.querySelector<HTMLElement>(".work-thumb");
          if (thumb) {
            gsap.from(thumb, {
              scrollTrigger: { trigger: el, start: "top 87%" },
              scale: 0.65, opacity: 0, duration: 0.5, ease: "back.out(1.6)",
            });
          }
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
           PACKAGES
        ═══════════════════════════════════════ */
        gsap.from(".pkg-row", {
          scrollTrigger: { trigger: ".pkg-list", start: "top 80%" },
          y: 32, opacity: 0, stagger: 0.12, duration: 0.65, ease: "power3.out",
        });

        /* ═══════════════════════════════════════
           ABOUT — split left/right + counter
        ═══════════════════════════════════════ */
        gsap.from(".about-copy", {
          scrollTrigger: { trigger: ".about-grid", start: "top 80%" },
          x: -60, opacity: 0, duration: 1, ease: "power3.out",
        });
        gsap.from(".about-nums", {
          scrollTrigger: { trigger: ".about-grid", start: "top 80%" },
          x: 60, opacity: 0, duration: 1, ease: "power3.out",
        });
        document.querySelectorAll<HTMLElement>(".about-num-val").forEach((el) => {
          const raw = el.textContent ?? "";
          const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
          if (isNaN(num)) return;
          const suffix = raw.match(/[^\d.]+$/)?.[0] ?? "";
          const obj = { val: 0 };
          gsap.to(obj, {
            scrollTrigger: { trigger: ".about-nums", start: "top 82%" },
            val: num, duration: 1.5, ease: "power2.out",
            onUpdate() { el.textContent = Math.round(obj.val) + suffix; },
          });
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
    }

    init();
    return () => ctx?.revert();
  }, []);

  return null;
}
