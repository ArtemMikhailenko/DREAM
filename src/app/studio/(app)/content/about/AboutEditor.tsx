"use client";

import { useState, useTransition } from "react";
import { ABOUT_SECTIONS, LOCALES, type AboutContent, type AboutFields, type AboutLocaleData, type Locale } from "@/studio/lib/content-schema";
import { saveAboutAction } from "../actions";

const btnStyle = { padding: "8px 10px" } as const;

export function AboutEditor({ initial }: { initial: AboutContent }) {
  const [content, setContent] = useState<AboutContent>(initial);
  const [baseline, setBaseline] = useState<AboutContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [pending, start] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = content[locale];

  const patch = (p: Partial<AboutLocaleData>) => {
    setContent((c) => ({ ...c, [locale]: { ...c[locale], ...p } }));
    setJustSaved(false);
  };
  const setField = (key: keyof AboutFields, value: string) => patch({ fields: { ...d.fields, [key]: value } });

  const setCap = (i: number, v: string) => { const a = [...d.capabilities]; a[i] = v; patch({ capabilities: a }); };
  const addCap = () => patch({ capabilities: [...d.capabilities, ""] });
  const removeCap = (i: number) => patch({ capabilities: d.capabilities.filter((_, j) => j !== i) });
  const moveCap = (i: number, dir: -1 | 1) => { const a = [...d.capabilities]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; patch({ capabilities: a }); };

  const setVal = (i: number, key: "title" | "desc", v: string) => { const a = d.values.map((x) => ({ ...x })); a[i][key] = v; patch({ values: a }); };
  const addVal = () => patch({ values: [...d.values, { title: "", desc: "" }] });
  const removeVal = (i: number) => patch({ values: d.values.filter((_, j) => j !== i) });
  const moveVal = (i: number, dir: -1 | 1) => { const a = d.values.map((x) => ({ ...x })); const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; patch({ values: a }); };

  const setStat = (i: number, v: string) => { const a = [...d.stats]; a[i] = v; patch({ stats: a }); };

  const save = () => start(async () => {
    await saveAboutAction(content);
    setBaseline(content);
    setJustSaved(true);
  });

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

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}>
        {ABOUT_SECTIONS.map((section) => (
          <div className="st-card" style={{ padding: "22px 24px" }} key={section.title}>
            <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>{section.title}</div>

            {section.fields.map((f) => (
              <div className="st-field" key={f.key}>
                <label className="st-label" htmlFor={f.key}>{f.label}</label>
                {f.multiline
                  ? <textarea id={f.key} className="st-textarea" dir={dir} value={d.fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />
                  : <input id={f.key} className="st-input" dir={dir} value={d.fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />}
              </div>
            ))}

            {section.list === "capabilities" ? (
              <div className="st-field" style={{ marginBottom: 0 }}>
                <label className="st-label">Компетенции</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {d.capabilities.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 6 }}>
                      <input className="st-input" dir={dir} value={s} onChange={(e) => setCap(i, e.target.value)} />
                      <button type="button" className="st-btn st-btn-ghost" onClick={() => moveCap(i, -1)} disabled={i === 0} style={btnStyle}>↑</button>
                      <button type="button" className="st-btn st-btn-ghost" onClick={() => moveCap(i, 1)} disabled={i === d.capabilities.length - 1} style={btnStyle}>↓</button>
                      <button type="button" className="st-btn st-btn-ghost" onClick={() => removeCap(i)} style={{ ...btnStyle, color: "#e07a7a" }}>✕</button>
                    </div>
                  ))}
                  {d.capabilities.length < 20 ? <button type="button" className="st-btn" onClick={addCap} style={{ alignSelf: "flex-start" }}>+ Добавить</button> : null}
                </div>
              </div>
            ) : null}

            {section.list === "values" ? (
              <div className="st-field" style={{ marginBottom: 0 }}>
                <label className="st-label">Принципы</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {d.values.map((v, i) => (
                    <div key={i} style={{ border: "1px solid var(--s-line)", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <input className="st-input" dir={dir} placeholder="Заголовок" value={v.title} onChange={(e) => setVal(i, "title", e.target.value)} />
                        <button type="button" className="st-btn st-btn-ghost" onClick={() => moveVal(i, -1)} disabled={i === 0} style={btnStyle}>↑</button>
                        <button type="button" className="st-btn st-btn-ghost" onClick={() => moveVal(i, 1)} disabled={i === d.values.length - 1} style={btnStyle}>↓</button>
                        <button type="button" className="st-btn st-btn-ghost" onClick={() => removeVal(i)} style={{ ...btnStyle, color: "#e07a7a" }}>✕</button>
                      </div>
                      <textarea className="st-textarea" dir={dir} placeholder="Описание" value={v.desc} onChange={(e) => setVal(i, "desc", e.target.value)} style={{ minHeight: 64 }} />
                    </div>
                  ))}
                  {d.values.length < 12 ? <button type="button" className="st-btn" onClick={addVal} style={{ alignSelf: "flex-start" }}>+ Добавить принцип</button> : null}
                </div>
              </div>
            ) : null}

            {section.list === "stats" ? (
              <div className="st-field" style={{ marginBottom: 0 }}>
                <label className="st-label">Подписи к цифрам</label>
                <p className="st-sub" style={{ margin: "0 0 12px", fontSize: "0.82rem" }}>Сами числа заданы в коде страницы — здесь только подписи. Порядок и количество фиксированы.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {d.stats.map((s, i) => (
                    <textarea key={i} className="st-textarea" dir={dir} value={s} onChange={(e) => setStat(i, e.target.value)} style={{ minHeight: 56 }} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
