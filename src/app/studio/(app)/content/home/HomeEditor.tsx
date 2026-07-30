"use client";

import { useState, useTransition } from "react";
import { HOME_SECTIONS, LOCALES, type HomeCards, type HomeContent, type HomeFields, type HomeImages, type Locale } from "@/studio/lib/content-schema";
import { saveHomeAction, saveHomeImagesAction, saveHomeCardsAction } from "../actions";
import { ObjectList, StringList } from "../_lists";
import { ImagePicker } from "../../_ImagePicker";

type LocData = HomeContent[Locale];

export function HomeEditor({ initial, initialImages, initialCards }: { initial: HomeContent; initialImages: HomeImages; initialCards: HomeCards }) {
  const [content, setContent] = useState<HomeContent>(initial);
  const [baseline, setBaseline] = useState<HomeContent>(initial);
  const [locale, setLocale] = useState<Locale>("ru");
  const [pending, start] = useTransition();
  const [justSaved, setJustSaved] = useState(false);

  const dirty = JSON.stringify(content) !== JSON.stringify(baseline);
  const dir = LOCALES.find((l) => l.code === locale)?.rtl ? "rtl" : "ltr";
  const d = content[locale];

  const patch = (p: Partial<LocData>) => {
    setContent((c) => ({ ...c, [locale]: { ...c[locale], ...p } }));
    setJustSaved(false);
  };
  const setField = (key: keyof HomeFields, value: string) => patch({ fields: { ...d.fields, [key]: value } });

  const mutPricing = (fn: (a: LocData["pricing"]) => LocData["pricing"]) => patch({ pricing: fn(d.pricing.map((p) => ({ ...p, rows: [...p.rows] }))) });
  const setPkg = (pi: number, k: "name" | "tag" | "price" | "priceOld" | "time", v: string) => mutPricing((a) => { a[pi] = { ...a[pi], [k]: v }; return a; });
  const setPkgRows = (pi: number, rows: { name: string; extra: string }[]) => mutPricing((a) => { a[pi] = { ...a[pi], rows }; return a; });
  const addPkg = () => mutPricing((a) => [...a, { name: "", tag: "", price: "", priceOld: "", time: "", rows: [] }]);
  const removePkg = (pi: number) => mutPricing((a) => a.filter((_, j) => j !== pi));
  const movePkg = (pi: number, dr: -1 | 1) => mutPricing((a) => { const j = pi + dr; if (j < 0 || j >= a.length) return a; [a[pi], a[j]] = [a[j], a[pi]]; return a; });

  const save = () => start(async () => {
    await saveHomeAction(content);
    setBaseline(content);
    setJustSaved(true);
  });

  // Hero background images — non-localized, saved separately.
  const [images, setImages] = useState<HomeImages>(initialImages);
  const [imgBase, setImgBase] = useState<HomeImages>(initialImages);
  const [savingImg, startImg] = useTransition();
  const imgDirty = JSON.stringify(images) !== JSON.stringify(imgBase);
  const saveImages = () => startImg(async () => {
    await saveHomeImagesAction(images.bgId, images.bgMobileId);
    setImgBase(images);
  });

  // Cards (services + portfolio): shared image + per-locale text, saved separately.
  const [cards, setCards] = useState<HomeCards>(initialCards);
  const [cardsBase, setCardsBase] = useState<HomeCards>(initialCards);
  const [savingCards, startCards] = useTransition();
  const cardsDirty = JSON.stringify(cards) !== JSON.stringify(cardsBase);
  const saveCards = () => startCards(async () => { await saveHomeCardsAction(cards); setCardsBase(cards); });

  const mutSvc = (fn: (a: HomeCards["services"]) => HomeCards["services"]) => setCards((c) => ({ ...c, services: fn(c.services.map((x) => ({ ...x, text: { ...x.text } }))) }));
  const setSvcText = (i: number, k: "title" | "text", v: string) => mutSvc((a) => { a[i] = { ...a[i], text: { ...a[i].text, [locale]: { ...a[i].text[locale], [k]: v } } }; return a; });
  const setSvcDeliv = (i: number, list: string[]) => mutSvc((a) => { a[i] = { ...a[i], text: { ...a[i].text, [locale]: { ...a[i].text[locale], deliverables: list } } }; return a; });
  const setSvcImg = (i: number, id: number | null, thumb: string | null) => mutSvc((a) => { a[i] = { ...a[i], imageId: id, imageThumb: thumb }; return a; });
  const addSvc = () => mutSvc((a) => [...a, { imageId: null, imageThumb: null, text: { en: { title: "", text: "", deliverables: [] }, ru: { title: "", text: "", deliverables: [] }, he: { title: "", text: "", deliverables: [] } } }]);
  const removeSvc = (i: number) => mutSvc((a) => a.filter((_, j) => j !== i));

  const mutPf = (fn: (a: HomeCards["portfolio"]) => HomeCards["portfolio"]) => setCards((c) => ({ ...c, portfolio: fn(c.portfolio.map((x) => ({ ...x, text: { ...x.text } }))) }));
  const setPfText = (i: number, k: "title" | "tag", v: string) => mutPf((a) => { a[i] = { ...a[i], text: { ...a[i].text, [locale]: { ...a[i].text[locale], [k]: v } } }; return a; });
  const setPfImg = (i: number, id: number | null, thumb: string | null) => mutPf((a) => { a[i] = { ...a[i], imageId: id, imageThumb: thumb }; return a; });
  const addPf = () => mutPf((a) => [...a, { imageId: null, imageThumb: null, text: { en: { title: "", tag: "" }, ru: { title: "", tag: "" }, he: { title: "", tag: "" } } }]);
  const removePf = (i: number) => mutPf((a) => a.filter((_, j) => j !== i));

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
        return (
          <>
            <p className="st-sub" style={{ margin: "0 0 12px", fontSize: "0.82rem" }}>Числа заданы в коде страницы — здесь только подписи. Порядок и количество фиксированы.</p>
            <StringList items={d.results} onChange={(v) => patch({ results: v })} dir={dir} fixed multiline />
          </>
        );
      case "faq":
        return <ObjectList items={d.faq} onChange={(v) => patch({ faq: v })} dir={dir} addLabel="+ Вопрос" max={20}
          fields={[{ key: "q", placeholder: "Вопрос" }, { key: "a", placeholder: "Ответ", multiline: true }]} newItem={() => ({ q: "", a: "" })} />;
    }
  };

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
        <div className="st-card" style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div className="st-label" style={{ fontSize: "0.7rem", margin: 0 }}>Фон героя (общий для всех языков)</div>
            <button type="button" className="st-btn st-btn-primary" onClick={saveImages} disabled={!imgDirty || savingImg} style={{ padding: "7px 14px" }}>
              {savingImg ? "Сохраняем…" : imgDirty ? "Сохранить фон" : "Фон сохранён"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <ImagePicker label="Фон (десктоп)" valueId={images.bgId} valueThumb={images.bgThumb}
              onChange={(id, thumb) => setImages((s) => ({ ...s, bgId: id, bgThumb: thumb }))} />
            <ImagePicker label="Фон (мобайл)" valueId={images.bgMobileId} valueThumb={images.bgMobileThumb}
              onChange={(id, thumb) => setImages((s) => ({ ...s, bgMobileId: id, bgMobileThumb: thumb }))} />
          </div>
        </div>

        {HOME_SECTIONS.map((section) => (
          <div className="st-card" style={{ padding: "22px 24px" }} key={section.title}>
            <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>{section.title}</div>

            {section.fields.map((f) => (
              <div className="st-field" key={f.key}>
                <label className="st-label" htmlFor={f.key}>{f.label}</label>
                {f.multiline
                  ? <textarea id={f.key} className="st-textarea" dir={dir} value={d.fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />
                  : <input id={f.key} className="st-input" dir={dir} value={d.fields[f.key]} onChange={(e) => setField(f.key, e.target.value)} />}
              </div>
            ))}

            {section.list ? <div className="st-field" style={{ marginBottom: 0 }}>{renderList(section.list)}</div> : null}

            {section.note ? <p className="st-sub" style={{ margin: "12px 0 0", fontSize: "0.8rem", color: "var(--s-faint)" }}>ⓘ {section.note}</p> : null}
          </div>
        ))}

        <div className="st-card" style={{ padding: "22px 24px" }}>
          <div className="st-label" style={{ marginBottom: 16, fontSize: "0.7rem" }}>Тарифы — пакеты ({locale.toUpperCase()})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {d.pricing.map((p, pi) => (
              <div key={pi} style={{ border: "1px solid var(--s-line-2)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input className="st-input" dir={dir} placeholder="Название пакета" value={p.name} onChange={(e) => setPkg(pi, "name", e.target.value)} />
                  <button type="button" className="st-btn st-btn-ghost" onClick={() => movePkg(pi, -1)} disabled={pi === 0} style={{ padding: "8px 10px" }}>↑</button>
                  <button type="button" className="st-btn st-btn-ghost" onClick={() => movePkg(pi, 1)} disabled={pi === d.pricing.length - 1} style={{ padding: "8px 10px" }}>↓</button>
                  <button type="button" className="st-btn st-btn-ghost" onClick={() => removePkg(pi)} style={{ padding: "8px 10px", color: "#e07a7a" }}>✕</button>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input className="st-input" dir={dir} placeholder="Цена" value={p.price} onChange={(e) => setPkg(pi, "price", e.target.value)} style={{ flex: "1 1 110px" }} />
                  <input className="st-input" dir={dir} placeholder="Старая цена" value={p.priceOld} onChange={(e) => setPkg(pi, "priceOld", e.target.value)} style={{ flex: "1 1 110px" }} />
                  <input className="st-input" dir={dir} placeholder="Срок" value={p.time} onChange={(e) => setPkg(pi, "time", e.target.value)} style={{ flex: "1 1 110px" }} />
                  <input className="st-input" dir={dir} placeholder="Бейдж" value={p.tag} onChange={(e) => setPkg(pi, "tag", e.target.value)} style={{ flex: "1 1 110px" }} />
                </div>
                <div>
                  <label className="st-label" style={{ display: "block", marginBottom: 6 }}>Что входит</label>
                  <ObjectList items={p.rows} onChange={(v) => setPkgRows(pi, v)} dir={dir} addLabel="+ Пункт" max={20}
                    fields={[{ key: "name", placeholder: "Пункт" }, { key: "extra", placeholder: "Уточнение (напр. «3 поста»)" }]} newItem={() => ({ name: "", extra: "" })} />
                </div>
              </div>
            ))}
            {d.pricing.length < 8 ? <button type="button" className="st-btn" onClick={addPkg} style={{ alignSelf: "flex-start" }}>+ Добавить пакет</button> : null}
          </div>
        </div>

        <div className="st-card" style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div className="st-label" style={{ fontSize: "0.7rem", margin: 0 }}>Карточки услуг и кейсов ({locale.toUpperCase()})</div>
            <button type="button" className="st-btn st-btn-primary" onClick={saveCards} disabled={!cardsDirty || savingCards} style={{ padding: "7px 14px" }}>
              {savingCards ? "Сохраняем…" : cardsDirty ? "Сохранить карточки" : "Карточки сохранены"}
            </button>
          </div>
          <p className="st-sub" style={{ margin: "0 0 16px", fontSize: "0.82rem" }}>Текст — на каждом языке; картинка общая для всех языков.</p>

          <div className="st-label" style={{ fontSize: "0.66rem", margin: "6px 0 10px" }}>Услуги (три направления)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cards.services.map((c, i) => (
              <div key={i} style={{ border: "1px solid var(--s-line-2)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="button" className="st-btn st-btn-ghost" onClick={() => removeSvc(i)} style={{ padding: "6px 10px", color: "#e07a7a" }}>✕ удалить</button>
                </div>
                <ImagePicker label="Картинка карточки" valueId={c.imageId} valueThumb={c.imageThumb} onChange={(id, thumb) => setSvcImg(i, id, thumb)} />
                <input className="st-input" dir={dir} placeholder="Заголовок" value={c.text[locale].title} onChange={(e) => setSvcText(i, "title", e.target.value)} />
                <textarea className="st-textarea" dir={dir} placeholder="Описание" value={c.text[locale].text} onChange={(e) => setSvcText(i, "text", e.target.value)} style={{ minHeight: 56 }} />
                <div>
                  <label className="st-label" style={{ display: "block", marginBottom: 6 }}>Что входит</label>
                  <StringList items={c.text[locale].deliverables} onChange={(v) => setSvcDeliv(i, v)} dir={dir} addLabel="+ Пункт" max={12} />
                </div>
              </div>
            ))}
            {cards.services.length < 8 ? <button type="button" className="st-btn" onClick={addSvc} style={{ alignSelf: "flex-start" }}>+ Добавить услугу</button> : null}
          </div>

          <div className="st-label" style={{ fontSize: "0.66rem", margin: "22px 0 10px" }}>Кейсы</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cards.portfolio.map((c, i) => (
              <div key={i} style={{ border: "1px solid var(--s-line-2)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="button" className="st-btn st-btn-ghost" onClick={() => removePf(i)} style={{ padding: "6px 10px", color: "#e07a7a" }}>✕ удалить</button>
                </div>
                <ImagePicker label="Обложка кейса" valueId={c.imageId} valueThumb={c.imageThumb} onChange={(id, thumb) => setPfImg(i, id, thumb)} />
                <input className="st-input" dir={dir} placeholder="Заголовок" value={c.text[locale].title} onChange={(e) => setPfText(i, "title", e.target.value)} />
                <input className="st-input" dir={dir} placeholder="Тег" value={c.text[locale].tag} onChange={(e) => setPfText(i, "tag", e.target.value)} />
              </div>
            ))}
            {cards.portfolio.length < 8 ? <button type="button" className="st-btn" onClick={addPf} style={{ alignSelf: "flex-start" }}>+ Добавить кейс</button> : null}
          </div>
        </div>
      </div>
    </>
  );
}
