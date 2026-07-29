"use client";

import { useState } from "react";
import type { MediaItem } from "@/studio/lib/media";

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — ignore */
    }
  };
  return (
    <button type="button" className="st-btn st-media-copy" onClick={copy} style={{ justifyContent: "center" }}>
      {copied ? "✓ Скопировано" : "Копировать ссылку"}
    </button>
  );
}

const kb = (n: number) => (n >= 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + " МБ" : Math.round(n / 1024) + " КБ");

export function MediaGrid({ items }: { items: MediaItem[] }) {
  if (items.length === 0) {
    return <div className="st-card st-empty"><div className="st-empty-ic">🖼️</div>Медиатека пуста</div>;
  }
  return (
    <div className="st-media-grid">
      {items.map((m) => (
        <div className="st-media-card" key={m.id}>
          <a className="st-media-thumb" href={m.url} target="_blank" rel="noopener">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {m.thumbUrl ? <img src={m.thumbUrl} alt={m.filename} loading="lazy" /> : <span style={{ color: "var(--s-faint)" }}>нет превью</span>}
          </a>
          <div className="st-media-meta">
            <div className="st-media-name" title={m.filename}>{m.filename || "—"}</div>
            <div className="st-media-sub">{m.width}×{m.height} · {kb(m.filesize)}</div>
          </div>
          <CopyButton url={m.url} />
        </div>
      ))}
    </div>
  );
}
