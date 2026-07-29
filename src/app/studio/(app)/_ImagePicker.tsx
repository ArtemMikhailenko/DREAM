"use client";

import { useEffect, useState, useTransition } from "react";
import type { MediaItem } from "@/studio/lib/media";
import { listMediaAction } from "./media/actions";

export function ImagePicker({
  valueId,
  valueThumb,
  onChange,
  label = "Изображение",
}: {
  valueId: number | null;
  valueThumb: string | null;
  onChange: (id: number | null, thumb: string | null) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [loading, startLoad] = useTransition();

  useEffect(() => {
    if (open && items === null) startLoad(async () => setItems(await listMediaAction()));
  }, [open, items]);

  return (
    <div className="st-field" style={{ marginBottom: 0 }}>
      <label className="st-label">{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 120, height: 76, borderRadius: 10, overflow: "hidden", background: "var(--s-panel-2)", border: "1px solid var(--s-line)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          {valueThumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={valueThumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: "var(--s-faint)", fontSize: "0.78rem" }}>нет фото</span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button type="button" className="st-btn" onClick={() => setOpen(true)}>Выбрать из медиатеки</button>
          {valueId ? <button type="button" className="st-btn st-btn-ghost" onClick={() => onChange(null, null)} style={{ color: "#e07a7a" }}>Убрать</button> : null}
        </div>
      </div>

      {open ? (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(2px)", zIndex: 1000, display: "grid", placeItems: "center", padding: 24 }}
        >
          <div onClick={(e) => e.stopPropagation()} className="st-card" style={{ width: "min(920px, 100%)", maxHeight: "82vh", overflow: "auto", padding: 22 }}>
            <div className="st-head" style={{ marginBottom: 16 }}>
              <h2 className="st-title" style={{ fontSize: "1.1rem" }}>Выберите изображение</h2>
              <button type="button" className="st-btn st-btn-ghost" onClick={() => setOpen(false)}>Закрыть</button>
            </div>
            {loading || items === null ? (
              <div className="st-empty">Загрузка медиатеки…</div>
            ) : items.length === 0 ? (
              <div className="st-empty">Медиатека пуста — сначала загрузите картинки в разделе «Медиа».</div>
            ) : (
              <div className="st-media-grid">
                {items.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className="st-media-card"
                    onClick={() => { onChange(m.id, m.thumbUrl || m.url); setOpen(false); }}
                    style={{ cursor: "pointer", textAlign: "left", padding: 0, border: valueId === m.id ? "1px solid var(--s-accent)" : "1px solid var(--s-line)", background: "var(--s-panel)" }}
                  >
                    <div className="st-media-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {m.thumbUrl ? <img src={m.thumbUrl} alt={m.filename} loading="lazy" /> : <span style={{ color: "var(--s-faint)" }}>—</span>}
                    </div>
                    <div className="st-media-meta"><div className="st-media-name" title={m.filename}>{m.filename}</div></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
