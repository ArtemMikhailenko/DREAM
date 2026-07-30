"use client";

import { useState, useTransition } from "react";
import { CASE_FIELDS, LOCALES, type CaseDoc, type CaseFields, type Locale } from "@/studio/lib/content-schema";
import { deleteCaseAction, saveCaseAction } from "../../actions";
import { StringList } from "../../../content/_lists";
import { ImagePicker } from "../../../_ImagePicker";
import { EditorBar, FieldGrid, Section, SectionNav, fillEmptyFrom, useGaps, useSaveShortcut } from "../../../_editor";

const GENERAL = "Общее";
const TEXT = "Текст кейса";

export function CaseEditor({ initial }: { initial: CaseDoc }) {
  const [doc, setDoc] = useState<CaseDoc>(initial);
  const [baseline, setBaseline] = useState<CaseDoc>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, start] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const dirty = JSON.stringify(doc) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const loc = doc.locales[locale];
  const gaps = useGaps(doc.locales);

  const save = () => start(async () => {
    setError(null);
    const res = await saveCaseAction(doc);
    if (!res.ok) { setError(res.error ?? "Не удалось сохранить"); return; }
    setBaseline(doc);
  });
  useSaveShortcut(dirty, save);

  const setLoc = (patch: Partial<typeof loc>) => setDoc((d) => ({ ...d, locales: { ...d.locales, [locale]: { ...d.locales[locale], ...patch } } }));
  const setField = (key: keyof CaseFields, v: string) => setLoc({ fields: { ...loc.fields, [key]: v } });
  const fillFrom = (from: Locale) => setDoc((d) => ({ ...d, locales: { ...d.locales, [locale]: fillEmptyFrom(d.locales[locale], d.locales[from]) } }));

  const remove = () => {
    if (!confirm("Удалить этот кейс? Действие необратимо.")) return;
    startDelete(() => deleteCaseAction(doc.id));
  };

  const prefix = locale === "en" ? "" : `/${locale === "he" ? "heb" : locale}`;

  return (
    <>
      <EditorBar locale={locale} setLocale={setLocale} gaps={gaps} dirty={dirty} saving={saving} onSave={save} onFillFrom={fillFrom}
        previewHref={`${prefix}/portfolio/${doc.slug}`} />

      {error ? <div className="st-error">{error}</div> : null}

      <div className="st-editor">
        <div className="st-editor-main">
          <Section title={GENERAL} hint="Одинаково для всех языков">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div className="st-field" style={{ flex: "1 1 260px", marginBottom: 0 }}>
                <label className="st-label" htmlFor="slug">Slug (URL)</label>
                <input id="slug" className="st-input" value={doc.slug} onChange={(e) => { setDoc((d) => ({ ...d, slug: e.target.value })); setError(null); }} />
                <p className="st-hint">Адрес кейса: /portfolio/{doc.slug || "…"}</p>
              </div>
              <div className="st-field" style={{ width: 120, marginBottom: 0 }}>
                <label className="st-label" htmlFor="order">Порядок</label>
                <input id="order" className="st-input" type="number" value={doc.order} onChange={(e) => setDoc((d) => ({ ...d, order: Number(e.target.value) || 0 }))} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <ImagePicker label="Обложка кейса (16:9)" valueId={doc.coverId} valueThumb={doc.coverThumb} onChange={(id, thumb) => setDoc((d) => ({ ...d, coverId: id, coverThumb: thumb }))} />
            </div>
          </Section>

          <Section title={TEXT}>
            <FieldGrid fields={CASE_FIELDS} values={loc.fields} dir={dir} onChange={(k, v) => setField(k as keyof CaseFields, v)} />
            <div className="st-field">
              <label className="st-label" style={{ display: "block", marginBottom: 8 }}>Текст кейса (абзацы)</label>
              <StringList items={loc.body} onChange={(v) => setLoc({ body: v })} dir={dir} addLabel="+ Абзац" max={30} multiline />
            </div>
            <div className="st-field" style={{ marginBottom: 0 }}>
              <label className="st-label" style={{ display: "block", marginBottom: 8 }}>Что мы сделали</label>
              <StringList items={loc.services} onChange={(v) => setLoc({ services: v })} dir={dir} addLabel="+ Пункт" max={30} />
            </div>
          </Section>

          <div>
            <button type="button" className="st-btn st-btn-ghost" onClick={remove} disabled={deleting} style={{ color: "#e07a7a" }}>
              {deleting ? "Удаляем…" : "Удалить кейс"}
            </button>
          </div>
        </div>

        <SectionNav titles={[GENERAL, TEXT]} />
      </div>
    </>
  );
}
