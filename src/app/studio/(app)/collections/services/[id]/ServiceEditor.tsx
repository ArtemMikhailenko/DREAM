"use client";

import { useState, useTransition } from "react";
import { LOCALES, SERVICE_SECTIONS, type Locale, type ServiceBlock, type ServiceDoc, type ServiceFields } from "@/studio/lib/content-schema";
import { saveServiceAction } from "../../actions";
import { StringList } from "../../../content/_lists";

export function ServiceEditor({ initial }: { initial: ServiceDoc }) {
  const [doc, setDoc] = useState<ServiceDoc>(initial);
  const [baseline, setBaseline] = useState<ServiceDoc>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [pending, start] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(doc) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = doc.locales[locale];

  const touch = () => setJustSaved(false);
  const setLoc = (patch: Partial<typeof d>) => { setDoc((x) => ({ ...x, locales: { ...x.locales, [locale]: { ...x.locales[locale], ...patch } } })); touch(); };
  const setField = (key: keyof ServiceFields, v: string) => setLoc({ fields: { ...d.fields, [key]: v } });

  const mutBlocks = (fn: (b: ServiceBlock[]) => ServiceBlock[]) => setLoc({ blocks: fn(d.blocks.map((b) => ({ ...b, list: [...b.list] }))) });
  const setBlock = (bi: number, patch: Partial<ServiceBlock>) => mutBlocks((b) => { b[bi] = { ...b[bi], ...patch }; return b; });
  const addBlock = () => mutBlocks((b) => [...b, { heading: "", intro: "", ordered: false, list: [] }]);
  const removeBlock = (bi: number) => mutBlocks((b) => b.filter((_, j) => j !== bi));
  const moveBlock = (bi: number, dr: -1 | 1) => mutBlocks((b) => { const j = bi + dr; if (j < 0 || j >= b.length) return b; [b[bi], b[j]] = [b[j], b[bi]]; return b; });

  const save = () => start(async () => { await saveServiceAction(doc); setBaseline(doc); setJustSaved(true); });

  return (
    <>
      <div className="st-tabs">
        {LOCALES.map((l) => (
          <button key={l.code} type="button" className={`st-tab${locale === l.code ? " active" : ""}`} onClick={() => setLocale(l.code)}>{l.label}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {justSaved && !dirty ? <span style={{ color: "#6bd39a", fontSize: "0.84rem" }}>✓ Сохранено</span> : null}
          <button type="button" className="st-btn st-btn-primary" onClick={save} disabled={!dirty || pending}>{pending ? "Сохраняем…" : "Сохранить"}</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
        <div className="st-card" style={{ padding: "22px 24px" }}>
          <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>Общее</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="st-field" style={{ flex: "1 1 260px", marginBottom: 0 }}>
              <label className="st-label">Slug (только чтение)</label>
              <input className="st-input" value={doc.slug} readOnly style={{ opacity: 0.6 }} />
            </div>
            <div className="st-field" style={{ width: 120, marginBottom: 0 }}>
              <label className="st-label" htmlFor="order">Порядок</label>
              <input id="order" className="st-input" type="number" value={doc.order} onChange={(e) => { setDoc((x) => ({ ...x, order: Number(e.target.value) || 0 })); touch(); }} />
            </div>
          </div>
          <p className="st-sub" style={{ margin: "12px 0 0", fontSize: "0.8rem", color: "var(--s-faint)" }}>ⓘ Фото в шапке — через раздел «Медиа» (скоро).</p>
        </div>

        {SERVICE_SECTIONS.map((section) => (
          <div className="st-card" style={{ padding: "22px 24px" }} key={section.title}>
            <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>{section.title} ({locale.toUpperCase()})</div>
            {section.fields.map((f) => (
              <div className="st-field" key={f.key}>
                <label className="st-label" htmlFor={f.key}>{f.label}</label>
                {f.multiline
                  ? <textarea id={f.key} className="st-textarea" dir={dir} value={d.fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />
                  : <input id={f.key} className="st-input" dir={dir} value={d.fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />}
              </div>
            ))}
            {section.title === "Страница" ? (
              <div className="st-field" style={{ marginBottom: 0 }}>
                <label className="st-label">Абзацы вступления</label>
                <StringList items={d.body} onChange={(v) => setLoc({ body: v })} dir={dir} addLabel="+ Абзац" max={30} multiline />
              </div>
            ) : null}
          </div>
        ))}

        <div className="st-card" style={{ padding: "22px 24px" }}>
          <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>Блоки страницы ({locale.toUpperCase()})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {d.blocks.map((b, bi) => (
              <div key={bi} style={{ border: "1px solid var(--s-line-2)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input className="st-input" dir={dir} placeholder="Заголовок блока" value={b.heading} onChange={(e) => setBlock(bi, { heading: e.target.value })} />
                  <button type="button" className="st-btn st-btn-ghost" onClick={() => moveBlock(bi, -1)} disabled={bi === 0} style={{ padding: "8px 10px" }}>↑</button>
                  <button type="button" className="st-btn st-btn-ghost" onClick={() => moveBlock(bi, 1)} disabled={bi === d.blocks.length - 1} style={{ padding: "8px 10px" }}>↓</button>
                  <button type="button" className="st-btn st-btn-ghost" onClick={() => removeBlock(bi)} style={{ padding: "8px 10px", color: "#e07a7a" }}>✕</button>
                </div>
                <textarea className="st-textarea" dir={dir} placeholder="Вступление" value={b.intro} onChange={(e) => setBlock(bi, { intro: e.target.value })} style={{ minHeight: 56 }} />
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--s-muted)" }}>
                  <input type="checkbox" checked={b.ordered} onChange={(e) => setBlock(bi, { ordered: e.target.checked })} />
                  Нумерованный (таймлайн)
                </label>
                <div>
                  <label className="st-label" style={{ display: "block", marginBottom: 6 }}>Список</label>
                  <StringList items={b.list} onChange={(v) => setBlock(bi, { list: v })} dir={dir} addLabel="+ Пункт" max={20} />
                </div>
              </div>
            ))}
            {d.blocks.length < 12 ? <button type="button" className="st-btn" onClick={addBlock} style={{ alignSelf: "flex-start" }}>+ Добавить блок</button> : null}
          </div>
        </div>
      </div>
    </>
  );
}
