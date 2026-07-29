"use client";

import { useState, useTransition } from "react";
import { FOOTER_SECTIONS, LOCALES, type FooterContent, type FooterFields, type Locale } from "@/studio/lib/content";
import { saveFooterAction } from "../actions";

export function FooterEditor({ initial }: { initial: FooterContent }) {
  const [content, setContent] = useState<FooterContent>(initial);
  const [baseline, setBaseline] = useState<FooterContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [pending, start] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const rtl = LOCALES.find((l) => l.code === locale)?.rtl ?? false;
  const dir = rtl ? "rtl" : "ltr";

  const touched = () => setJustSaved(false);
  const setField = (key: keyof FooterFields, value: string) => {
    setContent((c) => ({ ...c, [locale]: { ...c[locale], fields: { ...c[locale].fields, [key]: value } } }));
    touched();
  };
  const mutateServices = (fn: (arr: string[]) => string[]) => {
    setContent((c) => ({ ...c, [locale]: { ...c[locale], services: fn([...c[locale].services]) } }));
    touched();
  };
  const setService = (i: number, v: string) => mutateServices((a) => { a[i] = v; return a; });
  const addService = () => mutateServices((a) => { a.push(""); return a; });
  const removeService = (i: number) => mutateServices((a) => { a.splice(i, 1); return a; });
  const moveService = (i: number, d: -1 | 1) => mutateServices((a) => {
    const j = i + d;
    if (j < 0 || j >= a.length) return a;
    [a[i], a[j]] = [a[j], a[i]];
    return a;
  });

  const save = () => start(async () => {
    await saveFooterAction(content);
    setBaseline(content);
    setJustSaved(true);
  });

  const services = content[locale].services;

  return (
    <>
      <div className="st-tabs">
        {LOCALES.map((l) => (
          <button key={l.code} type="button" className={`st-tab${locale === l.code ? " active" : ""}`} onClick={() => setLocale(l.code)}>
            {l.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {justSaved && !dirty ? <span style={{ color: "#6bd39a", fontSize: "0.84rem" }}>✓ Сохранено</span> : null}
          <button type="button" className="st-btn st-btn-primary" onClick={save} disabled={!dirty || pending}>
            {pending ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
        {FOOTER_SECTIONS.map((section) => (
          <div className="st-card" style={{ padding: "22px 24px" }} key={section.title}>
            <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>{section.title}</div>
            {section.fields.map((f) => (
              <div className="st-field" key={f.key}>
                <label className="st-label" htmlFor={f.key}>{f.label}</label>
                <input id={f.key} className="st-input" dir={dir} value={content[locale].fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />
              </div>
            ))}

            {section.title === "Колонка «Услуги»" ? (
              <div className="st-field" style={{ marginBottom: 0 }}>
                <label className="st-label">Пункты списка</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {services.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input className="st-input" dir={dir} value={s} onChange={(e) => setService(i, e.target.value)} placeholder="Пункт…" />
                      <button type="button" className="st-btn st-btn-ghost" title="Вверх" onClick={() => moveService(i, -1)} disabled={i === 0} style={{ padding: "8px 10px" }}>↑</button>
                      <button type="button" className="st-btn st-btn-ghost" title="Вниз" onClick={() => moveService(i, 1)} disabled={i === services.length - 1} style={{ padding: "8px 10px" }}>↓</button>
                      <button type="button" className="st-btn st-btn-ghost" title="Удалить" onClick={() => removeService(i)} style={{ padding: "8px 10px", color: "#e07a7a" }}>✕</button>
                    </div>
                  ))}
                  {services.length < 12 ? (
                    <button type="button" className="st-btn" onClick={addService} style={{ alignSelf: "flex-start" }}>+ Добавить пункт</button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
