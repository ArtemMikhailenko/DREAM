"use client";

import { useState, useTransition } from "react";
import { HOME_SECTIONS, LOCALES, type HomeCards, type HomeContent, type HomeFields, type HomeImages, type Locale } from "@/studio/lib/content-schema";
import { saveHomeAction, saveHomeImagesAction, saveHomeCardsAction } from "../actions";
import { ObjectList, StringList } from "../_lists";
import { ImagePicker } from "../../_ImagePicker";
import { EditorBar, FieldGrid, Section, SectionNav, fillEmptyFrom, useGaps, useSaveShortcut } from "../../_editor";

type LocData = HomeContent[Locale];

const EXTRA_SECTIONS = ["Тарифы", "Карточки услуг и кейсов"];

export function HomeEditor({ initial, initialImages, initialCards }: { initial: HomeContent; initialImages: HomeImages; initialCards: HomeCards }) {
  const [content, setContent] = useState<HomeContent>(initial);
  const [images, setImages] = useState<HomeImages>(initialImages);
  const [cards, setCards] = useState<HomeCards>(initialCards);
  const [base, setBase] = useState({ content: initial, images: initialImages, cards: initialCards });
  const [locale, setLocale] = useState<Locale>("ru");
  const [saving, start] = useTransition();

  const contentDirty = JSON.stringify(content) !== JSON.stringify(base.content);
  const imagesDirty = JSON.stringify(images) !== JSON.stringify(base.images);
  const cardsDirty = JSON.stringify(cards) !== JSON.stringify(base.cards);
  const dirty = contentDirty || imagesDirty || cardsDirty;

  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = content[locale];
  const gaps = useGaps(content);

  // One button saves everything that changed — text, images and cards together.
  const save = () => start(async () => {
    if (contentDirty) await saveHomeAction(content);
    if (imagesDirty) await saveHomeImagesAction(images.bgId, images.bgMobileId);
    if (cardsDirty) await saveHomeCardsAction(cards);
    setBase({ content, images, cards });
  });
  useSaveShortcut(dirty, save);

  const patch = (p: Partial<LocData>) => setContent((c) => ({ ...c, [locale]: { ...c[locale], ...p } }));
  const setField = (key: keyof HomeFields, value: string) => patch({ fields: { ...d.fields, [key]: value } });
  const fillFrom = (from: Locale) => setContent((c) => ({ ...c, [locale]: fillEmptyFrom(c[locale], c[from]) }));

  const mutPricing = (fn: (a: LocData["pricing"]) => LocData["pricing"]) => patch({ pricing: fn(d.pricing.map((p) => ({ ...p, rows: [...p.rows] }))) });
  const setPkg = (pi: number, k: "name" | "tag" | "price" | "priceOld" | "time", v: string) => mutPricing((a) => { a[pi] = { ...a[pi], [k]: v }; return a; });

  const mutSvc = (fn: (a: HomeCards["services"]) => HomeCards["services"]) => setCards((c) => ({ ...c, services: fn(c.services.map((x) => ({ ...x, text: { ...x.text } }))) }));
  const setSvcText = (i: number, k: "title" | "text", v: string) => mutSvc((a) => { a[i] = { ...a[i], text: { ...a[i].text, [locale]: { ...a[i].text[locale], [k]: v } } }; return a; });
  const setSvcDeliv = (i: number, list: string[]) => mutSvc((a) => { a[i] = { ...a[i], text: { ...a[i].text, [locale]: { ...a[i].text[locale], deliverables: list } } }; return a; });

  const mutPf = (fn: (a: HomeCards["portfolio"]) => HomeCards["portfolio"]) => setCards((c) => ({ ...c, portfolio: fn(c.portfolio.map((x) => ({ ...x, text: { ...x.text } }))) }));
  const setPfText = (i: number, k: "title" | "tag", v: string) => mutPf((a) => { a[i] = { ...a[i], text: { ...a[i].text, [locale]: { ...a[i].text[locale], [k]: v } } }; return a; });

  const renderList = (id: NonNullable<(typeof HOME_SECTIONS)[number]["list"]>) => {
    switch (id) {
      case "rail":
        return <StringList items={d.rail} onChange={(v) => patch({ rail: v })} dir={dir} addLabel="+ Пункт" max={20} />;
      case "problem":
        return <ObjectList items={d.problem} onChange={(v) => patch({ problem: v })} dir={dir} addLabel="+ Проблема"
          fields={[{ key: "title", placeholder: "Заголовок" }, { key: "text", placeholder: "Текст", multiline: true }]} newItem={() => ({ title: "", text: "" })} />;
      case "process":
        return <ObjectList items={d.process} onChange={(v) => patch({ process: v })} dir={dir} addLabel="+ Шаг"
          fields={[{ key: "name", placeholder: "Название шага" }, { key: "desc", placeholder: "Описание", multiline: true }]} newItem={() => ({ name: "", desc: "" })} />;
      case "results":
        return <StringList items={d.results} onChange={(v) => patch({ results: v })} dir={dir} fixed multiline />;
      case "faq":
        return <ObjectList items={d.faq} onChange={(v) => patch({ faq: v })} dir={dir} addLabel="+ Вопрос" max={20}
          fields={[{ key: "q", placeholder: "Вопрос" }, { key: "a", placeholder: "Ответ", multiline: true }]} newItem={() => ({ q: "", a: "" })} />;
    }
  };

  return (
    <>
      <EditorBar locale={locale} setLocale={setLocale} gaps={gaps} dirty={dirty} saving={saving} onSave={save} onFillFrom={fillFrom} previewHref={locale === "en" ? "/" : `/${locale === "he" ? "heb" : locale}`} />

      <div className="st-editor">
        <div className="st-editor-main">
          {HOME_SECTIONS.map((section) => (
            <Section key={section.title} title={section.title} hint={section.note}>
              <FieldGrid fields={section.fields} values={d.fields} dir={dir} onChange={(k, v) => setField(k as keyof HomeFields, v)} />

              {/* The hero images belong with the hero copy, not in a separate block. */}
              {section.title === "Первый экран" ? (
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 6 }}>
                  <ImagePicker label="Фон (десктоп)" valueId={images.bgId} valueThumb={images.bgThumb} onChange={(id, thumb) => setImages((s) => ({ ...s, bgId: id, bgThumb: thumb }))} />
                  <ImagePicker label="Фон (мобайл)" valueId={images.bgMobileId} valueThumb={images.bgMobileThumb} onChange={(id, thumb) => setImages((s) => ({ ...s, bgMobileId: id, bgMobileThumb: thumb }))} />
                </div>
              ) : null}

              {section.list ? (
                <div className="st-field" style={{ marginBottom: 0 }}>
                  {section.list === "results" ? <p className="st-hint" style={{ marginBottom: 8 }}>Числа заданы в коде страницы — здесь только подписи.</p> : null}
                  {renderList(section.list)}
                </div>
              ) : null}
            </Section>
          ))}

          <Section title="Тарифы" hint="Пакеты в блоке цен">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {d.pricing.map((p, pi) => (
                <div key={pi} className="st-card-block">
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input className="st-input" dir={dir} placeholder="Название пакета" value={p.name} onChange={(e) => setPkg(pi, "name", e.target.value)} />
                    <button type="button" className="st-btn st-btn-ghost" title="Удалить" onClick={() => mutPricing((a) => a.filter((_, j) => j !== pi))} style={{ padding: "8px 10px", color: "#e07a7a" }}>✕</button>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input className="st-input" dir={dir} placeholder="Цена" value={p.price} onChange={(e) => setPkg(pi, "price", e.target.value)} style={{ flex: "1 1 110px" }} />
                    <input className="st-input" dir={dir} placeholder="Старая цена" value={p.priceOld} onChange={(e) => setPkg(pi, "priceOld", e.target.value)} style={{ flex: "1 1 110px" }} />
                    <input className="st-input" dir={dir} placeholder="Срок" value={p.time} onChange={(e) => setPkg(pi, "time", e.target.value)} style={{ flex: "1 1 110px" }} />
                    <input className="st-input" dir={dir} placeholder="Бейдж" value={p.tag} onChange={(e) => setPkg(pi, "tag", e.target.value)} style={{ flex: "1 1 110px" }} />
                  </div>
                  <div>
                    <label className="st-label" style={{ display: "block", marginBottom: 6 }}>Что входит</label>
                    <ObjectList items={p.rows} onChange={(v) => mutPricing((a) => { a[pi] = { ...a[pi], rows: v }; return a; })} dir={dir} addLabel="+ Пункт" max={20}
                      fields={[{ key: "name", placeholder: "Пункт" }, { key: "extra", placeholder: "Уточнение (напр. «3 поста»)" }]} newItem={() => ({ name: "", extra: "" })} />
                  </div>
                </div>
              ))}
              {d.pricing.length < 8 ? (
                <button type="button" className="st-btn" onClick={() => mutPricing((a) => [...a, { name: "", tag: "", price: "", priceOld: "", time: "", rows: [] }])} style={{ alignSelf: "flex-start" }}>+ Добавить пакет</button>
              ) : null}
            </div>
          </Section>

          <Section title="Карточки услуг и кейсов" hint="Картинка общая для всех языков">
            <div className="st-label" style={{ fontSize: "0.66rem", margin: "0 0 10px" }}>Услуги</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cards.services.map((c, i) => (
                <div key={i} className="st-card-block">
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="button" className="st-btn st-btn-ghost" onClick={() => mutSvc((a) => a.filter((_, j) => j !== i))} style={{ padding: "6px 10px", color: "#e07a7a" }}>✕ удалить</button>
                  </div>
                  <ImagePicker label="Картинка карточки" valueId={c.imageId} valueThumb={c.imageThumb} onChange={(id, thumb) => mutSvc((a) => { a[i] = { ...a[i], imageId: id, imageThumb: thumb }; return a; })} />
                  <input className="st-input" dir={dir} placeholder="Заголовок" value={c.text[locale].title} onChange={(e) => setSvcText(i, "title", e.target.value)} />
                  <textarea className="st-textarea" dir={dir} placeholder="Описание" value={c.text[locale].text} onChange={(e) => setSvcText(i, "text", e.target.value)} style={{ minHeight: 56 }} />
                  <div>
                    <label className="st-label" style={{ display: "block", marginBottom: 6 }}>Что входит</label>
                    <StringList items={c.text[locale].deliverables} onChange={(v) => setSvcDeliv(i, v)} dir={dir} addLabel="+ Пункт" max={12} />
                  </div>
                </div>
              ))}
              {cards.services.length < 8 ? (
                <button type="button" className="st-btn" onClick={() => mutSvc((a) => [...a, { imageId: null, imageThumb: null, text: { en: { title: "", text: "", deliverables: [] }, ru: { title: "", text: "", deliverables: [] }, he: { title: "", text: "", deliverables: [] } } }])} style={{ alignSelf: "flex-start" }}>+ Добавить услугу</button>
              ) : null}
            </div>

            <div className="st-label" style={{ fontSize: "0.66rem", margin: "22px 0 10px" }}>Кейсы</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cards.portfolio.map((c, i) => (
                <div key={i} className="st-card-block">
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="button" className="st-btn st-btn-ghost" onClick={() => mutPf((a) => a.filter((_, j) => j !== i))} style={{ padding: "6px 10px", color: "#e07a7a" }}>✕ удалить</button>
                  </div>
                  <ImagePicker label="Обложка кейса" valueId={c.imageId} valueThumb={c.imageThumb} onChange={(id, thumb) => mutPf((a) => { a[i] = { ...a[i], imageId: id, imageThumb: thumb }; return a; })} />
                  <input className="st-input" dir={dir} placeholder="Заголовок" value={c.text[locale].title} onChange={(e) => setPfText(i, "title", e.target.value)} />
                  <input className="st-input" dir={dir} placeholder="Тег" value={c.text[locale].tag} onChange={(e) => setPfText(i, "tag", e.target.value)} />
                </div>
              ))}
              {cards.portfolio.length < 8 ? (
                <button type="button" className="st-btn" onClick={() => mutPf((a) => [...a, { imageId: null, imageThumb: null, text: { en: { title: "", tag: "" }, ru: { title: "", tag: "" }, he: { title: "", tag: "" } } }])} style={{ alignSelf: "flex-start" }}>+ Добавить кейс</button>
              ) : null}
            </div>
          </Section>
        </div>

        <SectionNav titles={[...HOME_SECTIONS.map((s) => s.title), ...EXTRA_SECTIONS]} />
      </div>
    </>
  );
}
