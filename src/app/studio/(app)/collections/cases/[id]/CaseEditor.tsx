"use client";

import { useState, useTransition } from "react";
import { CASE_FIELDS, LOCALES, type CaseDoc, type CaseFields, type Locale } from "@/studio/lib/content-schema";
import { deleteCaseAction, saveCaseAction } from "../../actions";
import { StringList } from "../../../content/_lists";

export function CaseEditor({ initial }: { initial: CaseDoc }) {
  const [doc, setDoc] = useState<CaseDoc>(initial);
  const [baseline, setBaseline] = useState<CaseDoc>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [pending, start] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = JSON.stringify(doc) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const loc = doc.locales[locale];

  const touch = () => { setJustSaved(false); setError(null); };
  const setTop = (key: "slug" | "order", value: string) => { setDoc((d) => ({ ...d, [key]: key === "order" ? Number(value) || 0 : value })); touch(); };
  const setField = (key: keyof CaseFields, value: string) => {
    setDoc((d) => ({ ...d, locales: { ...d.locales, [locale]: { ...d.locales[locale], fields: { ...d.locales[locale].fields, [key]: value } } } }));
    touch();
  };
  const setList = (key: "body" | "services", value: string[]) => {
    setDoc((d) => ({ ...d, locales: { ...d.locales, [locale]: { ...d.locales[locale], [key]: value } } }));
    touch();
  };

  const save = () => start(async () => {
    const res = await saveCaseAction(doc);
    if (!res.ok) { setError(res.error ?? "Не удалось сохранить"); return; }
    setBaseline(doc);
    setJustSaved(true);
  });
  const remove = () => {
    if (!confirm("Удалить этот кейс? Действие необратимо.")) return;
    startDelete(() => deleteCaseAction(doc.id));
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

      {error ? <div className="st-error">{error}</div> : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}>
        <div className="st-card" style={{ padding: "22px 24px" }}>
          <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>Общее (для всех языков)</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="st-field" style={{ flex: "1 1 260px", marginBottom: 0 }}>
              <label className="st-label" htmlFor="slug">Slug (URL)</label>
              <input id="slug" className="st-input" value={doc.slug} onChange={(e) => setTop("slug", e.target.value)} />
            </div>
            <div className="st-field" style={{ width: 120, marginBottom: 0 }}>
              <label className="st-label" htmlFor="order">Порядок</label>
              <input id="order" className="st-input" type="number" value={doc.order} onChange={(e) => setTop("order", e.target.value)} />
            </div>
          </div>
          <p className="st-sub" style={{ margin: "12px 0 0", fontSize: "0.8rem", color: "var(--s-faint)" }}>ⓘ Обложка кейса — через раздел «Медиа» (скоро).</p>
        </div>

        <div className="st-card" style={{ padding: "22px 24px" }}>
          <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>Текст ({locale.toUpperCase()})</div>
          {CASE_FIELDS.map((f) => (
            <div className="st-field" key={f.key}>
              <label className="st-label" htmlFor={f.key}>{f.label}</label>
              {f.multiline
                ? <textarea id={f.key} className="st-textarea" dir={dir} value={loc.fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />
                : <input id={f.key} className="st-input" dir={dir} value={loc.fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />}
            </div>
          ))}
          <div className="st-field">
            <label className="st-label">Текст кейса (абзацы)</label>
            <StringList items={loc.body} onChange={(v) => setList("body", v)} dir={dir} addLabel="+ Абзац" max={30} multiline />
          </div>
          <div className="st-field" style={{ marginBottom: 0 }}>
            <label className="st-label">Что мы сделали</label>
            <StringList items={loc.services} onChange={(v) => setList("services", v)} dir={dir} addLabel="+ Пункт" max={30} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button type="button" className="st-btn st-btn-ghost" onClick={remove} disabled={deleting} style={{ color: "#e07a7a" }}>
          {deleting ? "Удаляем…" : "Удалить кейс"}
        </button>
      </div>
    </>
  );
}
