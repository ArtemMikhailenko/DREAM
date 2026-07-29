import Link from "next/link";
import { countByStatus, listLeads, STATUSES, type LeadStatus } from "@/studio/lib/leads";
import { LeadRow } from "./LeadRow";

export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const active = STATUSES.find((s) => s.value === status)?.value as LeadStatus | undefined;

  let leads: Awaited<ReturnType<typeof listLeads>> = [];
  let counts: Record<string, number> & { total: number } = { total: 0 } as never;
  let dbError = false;
  try {
    [leads, counts] = await Promise.all([listLeads(active), countByStatus()]);
  } catch {
    dbError = true;
  }

  return (
    <>
      <div className="st-head">
        <div>
          <h1 className="st-title">Заявки</h1>
          <p className="st-sub">Заявки, оставленные через формы на сайте</p>
        </div>
      </div>

      {dbError ? (
        <div className="st-error">Не удалось подключиться к базе. Проверьте DATABASE_URI.</div>
      ) : (
        <>
          <div className="st-tabs">
            <Link href="/studio/leads" className={`st-tab${!active ? " active" : ""}`}>
              Все <span className="st-tab-count">{counts.total ?? 0}</span>
            </Link>
            {STATUSES.map((s) => (
              <Link key={s.value} href={`/studio/leads?status=${s.value}`} className={`st-tab${active === s.value ? " active" : ""}`}>
                {s.label} <span className="st-tab-count">{counts[s.value] ?? 0}</span>
              </Link>
            ))}
          </div>

          {leads.length === 0 ? (
            <div className="st-card st-empty"><div className="st-empty-ic">📭</div>Заявок в этом статусе нет</div>
          ) : (
            <div className="st-table-wrap">
              <table className="st-table">
                <thead>
                  <tr><th>Имя</th><th>Контакты</th><th>Услуга</th><th>Статус</th><th>Дата</th></tr>
                </thead>
                <tbody>
                  {leads.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
