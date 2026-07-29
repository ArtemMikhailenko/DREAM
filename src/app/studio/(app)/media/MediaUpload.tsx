"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadMediaAction } from "./actions";

export function MediaUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const uploadFiles = (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) { setError("Выберите изображение"); return; }
    setError(null);
    start(async () => {
      let done = 0;
      for (const file of list) {
        setProgress(`Загрузка ${done + 1} из ${list.length}…`);
        const fd = new FormData();
        fd.append("file", file);
        const res = await uploadMediaAction(fd);
        if (!res.ok) { setError(`${file.name}: ${res.error}`); break; }
        done++;
      }
      setProgress(null);
      router.refresh();
    });
  };

  return (
    <div style={{ marginBottom: 22 }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragOver ? "var(--s-accent)" : "var(--s-line-2)"}`,
          borderRadius: "var(--s-radius)",
          background: dragOver ? "var(--s-accent-soft)" : "var(--s-panel)",
          padding: "28px 20px",
          textAlign: "center",
          cursor: pending ? "default" : "pointer",
          transition: "border-color .16s, background .16s",
        }}
      >
        <div style={{ fontSize: "1.6rem", marginBottom: 6, opacity: 0.7 }}>⬆️</div>
        <div style={{ fontWeight: 600 }}>{pending ? (progress ?? "Загрузка…") : "Перетащите изображения сюда или нажмите для выбора"}</div>
        <div className="st-sub" style={{ fontSize: "0.8rem", marginTop: 4 }}>JPG, PNG, WebP · до 12 МБ · превью создаются автоматически</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          disabled={pending}
          onChange={(e) => { if (e.target.files?.length) uploadFiles(e.target.files); e.target.value = ""; }}
        />
      </div>
      {error ? <div className="st-error" style={{ marginTop: 12 }}>{error}</div> : null}
    </div>
  );
}
