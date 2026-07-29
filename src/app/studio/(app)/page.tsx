import Link from "next/link";
import { countByStatus, listLeads } from "@/studio/lib/leads";
import { LeadRow } from "./leads/LeadRow";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  let counts: Record<string, number> & { total: number } = { total: 0 } as never;
  let recent: Awaited<ReturnType<typeof listLeads>> = [];
  let dbError = false;
  try {
    [counts, recent] = await Promise.all([countByStatus(), listLeads()]);
    recent = recent.slice(0, 6);
  } catch {
    dbError = true;
  }

  const stats = [
    { n: counts.total ?? 0, l: "Всего заявок" },
    { n: counts.new ?? 0, l: "Новые" },
    { n: counts.in_progress ?? 0, l: "В работе" },
    { n: counts.won ?? 0, l: "Закрыты" },
  ];

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">Обзор</h1>
          <p className="st-sub">Сводка по заявкам с сайта</p>
        </div>
        <Link href="/studio/leads" className="st-btn st-btn-primary">Все заявки →</Link>
      </div>

      {dbError ? (
        <div className="st-error">Не удалось подключиться к базе. Проверьте DATABASE_URI.</div>
      ) : (
        <>
          <div className="st-stats">
            {stats.map((s) => (
              <div className="st-stat" key={s.l}>
                <div className="st-stat-n">{s.n}</div>
                <div className="st-stat-l">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="st-head" style={{ marginBottom: 14 }}>
            <h2 className="st-title" style={{ fontSize: "1.1rem" }}>Последние заявки</h2>
            <Link href="/studio/leads" className="st-btn st-btn-ghost">Открыть все</Link>
          </div>

          {recent.length === 0 ? (
            <div className="st-card st-empty"><div className="st-empty-ic">📭</div>Пока нет заявок</div>
          ) : (
            <div className="st-table-wrap">
              <table className="st-table">
                <thead>
                  <tr><th>Имя</th><th>Контакты</th><th>Услуга</th><th>Статус</th><th>Дата</th></tr>
                </thead>
                <tbody>
                  {recent.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
