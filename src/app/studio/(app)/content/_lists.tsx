"use client";

import { useState } from "react";

/** Reusable list editors. Rows reorder by dragging the grip handle. */

/** Shared drag-to-reorder state for a list of rows. */
function useReorder<T>(items: T[], onChange: (v: T[]) => void) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  // HTML5 drag would swallow text selection inside inputs, so the row only
  // becomes draggable while the pointer is held on its grip.
  const [armed, setArmed] = useState<number | null>(null);

  const drop = (to: number) => {
    if (dragIdx === null || dragIdx === to) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const rowProps = (i: number) => ({
    draggable: armed === i,
    onDragStart: () => setDragIdx(i),
    onDragEnd: () => { setDragIdx(null); setOverIdx(null); setArmed(null); },
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setOverIdx(i); },
    onDrop: (e: React.DragEvent) => { e.preventDefault(); drop(i); setOverIdx(null); },
    className: `st-drag-row${dragIdx === i ? " dragging" : ""}${overIdx === i && dragIdx !== i ? " over" : ""}`,
  });

  const gripProps = (i: number) => ({
    className: "st-grip",
    title: "Перетащите, чтобы поменять порядок",
    onMouseDown: () => setArmed(i),
    onMouseUp: () => setArmed(null),
  });

  return { rowProps, gripProps };
}

const delBtn = { padding: "8px 10px", color: "#e07a7a" } as const;

/**
 * Editable list of plain strings. `fixed` = edit text only (no add/remove/reorder),
 * for lists whose count and order the page depends on.
 */
export function StringList({
  items, onChange, dir, max = 20, addLabel = "+ Добавить", fixed = false, multiline = false,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  dir: "ltr" | "rtl";
  max?: number;
  addLabel?: string;
  fixed?: boolean;
  multiline?: boolean;
}) {
  const { rowProps, gripProps } = useReorder(items, onChange);
  const set = (i: number, v: string) => { const a = [...items]; a[i] = v; onChange(a); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((s, i) => (
        <div key={i} {...(fixed ? { className: "st-drag-row" } : rowProps(i))}>
          {!fixed ? <span {...gripProps(i)}>⠿</span> : null}
          {multiline
            ? <textarea className="st-textarea" dir={dir} value={s} onChange={(e) => set(i, e.target.value)} style={{ minHeight: 56 }} />
            : <input className="st-input" dir={dir} value={s} onChange={(e) => set(i, e.target.value)} />}
          {!fixed ? (
            <button type="button" className="st-btn st-btn-ghost" title="Удалить" onClick={() => onChange(items.filter((_, j) => j !== i))} style={delBtn}>✕</button>
          ) : null}
        </div>
      ))}
      {!fixed && items.length < max ? (
        <button type="button" className="st-btn" onClick={() => onChange([...items, ""])} style={{ alignSelf: "flex-start" }}>{addLabel}</button>
      ) : null}
    </div>
  );
}

/** Editable list of objects with a fixed set of string fields. */
export function ObjectList<T extends Record<string, string>>({
  items, fields, onChange, dir, max = 12, addLabel = "+ Добавить", newItem,
}: {
  items: T[];
  fields: { key: keyof T & string; placeholder: string; multiline?: boolean }[];
  onChange: (v: T[]) => void;
  dir: "ltr" | "rtl";
  max?: number;
  addLabel?: string;
  newItem: () => T;
}) {
  const { rowProps, gripProps } = useReorder(items, onChange);
  const set = (i: number, key: keyof T & string, v: string) => {
    const a = items.map((x) => ({ ...x }));
    a[i][key] = v as T[keyof T & string];
    onChange(a);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((it, i) => (
        <div key={i} {...rowProps(i)}>
          <span {...gripProps(i)}>⠿</span>
          <div className="st-card-block" style={{ flex: 1, minWidth: 0 }}>
            {fields.map((f) => (
              f.multiline
                ? <textarea key={f.key} className="st-textarea" dir={dir} placeholder={f.placeholder} value={it[f.key]} onChange={(e) => set(i, f.key, e.target.value)} style={{ minHeight: 60 }} />
                : <input key={f.key} className="st-input" dir={dir} placeholder={f.placeholder} value={it[f.key]} onChange={(e) => set(i, f.key, e.target.value)} />
            ))}
          </div>
          <button type="button" className="st-btn st-btn-ghost" title="Удалить" onClick={() => onChange(items.filter((_, j) => j !== i))} style={delBtn}>✕</button>
        </div>
      ))}
      {items.length < max ? (
        <button type="button" className="st-btn" onClick={() => onChange([...items, newItem()])} style={{ alignSelf: "flex-start" }}>{addLabel}</button>
      ) : null}
    </div>
  );
}
