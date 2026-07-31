/**
 * "Get a quote" form copy, verbatim from DC_seo/SEO_on_page.md → «Лид-форма Get a Quote».
 *
 * This lives in the seed rather than in messages/*.json because the form was
 * respecified after those files were written — they still describe the old brief
 * form (budget, task, free-text message) that the spec replaced.
 *
 * The `services` order is load-bearing: QuoteForm preselects a page's service by
 * position via SERVICE_ORDER.
 */
const list = (v: string[]) => v.map((text) => ({ text }));

export const FORM_COPY = {
  en: {
    title: "Get a quote",
    trust: "450+ happy customers",
    name: "Name",
    phone: "Phone / WhatsApp",
    email: "Email",
    city: "City (optional)",
    business: "Business field",
    businessPlaceholder: "e.g. real estate, restaurant, online store",
    interestedIn: "Interested in",
    notSure: "Not sure? Pick one",
    services: list([
      "SMM & Social Media Management",
      "Facebook & TikTok Advertising",
      "SEO Promotion",
      "Google Ads",
      "Photo & Video Production",
      "Marketing Strategy & Funnels",
      "Website Development",
      "Automation & Chatbots",
      "GEO / AI Optimization",
    ]),
    whatsappOptIn: "I agree to receive a WhatsApp message from dc.production about this request",
    submit: "Get a quote",
    sending: "Sending…",
    success:
      "Brief received. We'll get back to you within one business day with a first launch plan.",
    errorRequired: "Please fill in the required fields so we can get back to you.",
    errorSend: "We couldn't send your request. Please try again or reach us directly.",
  },
  ru: {
    title: "Получить расчёт",
    trust: "450+ довольных клиентов",
    name: "Имя",
    phone: "Телефон / WhatsApp",
    email: "Email",
    city: "Город (опционально)",
    business: "Сфера бизнеса",
    businessPlaceholder: "например: недвижимость, ресторан, интернет-магазин",
    interestedIn: "Интересует услуга",
    notSure: "Не уверены? Выберите",
    services: list([
      "SMM и ведение соцсетей",
      "Таргетированная реклама",
      "SEO продвижение",
      "Google Ads",
      "Фото и видео продакшн",
      "Маркетинговая стратегия и воронки",
      "Разработка сайтов",
      "Автоматизация и чат-боты",
      "GEO / AI оптимизация",
    ]),
    whatsappOptIn: "Я согласен(на) получить сообщение в WhatsApp от dc.production по этой заявке",
    submit: "Получить расчёт",
    sending: "Отправляем…",
    success: "Заявка получена. Вернёмся в течение одного рабочего дня с планом запуска.",
    errorRequired: "Заполните обязательные поля, чтобы мы могли вам ответить.",
    errorSend: "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.",
  },
  he: {
    title: "קבלו הצעת מחיר",
    trust: "+450 לקוחות מרוצים",
    name: "שם",
    phone: "טלפון / וואטסאפ",
    email: "Email",
    city: "עיר (לא חובה)",
    business: "תחום העסק",
    businessPlaceholder: 'לדוגמה: נדל"ן, מסעדה, חנות אונליין',
    interestedIn: "מעניין אתכם",
    notSure: "לא בטוחים? בחרו",
    services: list([
      "ניהול רשתות חברתיות ו-SMM",
      "פרסום ממומן בפייסבוק וטיקטוק",
      "קידום אורגני (SEO)",
      "Google Ads",
      "הפקת תוכן, צילום ווידאו",
      "אסטרטגיה שיווקית ומשפכי מכירות",
      "בניית אתרים",
      "אוטומציה וצ׳אטבוטים",
      "אופטימיזציית GEO / AI",
    ]),
    whatsappOptIn: "אני מסכים/ה לקבל הודעת וואטסאפ מ-dc.production בנוגע לפנייה הזו",
    submit: "קבלו הצעת מחיר",
    sending: "שולח…",
    success: "הפנייה התקבלה. נחזור אליכם תוך יום עסקים אחד עם תוכנית להשקה.",
    errorRequired: "מלאו את שדות החובה כדי שנוכל לחזור אליכם.",
    errorSend: "לא הצלחנו לשלוח את הפנייה. נסו שוב או פנו אלינו ישירות.",
  },
} as const;
