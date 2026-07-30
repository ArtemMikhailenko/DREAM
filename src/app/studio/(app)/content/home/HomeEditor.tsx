"use client";

import { useState, useTransition } from "react";
import { HOME_SECTIONS, LOCALES, type HomeContent, type HomeFields, type HomeImages, type Locale } from "@/studio/lib/content-schema";
import { saveHomeAction, saveHomeImagesAction } from "../actions";
import { ObjectList, StringList } from "../_lists";
import { ImagePicker } from "../../_ImagePicker";

type LocData = HomeContent[Locale];

export function HomeEditor({ initial, initialImages }: { initial: HomeContent; initialImages: HomeImages }) {
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
      </div>
    </>
  );
}
