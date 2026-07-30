"use client";

import { useState, useTransition } from "react";
import { LEADFORM_SECTIONS, LOCALES, type LeadFormContent, type LeadFormFields, type Locale } from "@/studio/lib/content-schema";
import { saveLeadFormAction } from "../actions";
import { StringList } from "../_lists";
import { EditorBar, FieldGrid, Section, SectionNav, fillEmptyFrom, useGaps, useSaveShortcut } from "../../_editor";

const SERVICES_TITLE = "Услуги в списке";

export function LeadFormEditor({ initial }: { initial: LeadFormContent }) {
  const [content, setContent] = useState<LeadFormContent>(initial);
  const [baseline, setBaseline] = useState<LeadFormContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, start] = useTransition();

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = content[locale];
  const gaps = useGaps(content);

  const save = () => start(async () => { await saveLeadFormAction(content); setBaseline(content); });
  useSaveShortcut(dirty, save);

  const setField = (key: keyof LeadFormFields, value: string) =>
    setContent((c) => ({ ...c, [locale]: { ...c[locale], fields: { ...c[locale].fields, [key]: value } } }));
  const setServices = (v: string[]) => setContent((c) => ({ ...c, [locale]: { ...c[locale], services: v } }));
  const fillFrom = (from: Locale) => setContent((c) => ({ ...c, [locale]: fillEmptyFrom(c[locale], c[from]) }));

  return (
    <>
      <EditorBar locale={locale} setLocale={setLocale} gaps={gaps} dirty={dirty} saving={saving} onSave={save} onFillFrom={fillFrom}
        previewHref={locale === "en" ? "/" : `/${locale === "he" ? "heb" : locale}`} />

      <div className="st-editor">
        <div className="st-editor-main">
          {LEADFORM_SECTIONS.map((section) => (
            <Section key={section.title} title={section.title}>
              <FieldGrid fields={section.fields} values={d.fields} dir={dir} onChange={(k, v) => setField(k as keyof LeadFormFields, v)} />
            </Section>
          ))}

          <Section title={SERVICES_TITLE} hint="Порядок и количество менять нельзя">
            <p className="st-hint" style={{ marginBottom: 10 }}>По позиции в этом списке подставляется услуга текущей страницы — меняйте только текст.</p>
            <StringList items={d.services} onChange={setServices} dir={dir} fixed />
          </Section>
        </div>

        <SectionNav titles={[...LEADFORM_SECTIONS.map((s) => s.title), SERVICES_TITLE]} />
      </div>
    </>
  );
}
