"use client";

import { useState, useTransition } from "react";
import { LOCALES, type Locale } from "@/studio/lib/content-schema";
import type { GlobalContent, GlobalUi } from "@/studio/lib/globals-schema";
import { saveGlobalAction } from "../actions";
import { ObjectList, StringList } from "../../content/_lists";

export function GlobalEditor({ globalKey, ui, initial }: { globalKey: string; ui: GlobalUi; initial: GlobalContent }) {
  const [content, setContent] = useState<GlobalContent>(initial);
  const [baseline, setBaseline] = useState<GlobalContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [pending, start] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = content[locale];

  const setField = (key: string, v: string) => {
    setContent((c) => ({ ...c, [locale]: { ...c[locale], fields: { ...c[locale].fields, [key]: v } } }));
    setJustSaved(false);
  };
  const setList = (id: string, v: string[] | Record<string, string>[]) => {
    setContent((c) => ({ ...c, [locale]: { ...c[locale], lists: { ...c[locale].lists, [id]: v } } }));
    setJustSaved(false);
  };

  const save = () => start(async () => { await saveGlobalAction(globalKey, content); setBaseline(content); setJustSaved(true); });

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
        {ui.sections.map((section) => (
          <div className="st-card" style={{ padding: "22px 24px" }} key={section.title}>
            <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>{section.title}</div>
            {section.fields.map((f) => (
              <div className="st-field" key={f.key}>
                <label className="st-label" htmlFor={f.key}>{f.label}</label>
                {f.multiline
                  ? <textarea id={f.key} className="st-textarea" dir={dir} value={d.fields[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} />
                  : <input id={f.key} className="st-input" dir={dir} value={d.fields[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} />}
              </div>
            ))}
          </div>
        ))}

        {ui.lists.map((list) => (
          <div className="st-card" style={{ padding: "22px 24px" }} key={list.id}>
            <div className="st-label" style={{ marginBottom: list.note ? 6 : 14, fontSize: "0.7rem" }}>{list.title}</div>
            {list.note ? <p className="st-sub" style={{ margin: "0 0 14px", fontSize: "0.82rem" }}>{list.note}</p> : null}
            {list.kind === "string" ? (
              <StringList
                items={(d.lists[list.id] ?? []) as string[]}
                onChange={(v) => setList(list.id, v)}
                dir={dir}
                addLabel={list.addLabel}
                max={30}
                multiline={list.multiline}
              />
            ) : (
              <ObjectList
                items={(d.lists[list.id] ?? []) as Record<string, string>[]}
                onChange={(v) => setList(list.id, v)}
                dir={dir}
                addLabel={list.addLabel}
                fields={list.fields.map((f) => ({ key: f.key, placeholder: f.placeholder, multiline: f.multiline }))}
                newItem={() => Object.fromEntries(list.fields.map((f) => [f.key, ""]))}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
