import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead } from "@/studio/lib/leads";
import { StatusPill, formatDate } from "../LeadRow";
import { LeadControls } from "./LeadControls";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) notFound();

  const lead = await getLead(leadId);
  if (!lead) notFound();

  const rows: [string, React.ReactNode][] = [
    ["Телефон", lead.phone || "—"],
    ["Email", lead.email || "—"],
    ["Город", lead.city || "—"],
    ["Сфера", lead.business || "—"],
    ["Услуга", lead.service || "—"],
    ["Страница", lead.page || "—"],
    ["Язык", lead.locale || "—"],
    ["WhatsApp-согласие", lead.whatsapp_opt_in ? "Да" : "Нет"],
    ["В CRM", lead.crm_forwarded ? "Отправлена" : "Нет"],
    ["Создана", formatDate(lead.created_at)],
  ];

  const utmEntries = lead.utm && typeof lead.utm === "object" ? Object.entries(lead.utm as Record<string, unknown>) : [];

  return (
    <>
      <Link href="/studio/leads" className="st-back">← К заявкам</Link>

      <div className="st-head">
        <div>
          <h1 className="st-title">{lead.name || "Без имени"}</h1>
          <p className="st-sub">Заявка №{lead.id} · {formatDate(lead.created_at)}</p>
        </div>
        <StatusPill status={lead.status} />
      </div>

      <div className="st-detail">
        <div className="st-card st-detail-main">
          {rows.map(([k, v]) => (
            <div className="st-kv" key={k}>
              <div className="st-kv-k">{k}</div>
              <div className="st-kv-v">{v}</div>
            </div>
          ))}
          {utmEntries.length > 0 ? (
            <div className="st-kv">
              <div className="st-kv-k">UTM-метки</div>
              <div className="st-kv-v">
                {utmEntries.map(([k, v]) => (
                  <div key={k} className="st-cell-mono">{k}: {String(v)}</div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <LeadControls
          id={lead.id}
          status={(lead.status ?? "new")}
          note={lead.note ?? ""}
          phone={lead.phone}
          email={lead.email}
        />
      </div>
    </>
  );
}
