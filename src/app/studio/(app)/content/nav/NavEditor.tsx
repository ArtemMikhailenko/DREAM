"use client";

import { useState, useTransition } from "react";
import { LOCALES, NAV_FIELDS, type Locale, type NavContent } from "@/studio/lib/content-schema";
import { saveNavAction } from "../actions";
import { EditorBar, FieldGrid, Section, fillEmptyFrom, useGaps, useSaveShortcut } from "../../_editor";

export function NavEditor({ initial }: { initial: NavContent }) {
  const [content, setContent] = useState<NavContent>(initial);
  const [baseline, setBaseline] = useState<NavContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, start] = useTransition();

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const gaps = useGaps(content);

  const save = () => start(async () => { await saveNavAction(content); setBaseline(content); });
  useSaveShortcut(dirty, save);

  const setField = (key: keyof NavContent[Locale], value: string) =>
    setContent((c) => ({ ...c, [locale]: { ...c[locale], [key]: value } }));
  const fillFrom = (from: Locale) => setContent((c) => ({ ...c, [locale]: fillEmptyFrom(c[locale], c[from]) }));

  return (
    <>
      <EditorBar locale={locale} setLocale={setLocale} gaps={gaps} dirty={dirty} saving={saving} onSave={save} onFillFrom={fillFrom}
        previewHref={locale === "en" ? "/" : `/${locale === "he" ? "heb" : locale}`} />

      <div className="st-editor-main">
        <Section title="Пункты меню" hint="Шапка сайта на всех страницах">
          <FieldGrid fields={NAV_FIELDS} values={content[locale]} dir={dir} onChange={(k, v) => setField(k as keyof NavContent[Locale], v)} />
        </Section>
      </div>
    </>
  );
}
