"use client";

import { useState, useTransition } from "react";
import { LOCALES, TESTIMONIAL_FIELDS, type Locale, type TestimonialDoc, type TestimonialFields } from "@/studio/lib/content-schema";
import { deleteTestimonialAction, saveTestimonialAction } from "../../actions";

export function TestimonialEditor({ initial }: { initial: TestimonialDoc }) {
  const [doc, setDoc] = useState<TestimonialDoc>(initial);
  const [baseline, setBaseline] = useState<TestimonialDoc>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [pending, start] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(doc) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";

  const setField = (key: keyof TestimonialFields, value: string) => {
    setDoc((d) => ({ ...d, locales: { ...d.locales, [locale]: { ...d.locales[locale], [key]: value } } }));
    setJustSaved(false);
  };
  const setOrder = (value: string) => { setDoc((d) => ({ ...d, order: Number(value) || 0 })); setJustSaved(false); };

  const save = () => start(async () => { await saveTestimonialAction(doc); setBaseline(doc); setJustSaved(true); });
  const remove = () => {
    if (!confirm("Удалить этот отзыв? Действие необратимо.")) return;
    startDelete(() => deleteTestimonialAction(doc.id));
  };

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

      <div className="st-card" style={{ padding: "22px 24px", maxWidth: 640 }}>
        <div className="st-field">
          <label className="st-label" htmlFor="order">Порядок</label>
          <input id="order" className="st-input" type="number" value={doc.order} onChange={(e) => setOrder(e.target.value)} style={{ maxWidth: 120 }} />
        </div>
        {TESTIMONIAL_FIELDS.map((f) => (
          <div className="st-field" key={f.key}>
            <label className="st-label" htmlFor={f.key}>{f.label}</label>
            {f.multiline
              ? <textarea id={f.key} className="st-textarea" dir={dir} value={doc.locales[locale][f.key]} onChange={(e) => setField(f.key, e.target.value)} />
              : <input id={f.key} className="st-input" dir={dir} value={doc.locales[locale][f.key]} onChange={(e) => setField(f.key, e.target.value)} />}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button type="button" className="st-btn st-btn-ghost" onClick={remove} disabled={deleting} style={{ color: "#e07a7a" }}>
          {deleting ? "Удаляем…" : "Удалить отзыв"}
        </button>
      </div>
    </>
  );
}
