"use client";

import { FormEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { trackLeadSubmitted } from "@/lib/tracking";

/**
 * "Get a quote" form — sits in the hero of every landing page, under the H1.
 *
 * The service dropdown preselects the page's own service. Slugs map to the
 * `services` list in the CMS by position, so that order is load-bearing: adding
 * or reordering rows there without touching this array will mis-assign defaults.
 */
export const SERVICE_ORDER = [
  "smm",
  "targeted-advertising",
  "seo",
  "google-ads",
  "photo-video",
  "marketing-strategy",
  "website-development",
  "automation",
  "geo-ai-seo",
] as const;

export type ServiceSlug = (typeof SERVICE_ORDER)[number];

type SubmitState = "idle" | "submitting" | "success" | "error";

function createEventId() {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm0 18.02h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24z" />
  </svg>
);

export function QuoteForm({ service }: { service?: ServiceSlug }) {
  const t = useTranslations("LeadForm");
  const options = t.raw("services") as string[];
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const submittedEventIdsRef = useRef(new Set<string>());

  // The page's own service, matched to the CMS list by position. The homepage
  // passes nothing and opens on the "not sure" placeholder, per the spec.
  const defaultService = service ? (options[SERVICE_ORDER.indexOf(service)] ?? "") : "";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const eventId = createEventId();
    const whatsappOptIn = formData.get("whatsappOptIn") === "on";
    const payload = {
      eventId,
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      business: String(formData.get("business") ?? "").trim(),
      service: String(formData.get("service") ?? "").trim(),
      page: window.location.href,
      utm: Object.fromEntries(new URLSearchParams(window.location.search)),
      // Meta WhatsApp opt-in — standalone consent captured at submission time.
      whatsappOptIn,
      whatsappConsent: whatsappOptIn
        ? { text: t("whatsappOptIn"), at: new Date().toISOString(), page: window.location.href }
        : undefined,
    };

    if (!payload.name || !payload.phone || !payload.email || !payload.business || !payload.service) {
      setState("error");
      setMessage(t("errorRequired"));
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Lead request failed");

      if (!submittedEventIdsRef.current.has(eventId)) {
        submittedEventIdsRef.current.add(eventId);
        trackLeadSubmitted({ eventId, service: payload.service, value: 1 });
      }
      setState("success");
      setMessage(t("success"));
      formRef.current?.reset();
    } catch {
      setState("error");
      setMessage(t("errorSend"));
    }
  }

  return (
    <form ref={formRef} className="qf" onSubmit={onSubmit} noValidate>
      <div className="qf-head">
        <span className="qf-head-ic" aria-hidden="true">
          <WhatsappIcon />
        </span>
        <p className="qf-title">{t("title")}</p>
      </div>

      <div className="qf-trust">
        <span className="qf-avatars" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="qf-trust-t">{t("trust")}</span>
      </div>

      <div className="qf-grid">
        <label className="qf-field">
          <span className="qf-label">{t("name")} *</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label className="qf-field">
          <span className="qf-label">{t("phone")} *</span>
          {/* tel + autocomplete so mobile offers the saved number, per the spec */}
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
        </label>
        <label className="qf-field">
          <span className="qf-label">{t("email")} *</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="qf-field">
          <span className="qf-label">{t("city")}</span>
          <input name="city" type="text" autoComplete="address-level2" />
        </label>
        <label className="qf-field qf-wide">
          <span className="qf-label">{t("business")} *</span>
          <input name="business" type="text" placeholder={t("businessPlaceholder")} required />
        </label>
        <label className="qf-field qf-wide">
          <span className="qf-label">{t("interestedIn")} *</span>
          <select name="service" defaultValue={defaultService} required>
            <option value="" disabled>
              {t("notSure")}
            </option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="qf-optin">
        <input type="checkbox" name="whatsappOptIn" />
        <span>{t("whatsappOptIn")}</span>
      </label>

      <button className="qf-submit" type="submit" disabled={state === "submitting"}>
        <WhatsappIcon className="qf-submit-ic" />
        {state === "submitting" ? t("sending") : t("submit")}
      </button>

      {message ? (
        <p className={`qf-msg${state === "error" ? " is-error" : " is-ok"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
