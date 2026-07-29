"use client";

import { useRouter } from "next/navigation";
import type { CaseListItem } from "@/studio/lib/content-schema";

export function CasesTable({ items }: { items: CaseListItem[] }) {
  const router = useRouter();
  return (
    <div className="st-table-wrap">
      <table className="st-table">
        <thead>
          <tr><th style={{ width: 70 }}>Порядок</th><th>Название</th><th>Тег</th><th>Slug</th></tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} onClick={() => router.push(`/studio/collections/cases/${c.id}`)}>
              <td className="st-cell-mono">{c.order}</td>
              <td className="st-cell-name">{c.title || "Без названия"}</td>
              <td>{c.tag || <span style={{ color: "var(--s-faint)" }}>—</span>}</td>
              <td className="st-cell-mono">{c.slug}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
