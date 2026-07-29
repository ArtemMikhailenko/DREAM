"use client";

import { useState, useTransition } from "react";
import { STATUSES, type LeadStatus } from "@/studio/lib/leads";
import { saveNoteAction, updateStatusAction } from "../actions";

export function LeadControls({
  id,
  status,
  note,
  phone,
  email,
}: {
  id: number;
  status: LeadStatus;
  note: string;
  phone: string | null;
  email: string | null;
}) {
  const [curStatus, setCurStatus] = useState<LeadStatus>(status);
  const [noteText, setNoteText] = useState(note);
  const [savedNote, setSavedNote] = useState(note);
  const [pending, start] = useTransition();
  const [savingNote, startNote] = useTransition();

  const digits = (phone ?? "").replace(/\D/g, "");

  const changeStatus = (next: LeadStatus) => {
    setCurStatus(next);
    start(() => updateStatusAction(id, next));
  };

  const saveNote = () => {
    startNote(async () => {
      await saveNoteAction(id, noteText);
      setSavedNote(noteText);
    });
  };

  return (
    <div className="st-card st-detail-side">
      <div className="st-field">
        <label className="st-label">Статус</label>
        <select
          className="st-select"
          value={curStatus}
          disabled={pending}
          onChange={(e) => changeStatus(e.target.value as LeadStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="st-field">
        <label className="st-label">Заметка менеджера</label>
        <textarea
          className="st-textarea"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Комментарий по заявке…"
        />
        <button
          className="st-btn st-btn-primary"
          onClick={saveNote}
          disabled={savingNote || noteText === savedNote}
          style={{ justifyContent: "center" }}
        >
          {savingNote ? "Сохраняем…" : noteText === savedNote ? "Сохранено" : "Сохранить заметку"}
        </button>
      </div>

      <div className="st-field" style={{ marginBottom: 0 }}>
        <label className="st-label">Быстрые действия</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {digits ? (
            <a className="st-btn" href={`https://wa.me/${digits}`} target="_blank" rel="noopener" style={{ justifyContent: "center" }}>WhatsApp</a>
          ) : null}
          {phone ? <a className="st-btn" href={`tel:${phone}`} style={{ justifyContent: "center" }}>Позвонить</a> : null}
          {email ? <a className="st-btn" href={`mailto:${email}`} style={{ justifyContent: "center" }}>Написать на email</a> : null}
        </div>
      </div>
    </div>
  );
}
