"use client";

import { useRouter } from "next/navigation";
import type { TestimonialListItem } from "@/studio/lib/content-schema";

export function TestimonialsTable({ items }: { items: TestimonialListItem[] }) {
  const router = useRouter();
  return (
    <div className="st-table-wrap">
      <table className="st-table">
        <thead>
          <tr><th style={{ width: 70 }}>Порядок</th><th>Имя</th><th>Компания</th></tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id} onClick={() => router.push(`/studio/collections/testimonials/${t.id}`)}>
              <td className="st-cell-mono">{t.order}</td>
              <td className="st-cell-name">{t.name || "Без имени"}</td>
              <td>{t.company || <span style={{ color: "var(--s-faint)" }}>—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
