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
    { name: "Strategy", desc: "We run a deep analysis of your business and competitors: the product, its pricing and how well it fits the market" },
    { name: "Idea", desc: "Using everything you share and our own research, the team creates content built to bring qualified leads, not just reach" },
    { name: "Production", desc: "We take on everything: scripts, shoot days, editing, design and every visual right up to launch" },
    { name: "Shoot", desc: "We shoot on professional gear, so your brand looks premium and earns trust from the first frame" },
    { name: "Ads", desc: "Every business gets its own approach: from targeted ads on Facebook and Instagram to Google Ads, SEO and GEO" },
    { name: "Analytics", desc: "We track every lead: what it cost, where it came from and which ad works best. You see where the money goes and what it brings back" },
    { name: "Support", desc: "We improve your ads every week, send a clear report every month and automate the routine with chatbots and smart flows" },
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
    { name: "Стратегия", desc: "Делаем глубокий анализ вашего бизнеса и конкурентов: продукт, цены и то, насколько вы попадаете в рынок" },
    { name: "Идея", desc: "На основе ваших данных и наших исследований команда придумывает контент, который приводит не просто охваты, а целевые заявки" },
    { name: "Продакшн", desc: "Берём на себя всё: сценарии, съёмочные дни, монтаж, дизайн и весь визуал вплоть до запуска" },
    { name: "Съёмка", desc: "Снимаем на профессиональное оборудование, поэтому ваш бренд выглядит дорого и вызывает доверие с первого кадра" },
    { name: "Реклама", desc: "К каждому бизнесу свой подход: от таргетированной рекламы в Facebook и Instagram до Google Ads и продвижения в SEO и GEO" },
    { name: "Аналитика", desc: "Считаем каждую заявку: сколько она стоит, откуда пришла и какая реклама работает лучше. Вы видите, куда уходят деньги и что они приносят" },
    { name: "Поддержка", desc: "Каждую неделю улучшаем рекламу, раз в месяц присылаем понятный отчёт, а рутину автоматизируем чат-ботами и умными сценариями" },
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
    { name: "אסטרטגיה", desc: "מבצעים ניתוח עומק של העסק שלכם ושל המתחרים: המוצר, המחיר ועד כמה הוא מתאים לשוק" },
    { name: "רעיון", desc: "על בסיס המידע שלכם והמחקר שלנו, הצוות יוצר תוכן שמביא לידים איכותיים ולא רק חשיפה" },
    { name: "הפקה", desc: "לוקחים על עצמנו הכול: תסריטים, ימי צילום, עריכה, עיצוב וכל הוויז'ואל עד העלייה לאוויר" },
    { name: "צילום", desc: "מצלמים בציוד מקצועי, כך שהמותג שלכם נראה יוקרתי ומעורר אמון מהפריים הראשון" },
    { name: "פרסום", desc: "לכל עסק גישה משלו: מפרסום ממומן בפייסבוק ובאינסטגרם ועד Google Ads, קידום SEO ו-GEO" },
    { name: "אנליטיקה", desc: "סופרים כל ליד: כמה הוא עלה, מאיפה הגיע ואיזו מודעה עובדת הכי טוב. אתם רואים לאן הולך הכסף ומה הוא מחזיר" },
    { name: "תמיכה", desc: "משפרים את הפרסום כל שבוע, שולחים דוח ברור כל חודש ומייעלים את השגרה עם צ'אטבוטים ואוטומציות" },
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
