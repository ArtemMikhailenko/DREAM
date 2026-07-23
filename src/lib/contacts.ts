/**
 * Single source of truth for the studio's contact details and social links.
 *
 * Used by the nav, the footer and the service-page CTAs so a change lands
 * everywhere at once. WhatsApp stays env-overridable (NEXT_PUBLIC_WHATSAPP_URL)
 * because the same number drives the Meta click-to-chat tracking.
 */
export const CONTACTS = {
  email: "dreamchaseprod@gmail.com",
  // E.164 for tel: links; the spaced form is for display only.
  phone: "+972528111506",
  phoneDisplay: "+972 52 811 1506",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/972528111506",
  instagram: "https://www.instagram.com/dreamchase.prod",
  facebook: "https://www.facebook.com/share/1W6eKemxjZ/",
} as const;
