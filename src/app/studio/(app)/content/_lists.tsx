"use client";

/** Small reusable list editors shared by the content editors. Client-only, no
 *  server imports. */

const btn = { padding: "8px 10px" } as const;

/** Editable list of plain strings. `fixed` = edit text only (no add/remove/reorder),
 *  for lists whose count/order the page depends on (coded numbers, page positions). */
export function StringList({
  items,
  onChange,
  dir,
  max = 20,
  addLabel = "+ Добавить",
  fixed = false,
  multiline = false,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  dir: "ltr" | "rtl";
  max?: number;
  addLabel?: string;
  fixed?: boolean;
  multiline?: boolean;
}) {
  const set = (i: number, v: string) => { const a = [...items]; a[i] = v; onChange(a); };
  const move = (i: number, d: -1 | 1) => { const a = [...items]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; onChange(a); };
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 6 }}>
          {multiline
            ? <textarea className="st-textarea" dir={dir} value={s} onChange={(e) => set(i, e.target.value)} style={{ minHeight: 56 }} />
            : <input className="st-input" dir={dir} value={s} onChange={(e) => set(i, e.target.value)} />}
          {!fixed ? (
            <>
              <button type="button" className="st-btn st-btn-ghost" onClick={() => move(i, -1)} disabled={i === 0} style={btn}>↑</button>
              <button type="button" className="st-btn st-btn-ghost" onClick={() => move(i, 1)} disabled={i === items.length - 1} style={btn}>↓</button>
              <button type="button" className="st-btn st-btn-ghost" onClick={() => remove(i)} style={{ ...btn, color: "#e07a7a" }}>✕</button>
            </>
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
  items,
  fields,
  onChange,
  dir,
  max = 12,
  addLabel = "+ Добавить",
  newItem,
}: {
  items: T[];
  fields: { key: keyof T & string; placeholder: string; multiline?: boolean }[];
  onChange: (v: T[]) => void;
  dir: "ltr" | "rtl";
  max?: number;
  addLabel?: string;
  newItem: () => T;
}) {
  const set = (i: number, key: keyof T & string, v: string) => {
    const a = items.map((x) => ({ ...x }));
    a[i][key] = v as T[keyof T & string];
    onChange(a);
  };
  const move = (i: number, d: -1 | 1) => { const a = items.map((x) => ({ ...x })); const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; onChange(a); };
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((it, i) => (
        <div key={i} style={{ border: "1px solid var(--s-line)", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button type="button" className="st-btn st-btn-ghost" onClick={() => move(i, -1)} disabled={i === 0} style={btn}>↑</button>
            <button type="button" className="st-btn st-btn-ghost" onClick={() => move(i, 1)} disabled={i === items.length - 1} style={btn}>↓</button>
            <button type="button" className="st-btn st-btn-ghost" onClick={() => remove(i)} style={{ ...btn, color: "#e07a7a" }}>✕</button>
          </div>
          {fields.map((f) => (
            f.multiline
              ? <textarea key={f.key} className="st-textarea" dir={dir} placeholder={f.placeholder} value={it[f.key]} onChange={(e) => set(i, f.key, e.target.value)} style={{ minHeight: 60 }} />
              : <input key={f.key} className="st-input" dir={dir} placeholder={f.placeholder} value={it[f.key]} onChange={(e) => set(i, f.key, e.target.value)} />
          ))}
        </div>
      ))}
      {items.length < max ? (
        <button type="button" className="st-btn" onClick={() => onChange([...items, newItem()])} style={{ alignSelf: "flex-start" }}>{addLabel}</button>
      ) : null}
    </div>
  );
}
