import { NextResponse } from "next/server";
import {
  forwardLeadToCrm,
  isDuplicateEvent,
  logWhatsappConsent,
  parseCookies,
  sendMetaConversionsApi,
  validateLead,
  type LeadPayload,
} from "@/lib/lead";

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

  if (crmResult.status === "rejected") {
    return NextResponse.json(
      { ok: false, error: "CRM request failed", eventId: lead.eventId },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, eventId: lead.eventId });
}