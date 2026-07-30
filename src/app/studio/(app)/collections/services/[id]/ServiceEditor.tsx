"use client";

import { useState, useTransition } from "react";
import { LOCALES, SERVICE_SECTIONS, type Locale, type ServiceBlock, type ServiceDoc, type ServiceFields } from "@/studio/lib/content-schema";
import { saveServiceAction } from "../../actions";
import { StringList } from "../../../content/_lists";
import { ImagePicker } from "../../../_ImagePicker";
import { EditorBar, FieldGrid, Section, SectionNav, fillEmptyFrom, useGaps, useSaveShortcut } from "../../../_editor";

const BLOCKS_TITLE = "Блоки страницы";
const GENERAL_TITLE = "Общее";

export function ServiceEditor({ initial }: { initial: ServiceDoc }) {
  const [doc, setDoc] = useState<ServiceDoc>(initial);
  const [baseline, setBaseline] = useState<ServiceDoc>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, start] = useTransition();

  const dirty = JSON.stringify(doc) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = doc.locales[locale];
  const gaps = useGaps(doc.locales);

  const save = () => start(async () => { await saveServiceAction(doc); setBaseline(doc); });
  useSaveShortcut(dirty, save);

  const setLoc = (patch: Partial<typeof d>) => setDoc((x) => ({ ...x, locales: { ...x.locales, [locale]: { ...x.locales[locale], ...patch } } }));
  const setField = (key: keyof ServiceFields, v: string) => setLoc({ fields: { ...d.fields, [key]: v } });
  const fillFrom = (from: Locale) => setDoc((x) => ({ ...x, locales: { ...x.locales, [locale]: fillEmptyFrom(x.locales[locale], x.locales[from]) } }));

  const mutBlocks = (fn: (b: ServiceBlock[]) => ServiceBlock[]) => setLoc({ blocks: fn(d.blocks.map((b) => ({ ...b, list: [...b.list] }))) });
  const setBlock = (bi: number, patch: Partial<ServiceBlock>) => mutBlocks((b) => { b[bi] = { ...b[bi], ...patch }; return b; });

  const prefix = locale === "en" ? "" : `/${locale === "he" ? "heb" : locale}`;

  return (
    <>
      <EditorBar locale={locale} setLocale={setLocale} gaps={gaps} dirty={dirty} saving={saving} onSave={save} onFillFrom={fillFrom}
        previewHref={`${prefix}/services/${doc.slug}`} />

      <div className="st-editor">
        <div className="st-editor-main">
          <Section title={GENERAL_TITLE} hint="Одинаково для всех языков">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div className="st-field" style={{ flex: "1 1 260px", marginBottom: 0 }}>
                <label className="st-label">Slug (только чтение)</label>
                <input className="st-input" value={doc.slug} readOnly style={{ opacity: 0.6 }} />
                <p className="st-hint">Адрес страницы привязан к коду — меняется только в разработке.</p>
              </div>
              <div className="st-field" style={{ width: 120, marginBottom: 0 }}>
                <label className="st-label" htmlFor="order">Порядок</label>
                <input id="order" className="st-input" type="number" value={doc.order} onChange={(e) => setDoc((x) => ({ ...x, order: Number(e.target.value) || 0 }))} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <ImagePicker label="Фото в шапке" valueId={doc.heroId} valueThumb={doc.heroThumb} onChange={(id, thumb) => setDoc((x) => ({ ...x, heroId: id, heroThumb: thumb }))} />
            </div>
          </Section>

          {SERVICE_SECTIONS.map((section) => (
            <Section key={section.title} title={section.title}>
              <FieldGrid fields={section.fields} values={d.fields} dir={dir} onChange={(k, v) => setField(k as keyof ServiceFields, v)} />
              {section.title === "Страница" ? (
                <div className="st-field" style={{ marginBottom: 0 }}>
                  <label className="st-label" style={{ display: "block", marginBottom: 8 }}>Абзацы вступления</label>
                  <StringList items={d.body} onChange={(v) => setLoc({ body: v })} dir={dir} addLabel="+ Абзац" max={30} multiline />
                </div>
              ) : null}
            </Section>
          ))}

          <Section title={BLOCKS_TITLE} hint="Секции с заголовком и списком">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {d.blocks.map((b, bi) => (
                <div key={bi} className="st-card-block">
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input className="st-input" dir={dir} placeholder="Заголовок блока" value={b.heading} onChange={(e) => setBlock(bi, { heading: e.target.value })} />
                    <button type="button" className="st-btn st-btn-ghost" title="Вверх" onClick={() => mutBlocks((a) => { if (bi === 0) return a; [a[bi - 1], a[bi]] = [a[bi], a[bi - 1]]; return a; })} disabled={bi === 0} style={{ padding: "8px 10px" }}>↑</button>
                    <button type="button" className="st-btn st-btn-ghost" title="Вниз" onClick={() => mutBlocks((a) => { if (bi === a.length - 1) return a; [a[bi + 1], a[bi]] = [a[bi], a[bi + 1]]; return a; })} disabled={bi === d.blocks.length - 1} style={{ padding: "8px 10px" }}>↓</button>
                    <button type="button" className="st-btn st-btn-ghost" title="Удалить" onClick={() => mutBlocks((a) => a.filter((_, j) => j !== bi))} style={{ padding: "8px 10px", color: "#e07a7a" }}>✕</button>
                  </div>
                  <textarea className="st-textarea" dir={dir} placeholder="Вступление" value={b.intro} onChange={(e) => setBlock(bi, { intro: e.target.value })} style={{ minHeight: 56 }} />
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--s-muted)" }}>
                    <input type="checkbox" checked={b.ordered} onChange={(e) => setBlock(bi, { ordered: e.target.checked })} />
                    Нумерованный (таймлайн)
                  </label>
                  <div>
                    <label className="st-label" style={{ display: "block", marginBottom: 6 }}>Список</label>
                    <StringList items={b.list} onChange={(v) => setBlock(bi, { list: v })} dir={dir} addLabel="+ Пункт" max={20} />
                  </div>
                </div>
              ))}
              {d.blocks.length < 12 ? (
                <button type="button" className="st-btn" onClick={() => mutBlocks((a) => [...a, { heading: "", intro: "", ordered: false, list: [] }])} style={{ alignSelf: "flex-start" }}>+ Добавить блок</button>
              ) : null}
            </div>
          </Section>
        </div>

        <SectionNav titles={[GENERAL_TITLE, ...SERVICE_SECTIONS.map((s) => s.title), BLOCKS_TITLE]} />
      </div>
    </>
  );
}
