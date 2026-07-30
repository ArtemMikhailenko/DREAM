/**
 * Client-safe half of the leads model: types and the status list only. Keeping it
 * free of ./db means client components can import STATUSES without dragging `pg`
 * into the browser bundle (which fails the build on Node built-ins).
 */

export type LeadStatus = "new" | "in_progress" | "won" | "lost";

export type Lead = {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  business: string | null;
  service: string | null;
  status: LeadStatus | null;
  note: string | null;
  page: string | null;
  locale: string | null;
  whatsapp_opt_in: boolean | null;
  utm: Record<string, unknown> | null;
  crm_forwarded: boolean | null;
  created_at: string;
  updated_at: string;
};

export const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "Новые" },
  { value: "in_progress", label: "В работе" },
  { value: "won", label: "Закрыты" },
  { value: "lost", label: "Отказ" },
];
