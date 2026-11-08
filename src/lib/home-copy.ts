/**
 * UI copy for the redesigned home page blocks (hero frame, pop-ups, process,
 * results bento). Kept in code for now; the CMS still owns every other string.
 * Short labels and headings intentionally carry no trailing full stops.
 */
export type HomeCopy = {
  heroMetaL: string;
  heroMetaR: string;
  heroLanes: [string, string, string];
  heroWatch: string;
  heroScroll: string;
  popVideoEyebrow: string;
  popVideoTitle: string;
  popVideoBtn: string;
  popLeadEyebrow: string;
  popLeadTitle: string;
  popLeadText: string;
  close: string;
  steps: { name: string; desc: string }[];
  results: { value: string; label: string }[];
  bentoStatement: [string, string];
  bentoStatementCta: string;
  bentoCtaTitle: string;
  bentoCtaText: string;
  bentoCtaBtn: string;
  workKicker: string;
  workOpen: string;
  wallLabel: string;
};

const en: HomeCopy = {
  heroMetaL: "Israel · Full-cycle studio",
  heroMetaR: "Open for new projects",
  heroLanes: ["Video production", "Ads & SMM", "Digital & AI"],
  heroWatch: "Watch the film",
  heroScroll: "Scroll",
  popVideoEyebrow: "Showreel · 60 sec",
  popVideoTitle: "See how we work in one minute",
  popVideoBtn: "Watch the film",
  popLeadEyebrow: "Free consultation",
  popLeadTitle: "Let's find where your leads get lost",
  popLeadText: "Tell us about your business. We reply within one business day with a clear plan",
  close: "Close",
  steps: [
    { name: "Strategy", desc: "We study your business, audience and competitors, then agree on goals and the numbers we will track" },
    { name: "Idea", desc: "We find the hook and build the creative concept and content plan around it" },
    { name: "Production", desc: "Scripts, copy, storyboards and motion design. Everything is ready before the shoot" },
    { name: "Shoot", desc: "Video and photo with our own crew, then editing, sound and color" },
    { name: "Ads", desc: "We launch campaigns, test creatives and scale what brings leads" },
    { name: "Analytics", desc: "Pixels, CRM and clean data, so you see the cost of every lead" },
    { name: "Support", desc: "Weekly optimisation and a clear report every month" },
  ],
  results: [
    { value: "48", label: "hours to the first quality leads after your ads go live. Guaranteed" },
    { value: "×2", label: "lower cost per lead once we rebuild your ads" },
    { value: "7", label: "days from signing to your first campaign going live" },
    { value: "+100", label: "new customers in the first month of working with us" },
  ],
  bentoStatement: ["We don't just make content", "We build systems"],
  bentoStatementCta: "Start a project",
  bentoCtaTitle: "Book a free consultation",
  bentoCtaText: "We review your ads and content and show where leads slip away",
  bentoCtaBtn: "Get in touch",
  workKicker: "Case study",
  workOpen: "Open case",
  wallLabel: "Projects we have shot and launched",
};

const ru: HomeCopy = {
  heroMetaL: "Израиль · Студия полного цикла",
  heroMetaR: "Берём новые проекты",
  heroLanes: ["Видеопродакшн", "Реклама и SMM", "Digital и AI"],
  heroWatch: "Смотреть фильм",
  heroScroll: "Листайте",
  popVideoEyebrow: "Шоурил · 60 сек",
  popVideoTitle: "Как мы работаем, за одну минуту",
  popVideoBtn: "Смотреть видео",
  popLeadEyebrow: "Бесплатная консультация",
  popLeadTitle: "Найдём, где теряются ваши заявки",
  popLeadText: "Расскажите о бизнесе, и в течение рабочего дня мы пришлём понятный план",
  close: "Закрыть",
  steps: [
    { name: "Стратегия", desc: "Изучаем бизнес, аудиторию и конкурентов, договариваемся о целях и цифрах, которые будем отслеживать" },
    { name: "Идея", desc: "Находим цепляющую идею и строим вокруг неё креативную концепцию и контент-план" },
    { name: "Продакшн", desc: "Сценарии, тексты, раскадровки и моушн-дизайн. Всё готово ещё до съёмки" },
    { name: "Съёмка", desc: "Видео и фото своей командой, затем монтаж, звук и цветокоррекция" },
    { name: "Реклама", desc: "Запускаем кампании, тестируем креативы и масштабируем то, что приносит заявки" },
    { name: "Аналитика", desc: "Пиксели, CRM и чистые данные, чтобы вы видели цену каждой заявки" },
    { name: "Поддержка", desc: "Еженедельная оптимизация и понятный отчёт каждый месяц" },
  ],
  results: [
    { value: "48", label: "часов до первых качественных заявок после запуска рекламы. Гарантируем" },
    { value: "×2", label: "ниже цена заявки после того, как мы перестраиваем рекламу" },
    { value: "7", label: "дней от подписания договора до старта первой рекламной кампании" },
    { value: "+100", label: "новых клиентов уже в первый месяц работы с нами" },
  ],
  bentoStatement: ["Мы не просто делаем контент", "Мы строим системы"],
  bentoStatementCta: "Начать проект",
  bentoCtaTitle: "Запишитесь на бесплатную консультацию",
  bentoCtaText: "Разберём вашу рекламу и контент и покажем, где уходят заявки",
  bentoCtaBtn: "Связаться",
  workKicker: "Кейс",
  workOpen: "Открыть кейс",
  wallLabel: "Проекты, которые мы сняли и запустили",
};

const he: HomeCopy = {
  heroMetaL: "ישראל · סטודיו מלא",
  heroMetaR: "פתוחים לפרויקטים חדשים",
  heroLanes: ["הפקת וידאו", "פרסום ו-SMM", "דיגיטל ו-AI"],
  heroWatch: "לצפייה בסרט",
  heroScroll: "גללו",
  popVideoEyebrow: "שואוריל · 60 שניות",
  popVideoTitle: "ככה אנחנו עובדים, בדקה אחת",
  popVideoBtn: "לצפייה בסרטון",
  popLeadEyebrow: "ייעוץ חינם",
  popLeadTitle: "נמצא איפה הלידים שלכם הולכים לאיבוד",
  popLeadText: "ספרו לנו על העסק ותוך יום עסקים נחזור אליכם עם תוכנית ברורה",
  close: "סגירה",
  steps: [
    { name: "אסטרטגיה", desc: "לומדים את העסק, הקהל והמתחרים, וקובעים יעדים ומספרים שנמדוד" },
    { name: "רעיון", desc: "מוצאים את הוו ובונים סביבו קונספט קריאייטיבי ותוכנית תוכן" },
    { name: "הפקה", desc: "תסריטים, קופי, סטוריבורד ומושן. הכול מוכן לפני הצילום" },
    { name: "צילום", desc: "וידאו וסטילס עם צוות משלנו, ואחר כך עריכה, סאונד וצבע" },
    { name: "פרסום", desc: "משיקים קמפיינים, בודקים קריאייטיבים ומגדילים את מה שמביא לידים" },
    { name: "אנליטיקה", desc: "פיקסלים, CRM ונתונים נקיים, כדי שתראו כמה עולה כל ליד" },
    { name: "תמיכה", desc: "אופטימיזציה שבועית ודוח ברור בכל חודש" },
  ],
  results: [
    { value: "48", label: "שעות עד הלידים האיכותיים הראשונים אחרי עליית הפרסום. מובטח" },
    { value: "×2", label: "עלות נמוכה יותר לליד אחרי שאנחנו בונים מחדש את הפרסום" },
    { value: "7", label: "ימים מהחתימה ועד עליית הקמפיין הראשון" },
    { value: "+100", label: "לקוחות חדשים כבר בחודש הראשון איתנו" },
  ],
  bentoStatement: ["אנחנו לא רק עושים תוכן", "אנחנו בונים מערכות"],
  bentoStatementCta: "להתחיל פרויקט",
  bentoCtaTitle: "קבעו ייעוץ חינם",
  bentoCtaText: "נעבור על הפרסום והתוכן שלכם ונראה איפה הלידים בורחים",
  bentoCtaBtn: "צרו קשר",
  workKicker: "קייס",
  workOpen: "לפתיחת הקייס",
  wallLabel: "פרויקטים שצילמנו והשקנו",
};

const COPY: Record<string, HomeCopy> = { en, ru, he };
export const homeCopy = (locale: string): HomeCopy => COPY[locale] ?? en;

/** Headings and short labels read cleaner without a closing full stop. */
export const noDot = (s: string) => s.replace(/[.。]+\s*$/u, "");
