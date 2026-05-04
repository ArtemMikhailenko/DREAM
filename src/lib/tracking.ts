type LeadTrackingPayload = {
  eventId: string;
  service?: string;
  value?: number;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    ttq?: {
      track?: (event: string, payload?: Record<string, unknown>) => void;
    };
  }
}

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const googleAdsConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
const enableDirectGoogleAds =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_DIRECT_TRACKING === "true";

function wasTracked(eventId: string) {
  const key = `dream_lead_${eventId}`;

  if (sessionStorage.getItem(key)) {
    return true;
  }

  sessionStorage.setItem(key, "1");
  return false;
}

export function trackLeadSubmitted(payload: LeadTrackingPayload) {
  if (wasTracked(payload.eventId)) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "lead_submit",
    event_id: payload.eventId,
    service: payload.service,
    value: payload.value ?? 1,
  });

  window.fbq?.("track", "Lead", {
    content_name: payload.service ?? "DREAM lead",
    value: payload.value ?? 1,
    currency: "USD",
  }, { eventID: payload.eventId });

  if (enableDirectGoogleAds && googleAdsId && googleAdsConversionLabel) {
    window.gtag?.("event", "conversion", {
      send_to: `${googleAdsId}/${googleAdsConversionLabel}`,
      transaction_id: payload.eventId,
      value: payload.value ?? 1,
      currency: "USD",
    });
  }

  window.ttq?.track?.("SubmitForm", {
    event_id: payload.eventId,
    content_name: payload.service ?? "DREAM lead",
    value: payload.value ?? 1,
    currency: "USD",
  });
}

export {};