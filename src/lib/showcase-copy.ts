/**
 * Copy for the hidden client showcase (/showcase): a page we send to clients in
 * WhatsApp instead of Drive folders. Not in the menu, sitemap or search.
 * Three languages only: Hebrew, Russian, English.
 *
 * Posts and video are swipeable windows: add real files to POST_SLIDES /
 * VIDEO_SLIDES below and they appear as slides.
 */
export const WA_BOT = "972536260121";
/** the voice bot answers this number itself */
export const VOICE_BOT = { tel: "+972559906960", show: "055-990-6960" };

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
  chat: { title: string; status: string; hello: string; q: string[]; ph: string; note: string; send: string; close: string };
  video: { title: string; text: string; more: string; wa: string; tags: Record<VideoTag, string>; play: string };
  results: { title: string; em: string; text: string };
  sitesText: string;
  posts: Service & { slides: string[]; swipe: string };
  bot: Service & { note: string; typing: string; chat: Line[] };
  voice: Service & { calling: string; script: Line[]; note: string; or: string };
  cta: string;
  ctaText: string;
  ctaBtn: string;
  waMore: string;
};

const C: Record<string, ShowcaseCopy> = {
  ru: {
    meta: "Портфолио DC Production",
    sub: "Видео, реклама, сайты и ИИ-решения DC Production",
    tabs: { all: "Все", video: "Видео", posts: "Баннеры", results: "Результаты рекламы", sites: "Сайты", bot: "ИИ-менеджер по перепискам", voice: "Разговорный бот" },
    words: { all: "Портфолио", video: "Видео", posts: "Баннеры", results: "Результаты", sites: "Сайты", bot: "ИИ-менеджер", voice: "Голосовой бот" },
    open: "Открыть сайт",
    light: "Светлая тема", dark: "Тёмная тема",
    float: "Написать нам",
    chat: { title: "ИИ-менеджер DC", status: "онлайн · отвечает за секунды", hello: "Здравствуйте! Я ИИ-менеджер DC Production. Выберите вопрос или напишите свой: продолжим в WhatsApp.", q: ["Сколько стоит реклама?", "Хочу ИИ-менеджера для бизнеса", "Нужен сайт"], ph: "Напишите сообщение…", note: "Ответ придёт в WhatsApp", send: "Отправить", close: "Закрыть" },
    video: {
      title: "Рекламные ролики",
      text: "Сценарий, съёмка и монтаж под рекламу в Instagram и Facebook. Цепляем в первые три секунды, показываем товар в деле и ведём к заявке. Листайте и смотрите прямо здесь.",
      more: "Ещё ролики под вашу нишу", wa: "Здравствуйте! Хочу посмотреть примеры видеороликов",
      tags: { premium: "Премиум-монтаж", product: "Продукт и визуализация", "3d": "3D и анимация", basic: "Базовый монтаж" }, play: "Смотреть",
    },
    results: { title: "Результаты", em: "рекламных кампаний", text: "Настоящие цифры из рекламных кабинетов наших клиентов: сколько людей написали, во что обошёлся каждый и сколько вложено." },
    sitesText: "Сайты, которые продают: каждый открывается на вашем языке, нажмите и посмотрите вживую.",
    posts: {
      title: "Рекламные", em: "посты и баннеры",
      text: "Реклама, мимо которой не пролистывают. Делаем посты, сторис и баннеры для Instagram и Facebook: заголовок, который бьёт в боль клиента, дизайн в стиле вашего бренда и текст на иврите и русском. Каждый креатив сразу готов к запуску и тестируется на реальной аудитории.",
      points: ["Ленты, сторис и карусели в одном стиле", "Тексты, которые продают, на иврите и русском", "Несколько вариантов для теста: оставляем лучший"],
      slides: ["Ленты, сторис, карусели", "Тексты на иврите и русском", "Готовы к запуску рекламы"],
      swipe: "Листайте",
      cta: "Получить примеры", wa: "Здравствуйте! Хочу посмотреть примеры рекламных постов",
    },
    bot: {
      title: "ИИ-менеджер", em: "по перепискам",
      text: "Клиент пишет вам в WhatsApp в 23:40, а менеджер уже спит. ИИ-менеджер отвечает за секунды: знает ваши услуги и цены, отвечает на вопросы, уточняет детали и записывает клиента. Готовую заявку вы получаете себе, а в любой момент можете подключиться к переписке сами.",
      points: ["1. Клиент пишет в WhatsApp, как обычно", "2. ИИ отвечает за секунды на иврите, русском или английском", "3. Заявка с именем и телефоном приходит вам"],
      cta: "Узнать, как это работает", wa: "Здравствуйте! Хочу посмотреть, как работает ИИ-менеджер",
      note: "Или сразу открыть WhatsApp",
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
      text: "Представьте сотрудника, который никогда не пропускает звонок. Бот сам берёт трубку, говорит живым голосом, отвечает на вопросы о ценах и свободных окнах и сразу записывает клиента. Вы получаете запись разговора и короткий итог, а видно ещё и то, с какой рекламы пришёл звонок. Не верите? Позвоните ему сами.",
      points: ["Берёт трубку с первого гудка, днём и ночью", "Говорит на иврите и русском, как живой человек", "Запись каждого звонка и итог вам в WhatsApp"],
      cta: "Позвонить боту", wa: "Здравствуйте! Хочу разговорного бота для своего бизнеса",
      note: "Бот ответит сам: спросите о ценах или попробуйте записаться", or: "Хочу такого бота",
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
    tabs: { all: "הכל", video: "וידאו", posts: "באנרים", results: "תוצאות פרסום", sites: "אתרים", bot: "מנהל AI לשיחות", voice: "בוט קולי" },
    words: { all: "תיק עבודות", video: "וידאו", posts: "באנרים", results: "תוצאות", sites: "אתרים", bot: "מנהל AI", voice: "בוט קולי" },
    open: "לאתר",
    light: "מצב בהיר", dark: "מצב כהה",
    float: "כתבו לנו",
    chat: { title: "מנהל AI של DC", status: "מחובר · עונה תוך שניות", hello: "שלום! אני מנהל ה-AI של DC Production. בחרו שאלה או כתבו משלכם: נמשיך בוואטסאפ.", q: ["כמה עולה פרסום?", "אני רוצה מנהל AI לעסק", "צריך אתר"], ph: "כתבו הודעה…", note: "התשובה תגיע בוואטסאפ", send: "שליחה", close: "סגירה" },
    video: {
      title: "סרטוני פרסום",
      text: "תסריט, צילום ועריכה לפרסום באינסטגרם ובפייסבוק. תופסים את העין בשלוש השניות הראשונות, מראים את המוצר בפעולה ומובילים לפנייה. גללו וצפו כאן.",
      more: "סרטונים נוספים בתחום שלכם", wa: "שלום! אשמח לראות דוגמאות של סרטונים",
      tags: { premium: "עריכת פרימיום", product: "מוצר והדמיה", "3d": "תלת ממד ואנימציה", basic: "עריכה בסיסית" }, play: "לצפייה",
    },
    results: { title: "תוצאות", em: "קמפיינים", text: "מספרים אמיתיים ממנהלי המודעות של הלקוחות שלנו: כמה אנשים פנו, כמה עלתה כל פנייה וכמה הושקע." },
    sitesText: "אתרים שמוכרים: כל אחד נפתח בשפה שלכם, לחצו ותראו אותו חי.",
    posts: {
      title: "פוסטים", em: "ובאנרים",
      text: "פרסום שלא גוללים לידו. אנחנו מכינים פוסטים, סטוריז ובאנרים לאינסטגרם ופייסבוק: כותרת שפוגעת בכאב של הלקוח, עיצוב בסגנון המותג שלכם וטקסט בעברית וברוסית. כל קריאייטיב מוכן להשקה ונבדק על קהל אמיתי.",
      points: ["פיד, סטוריז וקרוסלות בסגנון אחד", "טקסטים שמוכרים, בעברית וברוסית", "כמה גרסאות לבדיקה: משאירים את הטובה"],
      slides: ["פיד, סטוריז, קרוסלות", "טקסטים בעברית וברוסית", "מוכנים להשקת קמפיין"],
      swipe: "החליקו",
      cta: "לקבלת דוגמאות", wa: "שלום! אשמח לראות דוגמאות של פוסטים ממומנים",
    },
    bot: {
      title: "מנהל AI", em: "לשיחות",
      text: "לקוח כותב לכם בוואטסאפ ב-23:40, והנציג כבר ישן. מנהל ה-AI עונה תוך שניות: מכיר את השירותים והמחירים שלכם, עונה על שאלות, מברר פרטים וקובע לקוח. את הפנייה המוכנה אתם מקבלים, ובכל רגע אפשר להיכנס לשיחה בעצמכם.",
      points: ["1. הלקוח כותב בוואטסאפ כרגיל", "2. ה-AI עונה תוך שניות בעברית, ברוסית או באנגלית", "3. פנייה עם שם וטלפון מגיעה אליכם"],
      cta: "לראות איך זה עובד", wa: "שלום! אשמח לראות איך מנהל ה-AI עובד",
      note: "או לפתוח ישר את וואטסאפ",
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
      text: "תדמיינו עובד שאף פעם לא מפספס שיחה. הבוט עונה בעצמו, מדבר בקול טבעי, עונה על שאלות על מחירים ושעות פנויות וקובע תור מיד. אתם מקבלים הקלטה וסיכום קצר, ורואים גם מאיזה פרסום הגיעה השיחה. לא מאמינים? התקשרו אליו בעצמכם.",
      points: ["עונה מהצלצול הראשון, יום ולילה", "מדבר עברית ורוסית, כמו בן אדם", "הקלטה של כל שיחה וסיכום אליכם לוואטסאפ"],
      cta: "להתקשר לבוט", wa: "שלום! אשמח לבוט קולי לעסק שלי",
      note: "הבוט יענה בעצמו: שאלו על מחירים או נסו לקבוע תור", or: "אני רוצה בוט כזה",
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
    tabs: { all: "All", video: "Video", posts: "Banners", results: "Ad results", sites: "Websites", bot: "AI chat manager", voice: "Voice bot" },
    words: { all: "Portfolio", video: "Video", posts: "Banners", results: "Results", sites: "Websites", bot: "AI manager", voice: "Voice bot" },
    open: "Open site",
    light: "Light theme", dark: "Dark theme",
    float: "Message us",
    chat: { title: "DC AI manager", status: "online · replies in seconds", hello: "Hi! I'm the DC Production AI manager. Pick a question or type your own: we'll continue on WhatsApp.", q: ["How much do ads cost?", "I want an AI manager", "I need a website"], ph: "Type a message…", note: "The reply comes on WhatsApp", send: "Send", close: "Close" },
    video: {
      title: "Ad videos",
      text: "Script, shoot and edit for Instagram and Facebook ads. We hook viewers in the first three seconds, show the product at work and lead to a message. Swipe and watch right here.",
      more: "More videos for your niche", wa: "Hi! I'd like to see examples of your videos",
      tags: { premium: "Premium edit", product: "Product & visuals", "3d": "3D & animation", basic: "Basic edit" }, play: "Watch",
    },
    results: { title: "Campaign", em: "results", text: "Real numbers from our clients' ad accounts: how many people wrote, what each one cost and how much was spent." },
    sitesText: "Websites that sell: each opens in your language, tap to see it live.",
    posts: {
      title: "Ad posts", em: "and banners",
      text: "Ads people don't scroll past. We make posts, stories and banners for Instagram and Facebook: a headline that hits the customer's pain, design in your brand's style and copy in Hebrew and Russian. Every creative is ready to launch and tested on a real audience.",
      points: ["Feed, stories and carousels in one style", "Copy that sells, in Hebrew and Russian", "Several versions to test: we keep the winner"],
      slides: ["Feed, stories, carousels", "Copy in Hebrew and Russian", "Ready to launch ads"],
      swipe: "Swipe",
      cta: "Get examples", wa: "Hi! I'd like to see examples of ad posts",
    },
    bot: {
      title: "AI chat", em: "manager",
      text: "A customer messages you on WhatsApp at 11:40 pm and your manager is asleep. The AI manager replies in seconds: it knows your services and prices, answers questions, asks for details and books the customer. You get the finished lead, and you can step into the chat yourself at any moment.",
      points: ["1. The customer writes on WhatsApp as usual", "2. The AI replies in seconds in Hebrew, Russian or English", "3. A lead with name and phone comes to you"],
      cta: "See how it works", wa: "Hi! I'd like to see how the AI manager works",
      note: "Or open WhatsApp directly",
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
      text: "Imagine an employee who never misses a call. The bot picks up by itself, talks in a natural voice, answers questions about prices and free slots and books the customer on the spot. You get the recording and a short summary, and you see which ad the call came from. Don't believe it? Call it yourself.",
      points: ["Picks up on the first ring, day and night", "Speaks Hebrew and Russian like a real person", "A recording of every call and a summary on WhatsApp"],
      cta: "Call the bot", wa: "Hi! I'd like a voice bot for my business",
      note: "The bot answers by itself: ask about prices or try to book", or: "I want this bot",
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
 * Real work for the swipeable windows (files in public/showcase/media, compressed
 * for the web: 720px wide, posters load first, a video loads only when played).
 */
export type VideoTag = "premium" | "product" | "3d" | "basic";
export const VIDEO_SLIDES: { src: string; poster: string; tag: VideoTag }[] = [
  { src: "/showcase/media/video-1.mp4", poster: "/showcase/media/video-1.webp", tag: "premium" },
  { src: "/showcase/media/video-3.mp4", poster: "/showcase/media/video-3.webp", tag: "premium" },
  { src: "/showcase/media/video-5.mp4", poster: "/showcase/media/video-5.webp", tag: "product" },
  { src: "/showcase/media/video-6.mp4", poster: "/showcase/media/video-6.webp", tag: "3d" },
];
/** posts: animated stories (short muted loops) and still banners */
export const POST_SLIDES: { src: string; poster?: string; video?: boolean }[] = []; // new banners go here; the window stays empty until then
