"use client";

import { useState, useTransition } from "react";
import { LOCALES, TESTIMONIAL_FIELDS, type Locale, type TestimonialDoc, type TestimonialFields } from "@/studio/lib/content-schema";
import { deleteTestimonialAction, saveTestimonialAction } from "../../actions";
import { EditorBar, FieldGrid, Section, fillEmptyFrom, useGaps, useSaveShortcut } from "../../../_editor";

export function TestimonialEditor({ initial }: { initial: TestimonialDoc }) {
  const [doc, setDoc] = useState<TestimonialDoc>(initial);
  const [baseline, setBaseline] = useState<TestimonialDoc>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, start] = useTransition();
  const [deleting, startDelete] = useTransition();

  const dirty = JSON.stringify(doc) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const gaps = useGaps(doc.locales);

  const save = () => start(async () => { await saveTestimonialAction(doc); setBaseline(doc); });
  useSaveShortcut(dirty, save);

  const setField = (key: keyof TestimonialFields, value: string) =>
    setDoc((d) => ({ ...d, locales: { ...d.locales, [locale]: { ...d.locales[locale], [key]: value } } }));
  const fillFrom = (from: Locale) => setDoc((d) => ({ ...d, locales: { ...d.locales, [locale]: fillEmptyFrom(d.locales[locale], d.locales[from]) } }));

  const remove = () => {
    if (!confirm("Удалить этот отзыв? Действие необратимо.")) return;
    startDelete(() => deleteTestimonialAction(doc.id));
  };

  const prefix = locale === "en" ? "" : `/${locale === "he" ? "heb" : locale}`;

  return (
    <>
      <EditorBar locale={locale} setLocale={setLocale} gaps={gaps} dirty={dirty} saving={saving} onSave={save} onFillFrom={fillFrom}
        previewHref={`${prefix}/testimonials`} />

      <div className="st-editor-main">
        <Section title="Отзыв">
          <div className="st-field">
            <label className="st-label" htmlFor="order">Порядок</label>
            <input id="order" className="st-input" type="number" value={doc.order} onChange={(e) => setDoc((d) => ({ ...d, order: Number(e.target.value) || 0 }))} style={{ maxWidth: 120 }} />
          </div>
          <FieldGrid fields={TESTIMONIAL_FIELDS} values={doc.locales[locale]} dir={dir} onChange={(k, v) => setField(k as keyof TestimonialFields, v)} />
        </Section>

        <div style={{ marginTop: 20 }}>
          <button type="button" className="st-btn st-btn-ghost" onClick={remove} disabled={deleting} style={{ color: "#e07a7a" }}>
            {deleting ? "Удаляем…" : "Удалить отзыв"}
          </button>
        </div>
      </div>
    </>
  );
}
