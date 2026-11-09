/**
 * UI copy for the redesigned home page blocks (hero frame, pop-ups, process,
 * results bento). Kept in code for now; the CMS still owns every other string.
 * Short labels and headings intentionally carry no trailing full stops.
 */
export type HomeCopy = {
  heroMetaL: string;
  heroMetaR: string;
  heroLanes: [string, string, string];
  heroDesc: string;
  heroRail: string[];
  feats: { t: string; s: string; d: string }[];
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
  ribbonWords: [string, string];
  ribbonNote: string;
};

const en: HomeCopy = {
  heroMetaL: "Customers for your business without the headache, in the first days after your ads go live",
  heroMetaR: "Open for new projects",
  heroLanes: ["Ad agency", "Video production", "Leads within 24 hours"],
  heroDesc: "We take on everything: strategy, photo and video shoots, turnkey ad launches, social media, chatbots and sales automation. You get a steady flow of leads and a clear cost for every customer",
  heroRail: ["Turnkey ad launch", "Social media", "Photo & video shoots", "Chatbots", "Sales automation", "Advertising", "Video production"],
  feats: [
    { t: "Common", s: "mistakes", d: "The mistakes almost every business makes in 2026 and burns its budget on" },
    { t: "Ads alone", s: "aren't enough", d: "Why in 2026 ads by themselves don't pay off, and what else it takes" },
    { t: "Guaranteed", s: "results", d: "The only company in Israel that guarantees results within 48 hours of launch" },
  ],
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
  wallLabel: "Our clients",
  ribbonWords: ["Ad", "results"],
  ribbonNote: "Real numbers from our ad accounts",
};

const ru: HomeCopy = {
  heroMetaL: "Клиенты в ваш бизнес без головной боли уже в первые дни после запуска рекламы",
  heroMetaR: "Берём новые проекты",
  heroLanes: ["Рекламное агентство", "Видеопродакшн", "Заявки в первые 24 часа"],
  heroDesc: "Берём на себя всё: стратегию, съёмку фото и видео, запуск рекламы под ключ, социальные сети, чат-боты и автоматизацию продаж. Вы получаете поток заявок и понятную цену каждого клиента",
  heroRail: ["Запуск рекламы под ключ", "Social media", "Съёмка фото и видео", "Чат-боты", "Автоматизация продаж", "Реклама", "Видеопродакшн"],
  feats: [
    { t: "Основные", s: "ошибки", d: "Какие ошибки в 2026 году допускает почти каждый бизнес и сливает на них бюджет" },
    { t: "Реклама —", s: "не залог успеха", d: "Почему в 2026 году одной рекламы недостаточно и что ещё нужно, чтобы она окупалась" },
    { t: "Гарантия", s: "результата", d: "Мы единственная компания в Израиле с гарантией результата уже в первые 48 часов после запуска" },
  ],
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
  wallLabel: "Наши клиенты",
  ribbonWords: ["Результаты", "рекламы"],
  ribbonNote: "Реальные цифры из наших рекламных кабинетов",
};

const he: HomeCopy = {
  heroMetaL: "לקוחות לעסק שלכם בלי כאב ראש, כבר בימים הראשונים אחרי עליית הפרסום",
  heroMetaR: "פתוחים לפרויקטים חדשים",
  heroLanes: ["סוכנות פרסום", "הפקת וידאו", "לידים ב-24 השעות הראשונות"],
  heroDesc: "אנחנו לוקחים על עצמנו הכול: אסטרטגיה, צילומי סטילס ווידאו, השקת פרסום מקצה לקצה, סושיאל מדיה, צ'אטבוטים ואוטומציית מכירות. אתם מקבלים זרם קבוע של לידים ועלות ברורה לכל לקוח",
  heroRail: ["השקת פרסום מקצה לקצה", "סושיאל מדיה", "צילומי סטילס ווידאו", "צ'אטבוטים", "אוטומציית מכירות", "פרסום", "הפקת וידאו"],
  feats: [
    { t: "הטעויות", s: "הנפוצות", d: "הטעויות שכמעט כל עסק עושה ב-2026 ושורפות לו את התקציב" },
    { t: "פרסום לבד", s: "לא מספיק", d: "למה ב-2026 פרסום לבד לא מחזיר את עצמו, ומה עוד צריך" },
    { t: "תוצאה", s: "מובטחת", d: "החברה היחידה בישראל עם הבטחת תוצאה כבר 48 שעות אחרי ההשקה" },
  ],
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
  wallLabel: "הלקוחות שלנו",
  ribbonWords: ["תוצאות", "הפרסום"],
  ribbonNote: "מספרים אמיתיים מחשבונות הפרסום שלנו",
};

const COPY: Record<string, HomeCopy> = { en, ru, he };
export const homeCopy = (locale: string): HomeCopy => COPY[locale] ?? en;

/** Headings and short labels read cleaner without a closing full stop. */
export const noDot = (s: string) => s.replace(/[.。]+\s*$/u, "");
