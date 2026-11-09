/**
 * Plain-language copy for the inner pages (services list, portfolio filters,
 * about headings). Kept in code next to home-copy until it moves into the CMS.
 */
type Svc = { title: string; tag: string; teaser: string };
export type ServicesCopy = {
  sub: string; more: string; ctaHeading: string; ctaText: string; ctaBtn: string;
  items: Record<string, Svc>;
};

const svcRu: ServicesCopy = {
  sub: "Всё, что нужно, чтобы клиенты находили вас, писали вам и покупали у вас. Объясняем простым языком",
  more: "Оставить заявку",
  ctaHeading: "Не знаете, что из этого вам нужно?",
  ctaText: "Расскажите о бизнесе. Подберём набор услуг и пришлём расчёт",
  ctaBtn: "Получить расчёт",
  items: {
    "seo": { title: "Ваш сайт на первых местах в Google", tag: "SEO", teaser: "Клиенты находят вас сами в обычном поиске Google, без оплаты за каждый клик" },
    "targeted-advertising": { title: "Реклама в Instagram и Facebook", tag: "Таргет", teaser: "Показываем рекламу именно тем, кому нужен ваш продукт, и получаем заявки" },
    "smm": { title: "Ведение соцсетей", tag: "Social media", teaser: "Посты, сторис и видео, которые превращают подписчиков в клиентов" },
    "google-ads": { title: "Реклама в Google", tag: "Google Ads", teaser: "Ваше объявление видят люди, которые прямо сейчас ищут ваши услуги" },
    "photo-video": { title: "Фото и видео", tag: "Продакшн", teaser: "Снимаем ролики и фото кино-уровня для рекламы, соцсетей и сайта" },
    "marketing-strategy": { title: "Стратегия продаж", tag: "Стратегия", teaser: "Разбираем ваш бизнес и строим понятный путь клиента от рекламы до покупки" },
    "website-development": { title: "Сайты и лендинги", tag: "Сайты", teaser: "Быстрые сайты, которые продают и собирают заявки круглые сутки" },
    "automation": { title: "Чат-боты и автоматизация", tag: "Боты", teaser: "Бот отвечает клиентам за секунды, и ни одна заявка не теряется" },
    "geo-ai-seo": { title: "Рекомендации в ChatGPT", tag: "AI-поиск", teaser: "Делаем так, чтобы ChatGPT и другие ИИ-помощники советовали именно вас" },
  },
};
const svcEn: ServicesCopy = {
  sub: "Everything it takes for customers to find you, message you and buy from you. Explained in plain words",
  more: "Request a quote",
  ctaHeading: "Not sure which of these you need?",
  ctaText: "Tell us about your business. We'll pick the right set and send you a quote",
  ctaBtn: "Get a quote",
  items: {
    "seo": { title: "Your site at the top of Google", tag: "SEO", teaser: "Customers find you on their own in regular Google search, no pay-per-click" },
    "targeted-advertising": { title: "Ads on Instagram and Facebook", tag: "Targeting", teaser: "Your ads reach exactly the people who need your product, and bring leads" },
    "smm": { title: "Social media management", tag: "Social media", teaser: "Posts, stories and videos that turn followers into customers" },
    "google-ads": { title: "Ads on Google", tag: "Google Ads", teaser: "Your ad is seen by people searching for your service right now" },
    "photo-video": { title: "Photo and video", tag: "Production", teaser: "Cinema-grade videos and photos for ads, social media and your website" },
    "marketing-strategy": { title: "Sales strategy", tag: "Strategy", teaser: "We study your business and map a clear path from the first ad to the purchase" },
    "website-development": { title: "Websites and landing pages", tag: "Websites", teaser: "Fast websites that sell and collect leads around the clock" },
    "automation": { title: "Chatbots and automation", tag: "Bots", teaser: "A bot answers customers in seconds, so no lead ever gets lost" },
    "geo-ai-seo": { title: "Recommended by ChatGPT", tag: "AI search", teaser: "We make ChatGPT and other AI assistants recommend you" },
  },
};
const svcHe: ServicesCopy = {
  sub: "כל מה שצריך כדי שלקוחות ימצאו אתכם, יפנו אליכם ויקנו מכם. בשפה פשוטה",
  more: "להשארת פרטים",
  ctaHeading: "לא בטוחים מה מזה אתם צריכים?",
  ctaText: "ספרו לנו על העסק. נתאים את סט השירותים ונשלח הצעת מחיר",
  ctaBtn: "לקבלת הצעת מחיר",
  items: {
    "seo": { title: "האתר שלכם במקומות הראשונים בגוגל", tag: "SEO", teaser: "לקוחות מוצאים אתכם לבד בחיפוש הרגיל של גוגל, בלי לשלם על כל קליק" },
    "targeted-advertising": { title: "פרסום באינסטגרם ובפייסבוק", tag: "טרגוט", teaser: "המודעות מגיעות בדיוק למי שצריך את המוצר שלכם ומביאות לידים" },
    "smm": { title: "ניהול רשתות חברתיות", tag: "Social media", teaser: "פוסטים, סטוריז וסרטונים שהופכים עוקבים ללקוחות" },
    "google-ads": { title: "פרסום בגוגל", tag: "Google Ads", teaser: "המודעה שלכם מופיעה למי שמחפש את השירות שלכם ממש עכשיו" },
    "photo-video": { title: "צילום ווידאו", tag: "הפקה", teaser: "סרטונים וצילומים ברמה קולנועית לפרסום, לרשתות ולאתר" },
    "marketing-strategy": { title: "אסטרטגיית מכירות", tag: "אסטרטגיה", teaser: "מנתחים את העסק ובונים מסלול ברור מהמודעה הראשונה ועד הקנייה" },
    "website-development": { title: "אתרים ודפי נחיתה", tag: "אתרים", teaser: "אתרים מהירים שמוכרים ואוספים לידים מסביב לשעון" },
    "automation": { title: "צ'אטבוטים ואוטומציה", tag: "בוטים", teaser: "בוט עונה ללקוחות תוך שניות, ואף ליד לא הולך לאיבוד" },
    "geo-ai-seo": { title: "המלצות ב-ChatGPT", tag: "חיפוש AI", teaser: "דואגים ש-ChatGPT ועוזרי AI אחרים ימליצו דווקא עליכם" },
  },
};
export const servicesCopy = (l: string) => ({ ru: svcRu, he: svcHe }[l] ?? svcEn);

/* Portfolio filters: plain names; old CMS tags map onto them */
export const portfolioCategories = (l: string) =>
  ({
    ru: ["Все", "Имиджевое видео", "Реклама и креативы", "Social media", "Чат-боты", "Промо-видео", "Сайты"],
    he: ["הכל", "סרטון תדמית", "פרסום וקריאייטיב", "Social media", "צ'אטבוטים", "סרטון פרסום", "אתרים"],
  } as Record<string, string[]>)[l] ?? ["All", "Image video", "Ads & creatives", "Social media", "Chatbots", "Promo video", "Websites"];
export const portfolioTagMap: Record<string, string> = {
  "SMM": "Social media",
  "Полная воронка": "Чат-боты", "Full funnel": "Chatbots", "משפך מלא": "צ'אטבוטים",
  "Promotional video": "Promo video",
};
export const portfolioEmpty = (l: string) =>
  ({ ru: "Скоро здесь появятся новые кейсы", he: "בקרוב יעלו לכאן פרויקטים חדשים" } as Record<string, string>)[l] ?? "New cases coming soon";

/* About: headings that say what we do */
export const aboutCopy = (l: string) =>
  ({
    ru: { heroHeading: "Команда, которая приводит", heroEm: "клиентов в ваш бизнес", storyHeading: "От видеопродакшна до системы продаж" },
    he: { heroHeading: "הצוות שמביא", heroEm: "לקוחות לעסק שלכם", storyHeading: "מהפקת וידאו למערכת מכירות" },
  } as Record<string, { heroHeading: string; heroEm: string; storyHeading: string }>)[l] ?? { heroHeading: "The team that brings", heroEm: "customers to your business", storyHeading: "From video production to a sales system" };
