"use client";

import { useState, useTransition } from "react";
import { ABOUT_SECTIONS, LOCALES, type AboutContent, type AboutFields, type AboutLocaleData, type Locale } from "@/studio/lib/content-schema";
import { saveAboutAction } from "../actions";
import { ObjectList, StringList } from "../_lists";
import { EditorBar, FieldGrid, Section, SectionNav, fillEmptyFrom, useGaps, useSaveShortcut } from "../../_editor";

export function AboutEditor({ initial }: { initial: AboutContent }) {
  const [content, setContent] = useState<AboutContent>(initial);
  const [baseline, setBaseline] = useState<AboutContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, start] = useTransition();

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = content[locale];
  const gaps = useGaps(content);

  const save = () => start(async () => { await saveAboutAction(content); setBaseline(content); });
  useSaveShortcut(dirty, save);

  const patch = (p: Partial<AboutLocaleData>) => setContent((c) => ({ ...c, [locale]: { ...c[locale], ...p } }));
  const setField = (key: keyof AboutFields, value: string) => patch({ fields: { ...d.fields, [key]: value } });
  const fillFrom = (from: Locale) => setContent((c) => ({ ...c, [locale]: fillEmptyFrom(c[locale], c[from]) }));

  return (
    <>
      <EditorBar locale={locale} setLocale={setLocale} gaps={gaps} dirty={dirty} saving={saving} onSave={save} onFillFrom={fillFrom}
        previewHref={locale === "en" ? "/about" : `/${locale === "he" ? "heb" : locale}/about`} />

      <div className="st-editor">
        <div className="st-editor-main">
          {ABOUT_SECTIONS.map((section) => (
            <Section key={section.title} title={section.title}>
              <FieldGrid fields={section.fields} values={d.fields} dir={dir} onChange={(k, v) => setField(k as keyof AboutFields, v)} />

              {section.list === "capabilities" ? (
                <div className="st-field" style={{ marginBottom: 0 }}>
                  <label className="st-label" style={{ display: "block", marginBottom: 8 }}>Компетенции</label>
                  <StringList items={d.capabilities} onChange={(v) => patch({ capabilities: v })} dir={dir} addLabel="+ Компетенция" max={20} />
                </div>
              ) : null}

              {section.list === "values" ? (
                <div className="st-field" style={{ marginBottom: 0 }}>
                  <label className="st-label" style={{ display: "block", marginBottom: 8 }}>Принципы</label>
                  <ObjectList items={d.values} onChange={(v) => patch({ values: v })} dir={dir} addLabel="+ Принцип" max={12}
                    fields={[{ key: "title", placeholder: "Заголовок" }, { key: "desc", placeholder: "Описание", multiline: true }]} newItem={() => ({ title: "", desc: "" })} />
                </div>
              ) : null}

              {section.list === "stats" ? (
                <div className="st-field" style={{ marginBottom: 0 }}>
                  <label className="st-label" style={{ display: "block", marginBottom: 6 }}>Подписи к цифрам</label>
                  <p className="st-hint" style={{ marginBottom: 8 }}>Сами числа заданы в коде страницы — порядок и количество фиксированы.</p>
                  <StringList items={d.stats} onChange={(v) => patch({ stats: v })} dir={dir} fixed multiline />
                </div>
              ) : null}
            </Section>
          ))}
        </div>

        <SectionNav titles={ABOUT_SECTIONS.map((s) => s.title)} />
      </div>
    </>
  );
}
