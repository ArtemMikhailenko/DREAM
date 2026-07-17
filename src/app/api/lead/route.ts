import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
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
 * Store a copy of the lead in the CMS so the team still has it if the CRM webhook
 * is down or misconfigured. Never block the response on it — a failed archive must
 * not lose a lead that the CRM already accepted.
 */
async function archiveLead(lead: LeadPayload, crmForwarded: boolean) {
  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "leads",
      // Bypass the collection's `create: false` rule — this route is the only writer.
      overrideAccess: true,
      data: {
        eventId: lead.eventId,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        city: lead.city,
        business: lead.business,
        service: lead.service,
        page: lead.page,
        utm: lead.utm ?? {},
        whatsappOptIn: Boolean(lead.whatsappOptIn),
        status: "new",
        crmForwarded,
      },
    });
  } catch (err) {
    console.error("[lead] could not archive to CMS:", err);
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