/**
 * Copy for the hidden client showcase (/showcase): a page we send to clients in
 * WhatsApp instead of Drive folders. Not in the menu, sitemap or search.
 * Three languages only: Hebrew, Russian, English.
 *
 * Posts and video are swipeable windows: add real files to POST_SLIDES /
 * VIDEO_SLIDES below and they appear as slides.
 */
export const WA_BOT = "972536260121";

export type Line = { me?: boolean; t: string };
export type TabId = "all" | "video" | "posts" | "results" | "sites" | "bot" | "voice";
type Service = { title: string; em: string; text: string; points: string[]; cta: string; wa: string };

export type ShowcaseCopy = {
  meta: string;
  sub: string;
  tabs: Record<TabId, string>;
  /** the giant word on top, per tab */
  words: Record<TabId, string>;
  open: string;
  light: string;
  dark: string;
  float: string;
  video: { title: string; text: string; more: string; wa: string };
  posts: Service & { slides: string[]; swipe: string };
  bot: Service & { note: string; typing: string; chat: Line[] };
  voice: Service & { calling: string; script: Line[] };
  cta: string;
  ctaText: string;
  ctaBtn: string;
  waMore: string;
};

const C: Record<string, ShowcaseCopy> = {
  ru: {
    meta: "Портфолио DC Production",
    sub: "Видео, реклама, сайты и ИИ-решения DC Production",
    tabs: { all: "Все", video: "Видео", posts: "Рекламные посты", results: "Результаты рекламы", sites: "Сайты", bot: "ИИ-менеджер по перепискам", voice: "Разговорный бот" },
    words: { all: "Портфолио", video: "Видео", posts: "Посты", results: "Результаты", sites: "Сайты", bot: "ИИ-менеджер", voice: "Голосовой бот" },
    open: "Открыть сайт",
    light: "Светлая тема", dark: "Тёмная тема",
    float: "Написать нам",
    video: {
      title: "Рекламные ролики",
      text: "Сценарий, съёмка и монтаж под рекламу в Instagram и Facebook. Листайте и смотрите прямо здесь.",
      more: "Ещё ролики под вашу нишу", wa: "Здравствуйте! Хочу посмотреть примеры видеороликов",
    },
    posts: {
      title: "Рекламные", em: "посты и баннеры",
      text: "Посты, сторис и баннеры для Instagram и Facebook: дизайн и тексты под вашу аудиторию на иврите и русском.",
      points: ["Ленты, сторис, карусели", "Тексты на иврите и русском", "Готовы к запуску рекламы"],
      slides: ["Ленты, сторис, карусели", "Тексты на иврите и русском", "Готовы к запуску рекламы"],
      swipe: "Листайте",
      cta: "Получить примеры", wa: "Здравствуйте! Хочу посмотреть примеры рекламных постов",
    },
    bot: {
      title: "ИИ-менеджер", em: "по перепискам",
      text: "Отвечает вашим клиентам в WhatsApp за секунды, днём и ночью. Напишите ему сами и посмотрите, как он работает.",
      points: ["Отвечает за секунды, 24/7", "Понимает иврит, русский и английский", "Собирает заявку и передаёт её вам"],
      cta: "Написать в WhatsApp", wa: "Здравствуйте! Хочу посмотреть, как работает ИИ-менеджер",
      note: "Откроется чат с ИИ-менеджером",
      typing: "печатает…",
      chat: [
        { t: "Здравствуйте! Сколько стоит реклама для салона?" },
        { me: true, t: "Здравствуйте! Зависит от города и бюджета. Подскажите, где находится салон?" },
        { t: "Хайфа" },
        { me: true, t: "Отлично, подберу варианты. Удобно, если менеджер позвонит сегодня в 17:00?" },
        { t: "Да, давайте 👍" },
      ],
    },
    voice: {
      title: "Разговорный", em: "бот",
      text: "Голосовой ИИ на вашем номере: сам берёт трубку, говорит с клиентом живым голосом и записывает на услугу. Каждый звонок записан, видно, с какой рекламы позвонили.",
      points: ["Берёт трубку с первого гудка, 24/7", "Говорит на иврите и русском", "Запись звонков и итог вам в WhatsApp"],
      cta: "Хочу демо звонка", wa: "Здравствуйте! Хочу услышать, как работает разговорный бот",
      calling: "Идёт разговор",
      script: [
        { me: true, t: "Здравствуйте! Студия красоты, чем могу помочь?" },
        { t: "Хочу записаться на маникюр завтра" },
        { me: true, t: "Завтра свободно в 11:00 и в 15:30. Какое время удобно?" },
        { t: "В 15:30" },
        { me: true, t: "Записала вас на 15:30. Пришлю подтверждение в WhatsApp." },
      ],
    },
    cta: "Хотите так же?", ctaText: "Напишите нам, и мы предложим решение под ваш бизнес.", ctaBtn: "Обсудить проект",
    waMore: "Здравствуйте! Посмотрел ваше портфолио, хочу обсудить проект",
  },
  he: {
    meta: "תיק עבודות DC Production",
    sub: "וידאו, פרסום, אתרים ופתרונות AI של DC Production",
    tabs: { all: "הכל", video: "וידאו", posts: "פוסטים ממומנים", results: "תוצאות פרסום", sites: "אתרים", bot: "מנהל AI לשיחות", voice: "בוט קולי" },
    words: { all: "תיק עבודות", video: "וידאו", posts: "פוסטים", results: "תוצאות", sites: "אתרים", bot: "מנהל AI", voice: "בוט קולי" },
    open: "לאתר",
    light: "מצב בהיר", dark: "מצב כהה",
    float: "כתבו לנו",
    video: {
      title: "סרטוני פרסום",
      text: "תסריט, צילום ועריכה לפרסום באינסטגרם ובפייסבוק. גללו וצפו כאן.",
      more: "סרטונים נוספים בתחום שלכם", wa: "שלום! אשמח לראות דוגמאות של סרטונים",
    },
    posts: {
      title: "פוסטים", em: "ובאנרים",
      text: "פוסטים, סטוריז ובאנרים לאינסטגרם ופייסבוק: עיצוב וטקסטים לקהל שלכם בעברית וברוסית.",
      points: ["פיד, סטוריז, קרוסלות", "טקסטים בעברית וברוסית", "מוכנים להשקת קמפיין"],
      slides: ["פיד, סטוריז, קרוסלות", "טקסטים בעברית וברוסית", "מוכנים להשקת קמפיין"],
      swipe: "החליקו",
      cta: "לקבלת דוגמאות", wa: "שלום! אשמח לראות דוגמאות של פוסטים ממומנים",
    },
    bot: {
      title: "מנהל AI", em: "לשיחות",
      text: "עונה ללקוחות שלכם בוואטסאפ תוך שניות, יום ולילה. כתבו לו בעצמכם ותראו איך הוא עובד.",
      points: ["עונה תוך שניות, 24/7", "מבין עברית, רוסית ואנגלית", "אוסף את הפנייה ומעביר אליכם"],
      cta: "לכתוב בוואטסאפ", wa: "שלום! אשמח לראות איך מנהל ה-AI עובד",
      note: "ייפתח צ׳אט עם מנהל ה-AI",
      typing: "מקליד…",
      chat: [
        { t: "שלום! כמה עולה פרסום לסלון?" },
        { me: true, t: "שלום! זה תלוי בעיר ובתקציב. איפה הסלון נמצא?" },
        { t: "בחיפה" },
        { me: true, t: "מעולה, אכין אפשרויות. נוח שנציג יתקשר היום ב-17:00?" },
        { t: "כן, סגור 👍" },
      ],
    },
    voice: {
      title: "בוט", em: "קולי",
      text: "AI קולי על המספר שלכם: עונה לשיחות בעצמו, מדבר עם הלקוח בקול טבעי וקובע תורים. כל שיחה מוקלטת ורואים מאיזה פרסום התקשרו.",
      points: ["עונה מהצלצול הראשון, 24/7", "מדבר עברית ורוסית", "הקלטת שיחות וסיכום אליכם לוואטסאפ"],
      cta: "לשמוע שיחת דמו", wa: "שלום! אשמח לשמוע איך הבוט הקולי עובד",
      calling: "שיחה פעילה",
      script: [
        { me: true, t: "שלום! סטודיו יופי, במה אפשר לעזור?" },
        { t: "אני רוצה לקבוע מניקור למחר" },
        { me: true, t: "מחר פנוי ב-11:00 וב-15:30. מה נוח לך?" },
        { t: "ב-15:30" },
        { me: true, t: "קבעתי לך ל-15:30. אשלח אישור בוואטסאפ." },
      ],
    },
    cta: "רוצים גם?", ctaText: "כתבו לנו ונציע פתרון לעסק שלכם.", ctaBtn: "לדבר על פרויקט",
    waMore: "שלום! ראיתי את תיק העבודות, אשמח לדבר על פרויקט",
  },
  en: {
    meta: "DC Production portfolio",
    sub: "Video, ads, websites and AI solutions by DC Production",
    tabs: { all: "All", video: "Video", posts: "Ad posts", results: "Ad results", sites: "Websites", bot: "AI chat manager", voice: "Voice bot" },
    words: { all: "Portfolio", video: "Video", posts: "Posts", results: "Results", sites: "Websites", bot: "AI manager", voice: "Voice bot" },
    open: "Open site",
    light: "Light theme", dark: "Dark theme",
    float: "Message us",
    video: {
      title: "Ad videos",
      text: "Script, shoot and edit for Instagram and Facebook ads. Swipe and watch right here.",
      more: "More videos for your niche", wa: "Hi! I'd like to see examples of your videos",
    },
    posts: {
      title: "Ad posts", em: "and banners",
      text: "Posts, stories and banners for Instagram and Facebook: design and copy for your audience in Hebrew and Russian.",
      points: ["Feed, stories, carousels", "Copy in Hebrew and Russian", "Ready to launch ads"],
      slides: ["Feed, stories, carousels", "Copy in Hebrew and Russian", "Ready to launch ads"],
      swipe: "Swipe",
      cta: "Get examples", wa: "Hi! I'd like to see examples of ad posts",
    },
    bot: {
      title: "AI chat", em: "manager",
      text: "Answers your customers on WhatsApp in seconds, day and night. Message it yourself and see how it works.",
      points: ["Replies in seconds, 24/7", "Understands Hebrew, Russian and English", "Collects the lead and hands it to you"],
      cta: "Message on WhatsApp", wa: "Hi! I'd like to see how the AI manager works",
      note: "Opens a chat with the AI manager",
      typing: "typing…",
      chat: [
        { t: "Hi! How much do ads for a salon cost?" },
        { me: true, t: "Hi! It depends on the city and budget. Where is the salon?" },
        { t: "Haifa" },
        { me: true, t: "Great, I'll prepare options. Can a manager call you today at 5 pm?" },
        { t: "Yes, sure 👍" },
      ],
    },
    voice: {
      title: "Voice", em: "bot",
      text: "Voice AI on your number: picks up by itself, talks to the customer in a natural voice and books appointments. Every call is recorded, and you see which ad it came from.",
      points: ["Picks up on the first ring, 24/7", "Speaks Hebrew and Russian", "Call recordings and a summary on WhatsApp"],
      cta: "Hear a demo call", wa: "Hi! I'd like to hear how the voice bot works",
      calling: "Call in progress",
      script: [
        { me: true, t: "Hello! Beauty studio, how can I help?" },
        { t: "I'd like a manicure tomorrow" },
        { me: true, t: "Tomorrow we have 11:00 and 15:30. Which suits you?" },
        { t: "15:30" },
        { me: true, t: "You're booked for 15:30. I'll send a confirmation on WhatsApp." },
      ],
    },
    cta: "Want the same?", ctaText: "Message us and we'll suggest a solution for your business.", ctaBtn: "Discuss a project",
    waMore: "Hi! I saw your portfolio and would like to discuss a project",
  },
};

export const SHOWCASE_LOCALES = ["he", "ru", "en"];
export const showcaseCopy = (l: string): ShowcaseCopy => C[l] ?? C.en;

/** Showcase URL per locale (English at the root, Hebrew under /heb). */
export const SHOWCASE_LANGS: { id: string; label: string; href: string }[] = [
  { id: "he", label: "HE", href: "/heb/showcase" },
  { id: "ru", label: "RU", href: "/ru/showcase" },
  { id: "en", label: "EN", href: "/showcase" },
];

/**
 * Real media for the swipeable windows. Add files to public/showcase/… and list
 * them here; until then the posts window shows designed sample slides.
 * Video files belong on a video host (Bunny/Cloudflare Stream), not in the repo.
 */
export const POST_SLIDES: string[] = [];
export const VIDEO_SLIDES = (l: string): { src: string; poster: string }[] => [
  { src: `/videos/vsl-${l}.mp4`, poster: `/videos/vsl-${l}-poster.webp` },
];
