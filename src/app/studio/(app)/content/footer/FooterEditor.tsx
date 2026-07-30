"use client";

import { useState, useTransition } from "react";
import { FOOTER_SECTIONS, LOCALES, type FooterContent, type FooterFields, type Locale } from "@/studio/lib/content-schema";
import { saveFooterAction } from "../actions";
import { StringList } from "../_lists";
import { EditorBar, FieldGrid, Section, SectionNav, fillEmptyFrom, useGaps, useSaveShortcut } from "../../_editor";

export function FooterEditor({ initial }: { initial: FooterContent }) {
  const [content, setContent] = useState<FooterContent>(initial);
  const [baseline, setBaseline] = useState<FooterContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, start] = useTransition();

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = content[locale];
  const gaps = useGaps(content);

  const save = () => start(async () => { await saveFooterAction(content); setBaseline(content); });
  useSaveShortcut(dirty, save);

  const setField = (key: keyof FooterFields, value: string) =>
    setContent((c) => ({ ...c, [locale]: { ...c[locale], fields: { ...c[locale].fields, [key]: value } } }));
  const setServices = (v: string[]) => setContent((c) => ({ ...c, [locale]: { ...c[locale], services: v } }));
  const fillFrom = (from: Locale) => setContent((c) => ({ ...c, [locale]: fillEmptyFrom(c[locale], c[from]) }));

  return (
    <>
      <EditorBar locale={locale} setLocale={setLocale} gaps={gaps} dirty={dirty} saving={saving} onSave={save} onFillFrom={fillFrom}
        previewHref={locale === "en" ? "/" : `/${locale === "he" ? "heb" : locale}`} />

      <div className="st-editor">
        <div className="st-editor-main">
          {FOOTER_SECTIONS.map((section) => (
            <Section key={section.title} title={section.title}>
              <FieldGrid fields={section.fields} values={d.fields} dir={dir} onChange={(k, v) => setField(k as keyof FooterFields, v)} />
              {section.title === "Колонка «Услуги»" ? (
                <div className="st-field" style={{ marginBottom: 0 }}>
                  <label className="st-label" style={{ display: "block", marginBottom: 8 }}>Пункты списка</label>
                  <StringList items={d.services} onChange={setServices} dir={dir} addLabel="+ Пункт" max={12} />
                </div>
              ) : null}
            </Section>
          ))}
        </div>

        <SectionNav titles={FOOTER_SECTIONS.map((s) => s.title)} />
      </div>
    </>
  );
}
