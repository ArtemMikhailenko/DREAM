"use client";

import { FormEvent, useRef, useState } from "react";
import { trackLeadSubmitted } from "@/lib/tracking";

type SubmitState = "idle" | "submitting" | "success" | "error";

const serviceOptions = [
  "Видео",
  "Реклама",
  "SMM",
  "Полная связка",
];

function createEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `lead_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function LeadForm() {
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
    };

    if (!payload.name || !payload.phone) {
      setState("error");
      setMessage("Заполните имя и телефон, чтобы мы могли связаться.");
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
      setMessage("Заявка отправлена. DREAM свяжется с вами и предложит первый план запуска.");
      formRef.current?.reset();
    } catch {
      setState("error");
      setMessage("Не получилось отправить заявку. Попробуйте еще раз или напишите напрямую.");
    }
  }

  return (
    <form ref={formRef} className="lead-form grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">
          Имя
          <input className="field-control" name="name" autoComplete="name" required />
        </label>
        <label className="field-label">
          Телефон
          <input className="field-control" name="phone" autoComplete="tel" required />
        </label>
      </div>
      <label className="field-label">
        Бизнес
        <input className="field-control" name="business" placeholder="Ниша, город, продукт" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-label">
          Что нужно
          <select className="field-control" name="service" defaultValue="Полная связка">
            {serviceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Бюджет
          <input className="field-control" name="budget" placeholder="Например, от $1500" />
        </label>
      </div>
      <label className="field-label">
        Задача
        <textarea className="field-control min-h-28 resize-y" name="message" placeholder="Что продаете и какой результат нужен" />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6 text-[#555555]">
        <input className="mt-1" type="checkbox" name="consent" required />
        <span>Согласен на обработку данных и получение ответа по заявке.</span>
      </label>
      <button className="btn btn-dark w-full" disabled={state === "submitting"} type="submit">
        {state === "submitting" ? "Отправляем..." : "Отправить заявку"}
      </button>
      {message ? (
        <p className={`status-box ${state === "success" ? "status-success" : "status-error"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}