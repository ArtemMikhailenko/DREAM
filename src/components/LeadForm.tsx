"use client";

import { FormEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { trackLeadSubmitted } from "@/lib/tracking";

type SubmitState = "idle" | "submitting" | "success" | "error";

function createEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function LeadForm() {
  const t = useTranslations("LeadForm");
  const serviceOptions = t.raw("services") as string[];
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const submittedEventIdsRef = useRef(new Set<string>());

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state === "submitting") {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const eventId = createEventId();
    const whatsappOptIn = formData.get("whatsappOptIn") === "on";
    const payload = {
      eventId,
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      business: String(formData.get("business") ?? "").trim(),
      service: String(formData.get("service") ?? "").trim(),
      budget: String(formData.get("budget") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      page: window.location.href,
      utm: Object.fromEntries(new URLSearchParams(window.location.search)),
      // Meta WhatsApp opt-in — standalone consent captured at submission time.
      whatsappOptIn,
      whatsappConsent: whatsappOptIn
        ? {
            text: t("whatsappOptIn"),
            at: new Date().toISOString(),
            page: window.location.href,
          }
        : undefined,
    };

    if (!payload.name || !payload.phone) {
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

      if (!response.ok) {
        throw new Error("Lead request failed");
      }

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
    <form ref={formRef} className="lead-form grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">
          {t("name")}
          <input className="field-control" name="name" autoComplete="name" required />
        </label>
        <label className="field-label">
          {t("phone")}
          <input className="field-control" name="phone" autoComplete="tel" required />
        </label>
      </div>
      {/* WhatsApp opt-in — standalone, NOT pre-checked, NOT required (Meta requirement) */}
      <label className="wa-optin flex items-start gap-3 text-sm leading-6 text-[color:var(--muted)]">
        <input className="mt-1" type="checkbox" name="whatsappOptIn" />
        <span>{t("whatsappOptIn")}</span>
      </label>
      <label className="field-label">
        {t("business")}
        <input className="field-control" name="business" placeholder={t("businessPlaceholder")} />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">
          {t("whatYouNeed")}
          <select className="field-control" name="service" defaultValue={serviceOptions[serviceOptions.length - 1]}>
            {serviceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="field-label">
          {t("budget")}
          <input className="field-control" name="budget" placeholder={t("budgetPlaceholder")} />
        </label>
      </div>
      <label className="field-label">
        {t("task")}
        <textarea className="field-control min-h-28 resize-y" name="message" placeholder={t("taskPlaceholder")} />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6 text-[color:var(--muted)]">
        <input className="mt-1" type="checkbox" name="consent" required />
        <span>{t("consent")}</span>
      </label>
      <button className="btn btn-dark w-full" disabled={state === "submitting"} type="submit">
        {state === "submitting" ? t("sending") : t("submit")}
      </button>
      {message ? (
        <p className={`status-box ${state === "success" ? "status-success" : "status-error"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
