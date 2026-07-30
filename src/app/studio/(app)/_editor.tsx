"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LOCALES, type Locale } from "@/studio/lib/content-schema";

/**
 * Shared editor chrome: a sticky action bar, section navigation, and fields that
 * show what an editor actually needs to know — how long a meta tag is, which
 * language is missing text, whether there are unsaved changes.
 *
 * Client-only; imports nothing that touches the database.
 */

/* ── Translation helpers ────────────────────────────── */

/** Counts empty vs total leaf strings — drives the "untranslated" badge. */
export function countGaps(v: unknown): number {
  if (typeof v === "string") return v.trim() ? 0 : 1;
  if (Array.isArray(v)) return v.reduce<number>((n, x) => n + countGaps(x), 0);
  if (v && typeof v === "object") return Object.values(v as Record<string, unknown>).reduce<number>((n, x) => n + countGaps(x), 0);
  return 0;
}

/**
 * Deep-fills only the empty strings of `target` from `source`, leaving existing
 * text alone — the safe half of "copy from another language".
 */
export function fillEmptyFrom<T>(target: T, source: T): T {
  if (typeof target === "string") return ((target.trim() ? target : source) ?? target) as T;
  if (Array.isArray(target) && Array.isArray(source)) {
    if (target.length === 0) return JSON.parse(JSON.stringify(source));
    return target.map((item, i) => (i < source.length ? fillEmptyFrom(item, source[i]) : item)) as T;
  }
  if (target && source && typeof target === "object" && typeof source === "object") {
    const out: Record<string, unknown> = { ...(target as Record<string, unknown>) };
    for (const k of Object.keys(out)) {
      const src = (source as Record<string, unknown>)[k];
      if (src !== undefined) out[k] = fillEmptyFrom(out[k], src);
    }
    return out as T;
  }
  return target;
}

/* ── Save ergonomics ────────────────────────────────── */

/** Cmd/Ctrl+S saves; leaving with unsaved changes asks first. */
export function useSaveShortcut(dirty: boolean, save: () => void) {
  // Keep the latest save closure without re-binding the listeners each render.
  const ref = useRef(save);
  useEffect(() => { ref.current = save; });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty) ref.current();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("beforeunload", onLeave); };
  }, [dirty]);
}

/* ── Sticky action bar ──────────────────────────────── */

export function EditorBar({
  locale, setLocale, gaps, dirty, saving, onSave, onFillFrom, previewHref, saveLabel = "Сохранить",
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
  gaps?: Record<Locale, number>;
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onFillFrom?: (from: Locale) => void;
  previewHref?: string;
  saveLabel?: string;
}) {
  const others = LOCALES.filter((l) => l.code !== locale);
  return (
    <div className="st-bar">
      {LOCALES.map((l) => {
        const gap = gaps?.[l.code] ?? 0;
        return (
          <button key={l.code} type="button" className={`st-loc${locale === l.code ? " active" : ""}`} onClick={() => setLocale(l.code)}>
            {l.label}
            {gap > 0 ? <span className="st-loc-gap" title={`${gap} незаполненных полей`}>{gap}</span> : null}
          </button>
        );
      })}

      {onFillFrom && others.length ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
          <span className="st-bar-state">Заполнить пустое из:</span>
          {others.map((o) => (
            <button key={o.code} type="button" className="st-btn st-btn-ghost" style={{ padding: "5px 10px", fontSize: "0.8rem" }} onClick={() => onFillFrom(o.code)}>
              {o.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="st-bar-spacer">
        {previewHref ? (
          <a className="st-btn st-btn-ghost" href={previewHref} target="_blank" rel="noopener" style={{ padding: "7px 12px" }}>Открыть страницу ↗</a>
        ) : null}
        <span className={`st-bar-state${dirty ? " dirty" : " saved"}`}>
          {saving ? "Сохраняем…" : dirty ? "Есть несохранённые правки" : "Всё сохранено"}
        </span>
        <button type="button" className="st-btn st-btn-primary" onClick={onSave} disabled={!dirty || saving}>
          {saving ? "Сохраняем…" : saveLabel}
        </button>
        <span className="st-kbd">⌘S</span>
      </div>
    </div>
  );
}

/* ── Section navigation ─────────────────────────────── */

export const secId = (title: string) => "sec-" + title.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-").replace(/^-+|-+$/g, "");

export function SectionNav({ titles }: { titles: string[] }) {
  const [active, setActive] = useState(titles[0] ?? "");
  useEffect(() => {
    const onScroll = () => {
      let current = titles[0] ?? "";
      for (const t of titles) {
        const el = document.getElementById(secId(t));
        if (el && el.getBoundingClientRect().top <= 140) current = t;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [titles]);

  return (
    <nav className="st-toc">
      <div className="st-toc-head">Разделы</div>
      {titles.map((t) => (
        <button
          key={t}
          type="button"
          className={`st-toc-item${active === t ? " active" : ""}`}
          onClick={() => document.getElementById(secId(t))?.scrollIntoView({ behavior: "smooth", block: "start" })}
        >
          {t}
        </button>
      ))}
    </nav>
  );
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="st-sec" id={secId(title)}>
      <div className="st-sec-head">
        <h2 className="st-sec-title">{title}</h2>
        {hint ? <span className="st-sec-hint">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

/* ── Field ──────────────────────────────────────────── */

/** Google truncates around these lengths — warn before it costs a click. */
const LIMITS: Record<string, number> = { metaTitle: 60, metaDescription: 160 };

export function Field({
  fieldKey, label, hint, value, onChange, dir, multiline, limit, wide,
}: {
  fieldKey: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  dir: "ltr" | "rtl";
  multiline?: boolean;
  limit?: number;
  wide?: boolean;
}) {
  const max = limit ?? LIMITS[fieldKey];
  const len = value.length;
  const cls = max ? (len > max ? "over" : len > max * 0.9 ? "warn" : "") : "";

  return (
    <div className={`st-field${wide ? " st-wide" : ""}`}>
      <div className="st-field-head">
        <label className="st-label" htmlFor={fieldKey}>{label}</label>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!value.trim() ? <span className="st-flag">пусто</span> : null}
          {max ? <span className={`st-count ${cls}`}>{len}/{max}</span> : null}
        </span>
      </div>
      {hint ? <p className="st-hint">{hint}</p> : null}
      {multiline ? (
        <textarea id={fieldKey} className="st-textarea" dir={dir} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={fieldKey} className="st-input" dir={dir} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

/* ── Field grid ─────────────────────────────────────── */

/**
 * Lays a section's fields out in two columns: short inputs pair up, long text
 * spans the row. A heading split across `x` and `xEm` (the site renders the second
 * half accented) is grouped and previewed as the single line it becomes — otherwise
 * two adjacent boxes of half a sentence make no sense to whoever is writing it.
 */
export function FieldGrid({
  fields, values, dir, onChange,
}: {
  fields: readonly { key: string; label: string; multiline?: boolean }[];
  values: Record<string, string>;
  dir: "ltr" | "rtl";
  onChange: (key: string, value: string) => void;
}) {
  const nodes: React.ReactNode[] = [];

  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    const next = fields[i + 1];
    const isPair = next && next.key === `${f.key}Em` && !f.multiline && !next.multiline;

    if (isPair) {
      nodes.push(
        <div className="st-pair" key={f.key}>
          <span className="st-preview-cap">Как это будет на сайте</span>
          <div className="st-preview" dir={dir}>
            {values[f.key] || "…"} <em>{values[next.key] || ""}</em>
          </div>
          <div className="st-pair-fields">
            <Field fieldKey={f.key} label={f.label} value={values[f.key] ?? ""} dir={dir} onChange={(v) => onChange(f.key, v)} />
            <Field fieldKey={next.key} label={next.label} value={values[next.key] ?? ""} dir={dir} onChange={(v) => onChange(next.key, v)} />
          </div>
        </div>,
      );
      i++;
      continue;
    }

    nodes.push(
      <Field
        key={f.key}
        fieldKey={f.key}
        label={f.label}
        value={values[f.key] ?? ""}
        dir={dir}
        multiline={f.multiline}
        wide={f.multiline}
        onChange={(v) => onChange(f.key, v)}
      />,
    );
  }

  return <div className="st-grid">{nodes}</div>;
}

/* ── Locale gap map for the bar ─────────────────────── */

export function useGaps<T>(content: Record<Locale, T>): Record<Locale, number> {
  return useMemo(
    () => Object.fromEntries(LOCALES.map((l) => [l.code, countGaps(content[l.code])])) as Record<Locale, number>,
    [content],
  );
}
