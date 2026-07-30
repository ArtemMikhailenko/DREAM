"use client";

import { useState, useTransition } from "react";
import { LOCALES, type Locale } from "@/studio/lib/content-schema";
import type { GlobalContent, GlobalUi } from "@/studio/lib/globals-schema";
import { saveGlobalAction } from "../actions";
import { ObjectList, StringList } from "../../content/_lists";
import { EditorBar, FieldGrid, Section, SectionNav, fillEmptyFrom, useGaps, useSaveShortcut } from "../../_editor";

/** Where each global shows up on the site, for the preview link. */
const PREVIEW: Record<string, string> = {
  "services-index": "/services",
  "portfolio-page": "/portfolio",
  "testimonials-page": "/testimonials",
  showreel: "/",
};

export function GlobalEditor({ globalKey, ui, initial }: { globalKey: string; ui: GlobalUi; initial: GlobalContent }) {
  const [content, setContent] = useState<GlobalContent>(initial);
  const [baseline, setBaseline] = useState<GlobalContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, start] = useTransition();

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = content[locale];
  const gaps = useGaps(content);

  const save = () => start(async () => { await saveGlobalAction(globalKey, content); setBaseline(content); });
  useSaveShortcut(dirty, save);

  const setField = (key: string, v: string) => setContent((c) => ({ ...c, [locale]: { ...c[locale], fields: { ...c[locale].fields, [key]: v } } }));
  const setList = (id: string, v: string[] | Record<string, string>[]) => setContent((c) => ({ ...c, [locale]: { ...c[locale], lists: { ...c[locale].lists, [id]: v } } }));
  const fillFrom = (from: Locale) => setContent((c) => ({ ...c, [locale]: fillEmptyFrom(c[locale], c[from]) }));

  const base = PREVIEW[globalKey] ?? "/";
  const prefix = locale === "en" ? "" : `/${locale === "he" ? "heb" : locale}`;

  return (
    <>
      <EditorBar locale={locale} setLocale={setLocale} gaps={gaps} dirty={dirty} saving={saving} onSave={save} onFillFrom={fillFrom}
        previewHref={`${prefix}${base === "/" ? "" : base}` || "/"} />

      <div className="st-editor">
        <div className="st-editor-main">
          {ui.sections.map((section) => (
            <Section key={section.title} title={section.title}>
              <FieldGrid fields={section.fields} values={d.fields} dir={dir} onChange={setField} />
            </Section>
          ))}

          {ui.lists.map((list) => (
            <Section key={list.id} title={list.title} hint={list.note}>
              {list.kind === "string" ? (
                <StringList items={(d.lists[list.id] ?? []) as string[]} onChange={(v) => setList(list.id, v)} dir={dir} addLabel={list.addLabel} max={30} multiline={list.multiline} />
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
            </Section>
          ))}
        </div>

        <SectionNav titles={[...ui.sections.map((s) => s.title), ...ui.lists.map((l) => l.title)]} />
      </div>
    </>
  );
}
