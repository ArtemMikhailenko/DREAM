"use client";

import { useState, useTransition } from "react";
import { HOME_SECTIONS, LOCALES, type HomeContent, type HomeFields, type Locale } from "@/studio/lib/content-schema";
import { saveHomeAction } from "../actions";
import { ObjectList, StringList } from "../_lists";

type LocData = HomeContent[Locale];

export function HomeEditor({ initial }: { initial: HomeContent }) {
  const [content, setContent] = useState<HomeContent>(initial);
  const [baseline, setBaseline] = useState<HomeContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [pending, start] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = content[locale];

  const patch = (p: Partial<LocData>) => {
    setContent((c) => ({ ...c, [locale]: { ...c[locale], ...p } }));
    setJustSaved(false);
  };
  const setField = (key: keyof HomeFields, value: string) => patch({ fields: { ...d.fields, [key]: value } });

  const save = () => start(async () => {
    await saveHomeAction(content);
    setBaseline(content);
    setJustSaved(true);
  });

  const renderList = (id: NonNullable<(typeof HOME_SECTIONS)[number]["list"]>) => {
    switch (id) {
      case "rail":
        return <StringList items={d.rail} onChange={(v) => patch({ rail: v })} dir={dir} addLabel="+ Пункт" max={20} />;
      case "problem":
        return <ObjectList items={d.problem} onChange={(v) => patch({ problem: v })} dir={dir} addLabel="+ Проблема"
          fields={[{ key: "title", placeholder: "Заголовок" }, { key: "text", placeholder: "Текст", multiline: true }]} newItem={() => ({ title: "", text: "" })} />;
      case "process":
        return <ObjectList items={d.process} onChange={(v) => patch({ process: v })} dir={dir} addLabel="+ Шаг"
          fields={[{ key: "name", placeholder: "Название шага" }, { key: "desc", placeholder: "Описание", multiline: true }]} newItem={() => ({ name: "", desc: "" })} />;
      case "results":
        return (
          <>
            <p className="st-sub" style={{ margin: "0 0 12px", fontSize: "0.82rem" }}>Числа заданы в коде страницы — здесь только подписи. Порядок и количество фиксированы.</p>
            <StringList items={d.results} onChange={(v) => patch({ results: v })} dir={dir} fixed multiline />
          </>
        );
      case "faq":
        return <ObjectList items={d.faq} onChange={(v) => patch({ faq: v })} dir={dir} addLabel="+ Вопрос" max={20}
          fields={[{ key: "q", placeholder: "Вопрос" }, { key: "a", placeholder: "Ответ", multiline: true }]} newItem={() => ({ q: "", a: "" })} />;
    }
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

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}>
        {HOME_SECTIONS.map((section) => (
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

            {section.list ? <div className="st-field" style={{ marginBottom: 0 }}>{renderList(section.list)}</div> : null}

            {section.note ? <p className="st-sub" style={{ margin: "12px 0 0", fontSize: "0.8rem", color: "var(--s-faint)" }}>ⓘ {section.note}</p> : null}
          </div>
        ))}
      </div>
    </>
  );
}
