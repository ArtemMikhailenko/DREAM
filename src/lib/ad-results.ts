/**
 * Real campaigns from our clients' Meta ad accounts (Ads Manager, Nov 2026).
 * Kept as data rather than screenshots so each language shows its own currency:
 * shekels on the Hebrew site, euros on the Spanish one, dollars everywhere else
 * (we advertise in Israel, Dubai and Europe). Amounts are stored in shekels as
 * Ads Manager reported them and converted at a fixed rate for display.
 */
export type Metric = "msg" | "visits" | "reach";
export type Objective = "engagement" | "traffic" | "awareness";
export type AdCampaign = {
  thumb: string;
  name: string;
  active?: boolean;
  objective: Objective;
  metric: Metric;
  results: string; // as Ads Manager shows it: "601", "1.1K"
  cost: number; // per result (per 1,000 reached for reach), in ILS
  spent: number; // ILS
};

const t = (n: string) => `/results/thumbs/${n}.webp`;
const USD = 3.7; // ILS per dollar, Bambooka's account reports in dollars

export const AD_CAMPAIGNS: AdCampaign[] = [
  { thumb: t("vitlion-zip"), name: "VITLION | RU + HE | ZIP · BIO · NEESAFOT", active: true, objective: "engagement", metric: "msg", results: "1.1K", cost: 27.84, spent: 31680 },
  { thumb: t("vitala-collection"), name: "new collection 26/7/26", objective: "engagement", metric: "msg", results: "601", cost: 9.7, spent: 5830 },
  { thumb: t("anna-hadera"), name: "Anna Massage | WhatsApp | Hadera", active: true, objective: "engagement", metric: "msg", results: "142", cost: 18.65, spent: 2650 },
  { thumb: t("vitlion-mechanics"), name: "MECHANICS videos campaign", objective: "engagement", metric: "msg", results: "599", cost: 34.95, spent: 20930 },
  { thumb: t("vitala-launch"), name: "Запуск 25 мая Израиль", objective: "engagement", metric: "msg", results: "585", cost: 3.38, spent: 1980 },
  { thumb: t("alum-glazing"), name: "Кампания на остекление карусель иврит", objective: "engagement", metric: "msg", results: "521", cost: 28.94, spent: 15080 },
  { thumb: t("vitlion-pergola"), name: "ויטליון | נאספות | מוכן להרכבה | WhatsApp", objective: "engagement", metric: "msg", results: "124", cost: 6.48, spent: 803.7 },
  { thumb: t("ilana-awareness"), name: "awar ALL MITUS WITH TEXT VIDEOS", objective: "awareness", metric: "reach", results: "156.6K", cost: 9.78, spent: 1530 },
  { thumb: t("alum-pergolas"), name: "Перголы раздвижные на WhatsApp иврит", objective: "engagement", metric: "msg", results: "452", cost: 29.42, spent: 13300 },
  { thumb: t("flyfit"), name: "heb campaign + rus postiks", objective: "engagement", metric: "msg", results: "162", cost: 17.22, spent: 2790 },
  { thumb: t("vitlion-driver"), name: "nahag helper", objective: "engagement", metric: "msg", results: "209", cost: 12.59, spent: 2630 },
  { thumb: t("anna-traffic"), name: "traffic anna full creatives", objective: "traffic", metric: "visits", results: "11.8K", cost: 0.12, spent: 1410 },
  { thumb: t("vitlion-installers"), name: "VITLION | Установщики | RU | Центр | WhatsApp", active: true, objective: "engagement", metric: "msg", results: "137", cost: 19.98, spent: 2740 },
  { thumb: t("vitlion-sales"), name: "moherim sales", objective: "engagement", metric: "msg", results: "215", cost: 20.19, spent: 4340 },
  { thumb: t("anna-women"), name: "campaign engagement ad+ off just women", objective: "engagement", metric: "msg", results: "173", cost: 12.55, spent: 2170 },
  { thumb: t("ilana-center"), name: "posts to wa CENTER", objective: "engagement", metric: "msg", results: "144", cost: 29.74, spent: 4280 },
  { thumb: t("vitlion-zip2"), name: "ויטליון | זיפ | מוכן להרכבה | WhatsApp", objective: "engagement", metric: "msg", results: "106", cost: 7.72, spent: 818.43 },
  { thumb: t("vitala-videos"), name: "wa videos on profile", objective: "engagement", metric: "msg", results: "94", cost: 11.71, spent: 1100 },
  { thumb: t("vitlion-pvc"), name: "ויטליון | פי וי סי | מוכן להרכבה | WhatsApp", objective: "engagement", metric: "msg", results: "90", cost: 9.07, spent: 816.37 },
  { thumb: t("evntop"), name: "wa evntop", objective: "engagement", metric: "msg", results: "87", cost: 16.41, spent: 1430 },
  { thumb: t("realfit"), name: "Real FIT | WhatsApp ONLY | Conversations", active: true, objective: "engagement", metric: "msg", results: "75", cost: 25.24, spent: 1890 },
  { thumb: t("ladym"), name: "LADY M campaign posts", objective: "engagement", metric: "msg", results: "69", cost: 18.89, spent: 1300 },
  { thumb: t("bambooka"), name: "BAMBOOKA | Engagement WhatsApp | General + Problems", active: true, objective: "engagement", metric: "msg", results: "63", cost: 12.43 * USD, spent: 783.16 * USD },
  { thumb: t("ilana-ru"), name: "ILANA | RU | WA | Posts", objective: "engagement", metric: "msg", results: "59", cost: 16.81, spent: 992.06 },
  { thumb: t("enza"), name: "ENZA | WhatsApp | Women | Online + Hadera", objective: "engagement", metric: "msg", results: "55", cost: 11.49, spent: 631.96 },
  { thumb: t("evnvideos"), name: "full videos 3", objective: "traffic", metric: "visits", results: "788", cost: 0.46, spent: 360.36 },
];

/** Currency by site language: ₪ on Hebrew, € on Spanish, $ elsewhere. */
export type Currency = { sym: string; perIls: number };
export const currencyFor = (locale: string): Currency =>
  locale === "he" ? { sym: "₪", perIls: 1 } : locale === "es" ? { sym: "€", perIls: 1 / 4.0 } : { sym: "$", perIls: 1 / USD };

/** Ads Manager style: 2,740 → "2.74K", 9.7 → "9.70" */
export function money(ils: number, c: Currency): string {
  const v = ils * c.perIls;
  return c.sym + (v >= 1000 ? `${(v / 1000).toFixed(2)}K` : v.toFixed(2));
}

export const adLabels = (l: string) =>
  ({
    ru: { msg: "Начатые переписки", visits: "Переходы в профиль", reach: "Охват", cost: "Цена за результат", costReach: "Цена за 1 000 охвата", spent: "Потрачено", active: "Активна", off: "Выкл.", engagement: "Вовлечённость", traffic: "Трафик", awareness: "Узнаваемость" },
    he: { msg: "שיחות שהתחילו", visits: "כניסות לפרופיל", reach: "חשיפה", cost: "עלות לתוצאה", costReach: "עלות ל-1,000 חשיפות", spent: "הוצאה", active: "פעיל", off: "כבוי", engagement: "מעורבות", traffic: "תנועה", awareness: "מודעות" },
    es: { msg: "Conversaciones iniciadas", visits: "Visitas al perfil", reach: "Alcance", cost: "Coste por resultado", costReach: "Coste por 1.000 personas", spent: "Gastado", active: "Activa", off: "Desactivada", engagement: "Interacción", traffic: "Tráfico", awareness: "Reconocimiento" },
    ar: { msg: "محادثات بدأت", visits: "زيارات الملف", reach: "الوصول", cost: "تكلفة النتيجة", costReach: "تكلفة 1,000 وصول", spent: "المصروف", active: "نشطة", off: "متوقفة", engagement: "تفاعل", traffic: "زيارات", awareness: "الوعي" },
  } as Record<string, Record<string, string>>)[l] ?? { msg: "Messaging conversations started", visits: "Profile and page visits", reach: "Reach", cost: "Cost per result", costReach: "Cost per 1,000 reached", spent: "Spent", active: "Active", off: "Off", engagement: "Engagement", traffic: "Traffic", awareness: "Awareness" };
