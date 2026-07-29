"use client";

import { useState, useTransition } from "react";
import { LEADFORM_SECTIONS, LOCALES, type LeadFormContent, type LeadFormFields, type Locale } from "@/studio/lib/content-schema";
import { saveLeadFormAction } from "../actions";

export function LeadFormEditor({ initial }: { initial: LeadFormContent }) {
  const [content, setContent] = useState<LeadFormContent>(initial);
  const [baseline, setBaseline] = useState<LeadFormContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [pending, start] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const rtl = LOCALES.find((l) => l.code === locale)?.rtl ?? false;
  const dir = rtl ? "rtl" : "ltr";

  const setField = (key: keyof LeadFormFields, value: string) => {
    setContent((c) => ({ ...c, [locale]: { ...c[locale], fields: { ...c[locale].fields, [key]: value } } }));
    setJustSaved(false);
  };
  const setService = (i: number, value: string) => {
    setContent((c) => {
      const services = [...c[locale].services];
      services[i] = value;
      return { ...c, [locale]: { ...c[locale], services } };
    });
    setJustSaved(false);
  };

  const save = () => start(async () => {
    await saveLeadFormAction(content);
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
        {LEADFORM_SECTIONS.map((section) => (
          <div className="st-card" style={{ padding: "22px 24px" }} key={section.title}>
            <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>{section.title}</div>
            {section.fields.map((f) => (
              <div className="st-field" key={f.key}>
                <label className="st-label" htmlFor={f.key}>{f.label}</label>
                {f.multiline ? (
                  <textarea id={f.key} className="st-textarea" dir={dir} value={content[locale].fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />
                ) : (
                  <input id={f.key} className="st-input" dir={dir} value={content[locale].fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="st-card" style={{ padding: "22px 24px" }}>
          <div className="st-label" style={{ marginBottom: 6, fontSize: "0.7rem" }}>Услуги в выпадающем списке</div>
          <p className="st-sub" style={{ margin: "0 0 16px", fontSize: "0.82rem" }}>
            Порядок и количество менять нельзя — по позиции подставляется услуга страницы. Меняйте только текст.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {services.map((s, i) => (
              <div className="st-field" key={i} style={{ marginBottom: 0 }}>
                <input className="st-input" dir={dir} value={s} onChange={(e) => setService(i, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
