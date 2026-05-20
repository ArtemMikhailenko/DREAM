import { createHash } from "crypto";

export type LeadPayload = {
  eventId: string;
  name: string;
  phone: string;
  business?: string;
  service?: string;
  budget?: string;
  message?: string;
  page?: string;
  utm?: Record<string, string>;
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

export function validateLead(payload: Partial<LeadPayload>) {
  return Boolean(payload.eventId && payload.name && payload.phone);
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