"use client";
import { useEffect, useRef } from "react";

/**
 * Hero backdrop: a slowly turning spiral galaxy of tens of thousands of glowing
 * particles (WebGL), a far star field behind it, and a camera that drifts after
 * the pointer. Particles under the cursor lift and brighten. three.js is loaded
 * on demand, so it never delays the first paint. Also writes --mx/--my (-1..1)
 * on the hero so the viewfinder frame can tilt toward the cursor.
 */
export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const hero = canvas.parentElement as HTMLElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance", stencil: false, depth: false });
      } catch { return; }
      const small = window.innerWidth < 700;
      // the glow is soft by nature, so render at 1x: on retina screens that's 4x fewer pixels to fill
      const dpr = 1;
      const nav = navigator as Navigator & { deviceMemory?: number };
      const weak = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4;
      renderer.setPixelRatio(dpr);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);
      const camBase = small ? new THREE.Vector3(0, 7.4, 6.2) : new THREE.Vector3(0, 5.6, 5.6);

      // ── galaxy ──
      const COUNT = Math.round((small ? 5000 : 14000) * (weak ? 0.6 : 1)), R = 7, BRANCHES = 4, SPIN = 1.15, RAND = 0.42, POW = 3;
      const pos = new Float32Array(COUNT * 3), rnd = new Float32Array(COUNT * 3), col = new Float32Array(COUNT * 3), scl = new Float32Array(COUNT);
      const inner = new THREE.Color("#ffc78f"), mid = new THREE.Color("#e8a868"), outer = new THREE.Color("#5f7dff");
      for (let i = 0; i < COUNT; i++) {
        const r = Math.pow(Math.random(), 1.6) * R;
        const branch = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
        const a = branch + r * SPIN;
        pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = Math.sin(a) * r;
        const j = (k: number) => Math.pow(Math.random(), POW) * (Math.random() < 0.5 ? 1 : -1) * RAND * (r * 0.6 + 0.4) * k;
        rnd[i * 3] = j(1); rnd[i * 3 + 1] = j(0.45); rnd[i * 3 + 2] = j(1);
        const t = r / R;
        const c = t < 0.35 ? inner.clone().lerp(mid, t / 0.35) : mid.clone().lerp(outer, (t - 0.35) / 0.65);
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        scl[i] = Math.random() < 0.02 ? 2.4 + Math.random() * 2 : 0.4 + Math.random() * 0.9;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aRandom", new THREE.BufferAttribute(rnd, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.setAttribute("aScale", new THREE.BufferAttribute(scl, 1));
      const uniforms = {
        uTime: { value: 0 }, uSize: { value: small ? 34 : 38 },
        uMouse: { value: new THREE.Vector3(99, 0, 99) }, uMouseOn: { value: 0 },
      };
      const mat = new THREE.ShaderMaterial({
        uniforms, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: `
          uniform float uTime; uniform float uSize; uniform vec3 uMouse; uniform float uMouseOn;
          attribute float aScale; attribute vec3 aRandom;
          varying vec3 vColor; varying float vGlow;
          void main(){
            vec4 mp = modelMatrix * vec4(position, 1.0);
            float d = length(mp.xz);
            float ang = atan(mp.z, mp.x) + uTime * (0.32 / (d + 0.9));
            mp.x = cos(ang) * d; mp.z = sin(ang) * d;
            mp.xyz += aRandom;
            vec2 dm = mp.xz - uMouse.xz; float md = length(dm);
            float f = smoothstep(1.9, 0.0, md) * uMouseOn;
            mp.y += f * 0.55; mp.xz += normalize(dm + 1e-4) * f * 0.35;
            vec4 vp = viewMatrix * mp;
            gl_Position = projectionMatrix * vp;
            gl_PointSize = uSize * aScale * (1.0 + f * 1.6) / -vp.z;
            vColor = mix(color, vec3(1.0, 0.9, 0.78), f * 0.7);
            vGlow = 0.95 + f * 0.9;
          }`,
        fragmentShader: `
          varying vec3 vColor; varying float vGlow;
          void main(){
            float s = distance(gl_PointCoord, vec2(0.5));
            float a = pow(clamp(1.0 - s * 2.0, 0.0, 1.0), 2.6);
            gl_FragColor = vec4(vColor * a * vGlow, a);
          }`,
      });
      const galaxy = new THREE.Points(geo, mat);
      galaxy.rotation.z = 0.12;
      scene.add(galaxy);

      // ── far stars ──
      const SN = small ? 400 : 900;
      const sp = new Float32Array(SN * 3);
      for (let i = 0; i < SN; i++) {
        const th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 2 - 1), rr = 40 + Math.random() * 40;
        sp[i * 3] = Math.sin(ph) * Math.cos(th) * rr; sp[i * 3 + 1] = Math.cos(ph) * rr; sp[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * rr;
      }
      const sgeo = new THREE.BufferGeometry();
      sgeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
      const stars = new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0xdfe6ff, size: 0.16, sizeAttenuation: true, transparent: true, opacity: 0.75, depthWrite: false }));
      scene.add(stars);

      // ── pointer ──
      const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const ndc = new THREE.Vector2(), hit = new THREE.Vector3(), mouseW = new THREE.Vector3(99, 0, 99);
      let inside = false, mx = 0, my = 0, emx = 0, emy = 0, lastMx = 9, lastMy = 9;
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width) * 2 - 1;
        my = -(((e.clientY - r.top) / r.height) * 2 - 1);
        inside = e.clientY >= r.top && e.clientY <= r.bottom;
      };
      const onLeave = () => { inside = false; mx = 0; my = 0; };

      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
      };
      resize();

      let raf = 0, visible = true, last = performance.now();
      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        uniforms.uTime.value += dt;
        emx += (mx - emx) * 0.05; emy += (my - emy) * 0.05;
        if (Math.abs(emx - lastMx) > 0.004 || Math.abs(emy - lastMy) > 0.004) {
          lastMx = emx; lastMy = emy;
          hero.style.setProperty("--mx", emx.toFixed(3));
          hero.style.setProperty("--my", (-emy).toFixed(3));
        }
        camera.position.set(camBase.x + emx * 0.9, camBase.y + emy * 0.5, camBase.z);
        camera.lookAt(0, -0.6, 0.4);
        stars.rotation.y += dt * 0.006;
        if (inside) {
          ndc.set(mx, my); ray.setFromCamera(ndc, camera);
          if (ray.ray.intersectPlane(plane, hit)) mouseW.lerp(hit, 0.12);
        }
        uniforms.uMouse.value.copy(mouseW);
        uniforms.uMouseOn.value += ((inside ? 1 : 0) - uniforms.uMouseOn.value) * 0.06;
        renderer.render(scene, camera);
        if (visible && !reduce) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); }
      });
      io.observe(canvas);
      window.addEventListener("resize", resize);
      if (!reduce) { hero.addEventListener("pointermove", onMove); hero.addEventListener("pointerleave", onLeave); }
      canvas.classList.add("is-on");
      cleanup = () => {
        cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize);
        hero.removeEventListener("pointermove", onMove); hero.removeEventListener("pointerleave", onLeave);
        geo.dispose(); mat.dispose(); sgeo.dispose(); renderer.dispose();
      };
    });
    return () => { disposed = true; cleanup(); };
  }, []);

  return <canvas ref={ref} className="h2-field" aria-hidden="true" />;
}

/** Camera-style running timecode for the viewfinder frame. */
export function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const ms = performance.now() - start;
      const f = Math.floor((ms / 1000) * 25) % 25;
      const s = Math.floor(ms / 1000);
      if (ref.current) ref.current.textContent = `00:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
      raf = requestAnimationFrame(tick);
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={ref} className="h2-tc">00:00:00:00</span>;
}
