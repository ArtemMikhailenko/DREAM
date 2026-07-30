"use client";

import { useRouter } from "next/navigation";
import type { Lead, LeadStatus } from "@/studio/lib/leads-schema";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  won: "Закрыта",
  lost: "Отказ",
};

export function StatusPill({ status }: { status: string | null }) {
  const s = (status ?? "new") as LeadStatus;
  return <span className={`st-pill ${s}`}>{STATUS_LABEL[s] ?? s}</span>;
}

export function formatDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);
}

export function LeadRow({ lead }: { lead: Lead }) {
  const router = useRouter();
  return (
    <tr onClick={() => router.push(`/studio/leads/${lead.id}`)}>
      <td>
        <div className="st-cell-name">{lead.name || "Без имени"}</div>
        {lead.city ? <div className="st-cell-sub">{lead.city}</div> : null}
      </td>
      <td>
        <div className="st-cell-mono">{lead.phone || "—"}</div>
        {lead.email ? <div className="st-cell-sub">{lead.email}</div> : null}
      </td>
      <td>{lead.service || <span style={{ color: "var(--s-faint)" }}>—</span>}</td>
      <td><StatusPill status={lead.status} /></td>
      <td className="st-cell-mono">{formatDate(lead.created_at)}</td>
    </tr>
  );
}
