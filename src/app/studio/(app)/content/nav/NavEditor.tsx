"use client";

import { useState, useTransition } from "react";
import { LOCALES, NAV_FIELDS, type Locale, type NavContent } from "@/studio/lib/content-schema";
import { saveNavAction } from "../actions";

export function NavEditor({ initial }: { initial: NavContent }) {
  const [content, setContent] = useState<NavContent>(initial);
  const [baseline, setBaseline] = useState<NavContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [pending, start] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const rtl = LOCALES.find((l) => l.code === locale)?.rtl;

  const setField = (key: keyof NavContent[Locale], value: string) => {
    setContent((c) => ({ ...c, [locale]: { ...c[locale], [key]: value } }));
    setJustSaved(false);
  };

  const save = () => {
    start(async () => {
      await saveNavAction(content);
      setBaseline(content);
      setJustSaved(true);
    });
  };

  return (
    <>
      <div className="st-tabs">
        {LOCALES.map((l) => (
          <button
            key={l.code}
            type="button"
            className={`st-tab${locale === l.code ? " active" : ""}`}
            onClick={() => setLocale(l.code)}
          >
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

      <div className="st-card" style={{ padding: "26px 28px", maxWidth: 640 }}>
        {NAV_FIELDS.map((f) => (
          <div className="st-field" key={f.key}>
            <label className="st-label" htmlFor={f.key}>{f.label}</label>
            <input
              id={f.key}
              className="st-input"
              value={content[locale][f.key]}
              dir={rtl ? "rtl" : "ltr"}
              onChange={(e) => setField(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
