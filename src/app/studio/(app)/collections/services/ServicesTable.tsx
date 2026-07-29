"use client";

import { useRouter } from "next/navigation";
import type { ServiceListItem } from "@/studio/lib/content-schema";

export function ServicesTable({ items }: { items: ServiceListItem[] }) {
  const router = useRouter();
  return (
    <div className="st-table-wrap">
      <table className="st-table">
        <thead>
          <tr><th style={{ width: 70 }}>Порядок</th><th>Название</th><th>H1</th><th>Slug</th></tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id} onClick={() => router.push(`/studio/collections/services/${s.id}`)}>
              <td className="st-cell-mono">{s.order}</td>
              <td className="st-cell-name">{s.label || "—"}</td>
              <td>{s.h1 || <span style={{ color: "var(--s-faint)" }}>—</span>}</td>
              <td className="st-cell-mono">{s.slug}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
