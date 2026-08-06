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
    lintrk?: (action: string, payload?: Record<string, unknown>) => void;
  }
}

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const googleAdsConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
const enableDirectGoogleAds =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_DIRECT_TRACKING === "true";
// LinkedIn conversions need a numeric conversion id defined in Campaign Manager
// (Analyze → Conversion tracking). Left unset until that conversion exists.
const linkedInConversionId = process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_ID;

function wasTracked(eventId: string) {
  const key = `dcprod_lead_${eventId}`;

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
    content_name: payload.service ?? "dc.production lead",
    value: payload.value ?? 1,
    currency: "USD",
  }, { eventID: payload.eventId });

  // GA4 lead conversion. Without this GA4 only ever sees page views — mark
  // generate_lead as a Key Event in GA4 to count it as a conversion.
  if (gaId) {
    window.gtag?.("event", "generate_lead", {
      send_to: gaId,
      transaction_id: payload.eventId,
      value: payload.value ?? 1,
      currency: "USD",
      service: payload.service,
    });
  }

  if (linkedInConversionId) {
    window.lintrk?.("track", { conversion_id: Number(linkedInConversionId) });
  }

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
    content_name: payload.service ?? "dc.production lead",
    value: payload.value ?? 1,
    currency: "USD",
  });
}

export {};