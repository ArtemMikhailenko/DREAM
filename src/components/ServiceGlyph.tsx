import type { ReactNode } from "react";

// Bold line glyphs — one signature mark per service. Stroke uses currentColor.
const GLYPHS: Record<string, ReactNode> = {
  seo: (
    <>
      <circle cx="40" cy="40" r="21" />
      <line x1="55" y1="55" x2="80" y2="80" />
      <path d="M31 47 L40 38 L46 44 L54 33" />
      <path d="M54 40 V33 H47" />
    </>
  ),
  "targeted-advertising": (
    <>
      <circle cx="48" cy="48" r="30" />
      <circle cx="48" cy="48" r="17" />
      <circle cx="48" cy="48" r="5.5" fill="currentColor" stroke="none" />
      <line x1="48" y1="6" x2="48" y2="20" />
      <line x1="48" y1="76" x2="48" y2="90" />
      <line x1="6" y1="48" x2="20" y2="48" />
      <line x1="76" y1="48" x2="90" y2="48" />
    </>
  ),
  smm: (
    <>
      <path d="M22 28 h44 a6 6 0 0 1 6 6 v24 a6 6 0 0 1 -6 6 H42 l-14 12 v-12 h-6 a6 6 0 0 1 -6 -6 V34 a6 6 0 0 1 6 -6 Z" />
      <circle cx="36" cy="46" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="48" cy="46" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="60" cy="46" r="2.6" fill="currentColor" stroke="none" />
    </>
  ),
  "google-ads": (
    <>
      <path d="M30 26 L30 70 L42 58 L50 74 L58 70 L50 54 L66 54 Z" />
      <path d="M64 30 a10 10 0 0 1 0 20" />
      <path d="M70 24 a18 18 0 0 1 0 32" />
    </>
  ),
  "photo-video": (
    <>
      <path d="M18 36 h12 l5 -7 h26 l5 7 h12 a4 4 0 0 1 4 4 v30 a4 4 0 0 1 -4 4 H18 a4 4 0 0 1 -4 -4 V40 a4 4 0 0 1 4 -4 Z" />
      <circle cx="48" cy="55" r="12" />
      <circle cx="48" cy="55" r="4" fill="currentColor" stroke="none" />
    </>
  ),
  "marketing-strategy": (
    <>
      <path d="M18 24 H78 L55 52 V76 L41 68 V52 Z" />
    </>
  ),
  "website-development": (
    <>
      <rect x="16" y="24" width="64" height="48" rx="7" />
      <line x1="16" y1="39" x2="80" y2="39" />
      <circle cx="25" cy="31.5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="33" cy="31.5" r="1.8" fill="currentColor" stroke="none" />
      <polyline points="41,50 34,56 41,62" />
      <polyline points="55,50 62,56 55,62" />
    </>
  ),
  automation: (
    <>
      <rect x="26" y="36" width="44" height="34" rx="9" />
      <line x1="48" y1="24" x2="48" y2="36" />
      <circle cx="48" cy="21" r="3.2" />
      <circle cx="40" cy="52" r="3.6" fill="currentColor" stroke="none" />
      <circle cx="56" cy="52" r="3.6" fill="currentColor" stroke="none" />
      <line x1="42" y1="62" x2="54" y2="62" />
      <line x1="26" y1="48" x2="18" y2="48" />
      <line x1="70" y1="48" x2="78" y2="48" />
    </>
  ),
  "geo-ai-seo": (
    <>
      <path d="M48 16 C51 38 58 45 80 48 C58 51 51 58 48 80 C45 58 38 51 16 48 C38 45 45 38 48 16 Z" />
      <circle cx="74" cy="24" r="3" fill="currentColor" stroke="none" />
      <circle cx="24" cy="70" r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
};

export function ServiceGlyph({ slug }: { slug: string }) {
  const paths = GLYPHS[slug] ?? GLYPHS.seo;
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
