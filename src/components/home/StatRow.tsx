import { CountUp } from "@/components/home/CountUp";

/**
 * Four headline numbers in one aligned row. Each column: a rule that fills on
 * hover, the number (prefix/unit in accent), and a short line under it.
 */
export function StatRow({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="sr">
      {items.map((it, i) => {
        const m = it.value.match(/^(\D*)(\d[\d.,]*)(.*)$/);
        const pre = m?.[1] ?? "", num = m?.[2] ?? it.value, post = m?.[3] ?? "";
        return (
          <div className="sr-item" key={i}>
            <span className="sr-rule" aria-hidden="true" />
            <span className="sr-n">0{i + 1}</span>
            <p className="sr-val" dir="ltr">
              {pre && <span className="sr-unit">{pre}</span>}
              <CountUp value={num} />
              {post && <span className="sr-unit">{post}</span>}
            </p>
            <p className="sr-label">{it.label}</p>
          </div>
        );
      })}
    </div>
  );
}
