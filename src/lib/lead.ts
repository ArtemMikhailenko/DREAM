import { createHash } from "crypto";

export type WhatsappConsent = {
  /** Exact consent wording the user saw when opting in. */
  text: string;
  /** Client timestamp when the box was submitted (ISO). */
  at: string;
  /** Page/URL where consent was collected. */
  page?: string;
};

export type LeadPayload = {
  eventId: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  business?: string;
  service?: string;
  page?: string;
  utm?: Record<string, string>;
  /** Standalone WhatsApp opt-in (Meta). Optional — never a condition of the lead. */
  whatsappOptIn?: boolean;
  whatsappConsent?: WhatsappConsent;
};

type RequestContext = {
  ip?: string;
  userAgent?: string;
  cookies: Record<string, string>;
};

const processedEvents = new Map<string, number>();
const dedupeWindowMs = 1000 * 60 * 60 * 6;

export function isDuplicateEvent(eventId: string) {
  const now = Date.now();

  for (const [key, timestamp] of processedEvents) {
    if (now - timestamp > dedupeWindowMs) {
      processedEvents.delete(key);
    }
  }

  if (processedEvents.has(eventId)) {
    return true;
  }

  processedEvents.set(eventId, now);
  return false;
}

/**
 * The quote form marks name, phone, email, business field and service as required.
 * City is optional and the WhatsApp opt-in must never gate a submission.
 */
export function validateLead(payload: Partial<LeadPayload>) {
  return Boolean(
    payload.eventId &&
      payload.name &&
      payload.phone &&
      payload.email &&
      payload.business &&
      payload.service,
  );
}

export async function forwardLeadToCrm(payload: LeadPayload) {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  if (!webhookUrl) {
    return { skipped: true };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CRM_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({
      source: "dcprod-website",
      lead: payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`CRM request failed: ${response.status}`);
  }

  return { skipped: false };
}

export async function sendMetaConversionsApi(
  payload: LeadPayload,
  context: RequestContext,
) {
  const pixelId = process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return { skipped: true };
  }

  const response = await fetch(
    `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            event_id: payload.eventId,
            action_source: "website",
            event_source_url: payload.page,
            user_data: {
              client_ip_address: context.ip,
              client_user_agent: context.userAgent,
              ph: hashValue(payload.phone),
              fn: hashValue(payload.name.split(" ")[0]),
              fbp: context.cookies._fbp,
              fbc: context.cookies._fbc,
            },
            custom_data: {
              content_name: payload.service ?? "dc.prod lead",
              value: 1,
              currency: "USD",
            },
          },
        ],
        ...(process.env.META_TEST_EVENT_CODE
          ? { test_event_code: process.env.META_TEST_EVENT_CODE }
          : {}),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Meta CAPI request failed: ${response.status}`);
  }

  return { skipped: false };
}

/**
 * Persist a provable WhatsApp opt-in record (Meta may request it):
 * who, when, where, and the exact consent wording shown.
 * Always writes an audit log line; also POSTs to CONSENT_LOG_WEBHOOK_URL when set
 * (e.g. a Google Sheet / Zapier / DB endpoint) for durable storage.
 */
export async function logWhatsappConsent(
  payload: LeadPayload,
  context: RequestContext,
) {
  if (!payload.whatsappOptIn) {
    return { skipped: true as const };
  }

  const record = {
    type: "whatsapp_opt_in",
    eventId: payload.eventId,
    name: payload.name,
    phone: payload.phone,
    consentText: payload.whatsappConsent?.text ?? null,
    // Server timestamp is authoritative; client timestamp kept for reference.
    collectedAt: new Date().toISOString(),
    clientAt: payload.whatsappConsent?.at ?? null,
    source: payload.whatsappConsent?.page ?? payload.page ?? null,
    ip: context.ip ?? null,
    userAgent: context.userAgent ?? null,
  };

  // Audit trail (captured by the platform's log drain).
  console.info(`[whatsapp-consent] ${JSON.stringify(record)}`);

  const webhookUrl = process.env.CONSENT_LOG_WEBHOOK_URL;
  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONSENT_LOG_TOKEN
          ? { Authorization: `Bearer ${process.env.CONSENT_LOG_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error(`Consent log failed: ${response.status}`);
    }
  }

  return { skipped: false as const };
}

export function parseCookies(cookieHeader: string | null) {
  return Object.fromEntries(
    (cookieHeader ?? "")
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const [key, ...value] = cookie.split("=");
        return [key, decodeURIComponent(value.join("="))];
      }),
  );
}

function hashValue(value?: string) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  return createHash("sha256").update(normalized).digest("hex");
}