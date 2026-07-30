import { NextResponse } from "next/server";
import { query } from "@/studio/lib/db";
import {
  forwardLeadToCrm,
  isDuplicateEvent,
  logWhatsappConsent,
  parseCookies,
  sendMetaConversionsApi,
  validateLead,
  type LeadPayload,
} from "@/lib/lead";

/**
 * Store a copy of the lead in the database so the team still has it if the CRM
 * webhook is down or misconfigured. Never block the response on it — a failed
 * archive must not lose a lead the CRM already accepted. The event_id unique index
 * dedupes retries.
 */
async function archiveLead(lead: LeadPayload, crmForwarded: boolean) {
  try {
    await query(
      `INSERT INTO leads (event_id, name, phone, email, city, business, service, page, utm, whatsapp_opt_in, status, crm_forwarded, updated_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, 'new'::enum_leads_status, $11, now(), now())
       ON CONFLICT (event_id) DO NOTHING`,
      [
        lead.eventId, lead.name, lead.phone, lead.email ?? null, lead.city ?? null, lead.business ?? null,
        lead.service ?? null, lead.page ?? null, JSON.stringify(lead.utm ?? {}), Boolean(lead.whatsappOptIn), crmForwarded,
      ],
    );
  } catch (err) {
    console.error("[lead] could not archive to DB:", err);
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<LeadPayload>;

  if (!validateLead(payload)) {
    return NextResponse.json({ ok: false, error: "Invalid lead" }, { status: 400 });
  }

  const lead = payload as LeadPayload;

  if (isDuplicateEvent(lead.eventId)) {
    return NextResponse.json({ ok: true, duplicate: true, eventId: lead.eventId });
  }

  const headers = request.headers;
  const context = {
    ip: headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: headers.get("user-agent") ?? undefined,
    cookies: parseCookies(headers.get("cookie")),
  };

  const [crmResult] = await Promise.allSettled([
    forwardLeadToCrm(lead),
    sendMetaConversionsApi(lead, context),
    logWhatsappConsent(lead, context),
  ]);

  await archiveLead(lead, crmResult.status === "fulfilled");

  if (crmResult.status === "rejected") {
    return NextResponse.json(
      { ok: false, error: "CRM request failed", eventId: lead.eventId },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, eventId: lead.eventId });
}