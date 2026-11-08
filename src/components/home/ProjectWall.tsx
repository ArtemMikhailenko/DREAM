import { CASE_IMAGES } from "@/lib/portfolio";

export type WallCase = { title: string; tag: string; client?: string; result?: string; image?: string };

/**
 * Two rows of project cards drifting in opposite directions on a slight tilt —
 * photo cards and result cards alternate. Pure CSS; pauses on hover.
 * Fed from the portfolio cases in the CMS, so swapping in real photos there
 * updates this wall too.
 */
export function ProjectWall({ cases, label }: { cases: WallCase[]; label: string }) {
  if (!cases.length) return null;
  const rowA = cases.map((c, i) => ({ c, i, kind: i % 2 === 0 ? "photo" : "text" }));
  const rowB = [...cases].reverse().map((c, k) => ({ c, i: cases.length - 1 - k, kind: k % 2 === 0 ? "text" : "photo" }));

  const card = ({ c, i, kind }: { c: WallCase; i: number; kind: string }, key: string) => (
    <article className={`pw-card pw-${kind}`} key={key}>
      {kind === "photo" ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.image ?? CASE_IMAGES[i % CASE_IMAGES.length]} alt="" loading="lazy" decoding="async" />
          <span className="pw-tag">{c.tag}</span>
          <p className="pw-title">{c.title}</p>
        </>
      ) : (
        <>
          <span className="pw-tag">{c.tag}</span>
          <p className="pw-quote">{c.result ?? c.title}</p>
          <p className="pw-by"><i aria-hidden="true" />{c.client ?? c.title}</p>
        </>
      )}
    </article>
  );

  return (
    <div className="pw" aria-label={label}>
      <p className="pw-label">{label}</p>
      <div className="pw-stage">
        <div className="pw-row">
          <div className="pw-track">{[...rowA, ...rowA].map((x, k) => card(x, `a${k}`))}</div>
        </div>
        <div className="pw-row pw-rev">
          <div className="pw-track">{[...rowB, ...rowB].map((x, k) => card(x, `b${k}`))}</div>
        </div>
      </div>
    </div>
  );
}
