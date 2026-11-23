/**
 * Copy for the hidden client showcase (/showcase): a page we send to clients in
 * WhatsApp instead of Drive folders. Not in the menu, sitemap or search.
 * Sections that have no material yet (videos, posts/banners, telephony) are
 * simply not listed — add them here and in ShowcaseBrowser when the files are ready.
 */
export const WA_BOT = "972536260121";

type Copy = {
  meta: string;
  kicker: string;
  title: string;
  em: string;
  sub: string;
  all: string;
  sites: string;
  results: string;
  bot: string;
  open: string;
  botTitle: string;
  botEm: string;
  botText: string;
  botPoints: string[];
  botCta: string;
  botNote: string;
  cta: string;
  ctaText: string;
  ctaBtn: string;
  waHello: string;
  botReply: string;
};

const C: Record<string, Copy> = {
  ru: {
    meta: "Портфолио DC Production",
    kicker: "Портфолио",
    title: "Наши работы",
    em: "в одном месте",
    sub: "Сайты, рекламные кампании и ИИ-менеджер. Выберите раздел сверху.",
    all: "Все", sites: "Сайты", results: "Результаты рекламы", bot: "ИИ-менеджер по перепискам",
    open: "Открыть сайт",
    botTitle: "ИИ-менеджер", botEm: "по перепискам",
    botText: "Отвечает вашим клиентам в WhatsApp за секунды, днём и ночью. Напишите ему сами и посмотрите, как он работает.",
    botPoints: ["Отвечает за секунды, 24/7", "Понимает иврит, русский и английский", "Собирает заявку и передаёт её вам"],
    botCta: "Написать в WhatsApp", botNote: "Откроется чат в WhatsApp",
    cta: "Хотите так же?", ctaText: "Напишите нам, и мы предложим решение под ваш бизнес.", ctaBtn: "Обсудить проект",
    waHello: "Здравствуйте! Хочу посмотреть, как работает ИИ-менеджер",
    botReply: "Здравствуйте! Я ИИ-менеджер DC Production. Расскажите о вашем бизнесе, и я подскажу решение 🙂",
  },
  he: {
    meta: "תיק עבודות DC Production",
    kicker: "תיק עבודות",
    title: "העבודות שלנו",
    em: "במקום אחד",
    sub: "אתרים, קמפיינים ומנהל AI. בחרו קטגוריה למעלה.",
    all: "הכל", sites: "אתרים", results: "תוצאות פרסום", bot: "מנהל AI לשיחות",
    open: "לאתר",
    botTitle: "מנהל AI", botEm: "לשיחות",
    botText: "עונה ללקוחות שלכם בוואטסאפ תוך שניות, יום ולילה. כתבו לו בעצמכם ותראו איך הוא עובד.",
    botPoints: ["עונה תוך שניות, 24/7", "מבין עברית, רוסית ואנגלית", "אוסף את הפנייה ומעביר אליכם"],
    botCta: "לכתוב בוואטסאפ", botNote: "ייפתח צ'אט בוואטסאפ",
    cta: "רוצים גם?", ctaText: "כתבו לנו ונציע פתרון לעסק שלכם.", ctaBtn: "לדבר על פרויקט",
    waHello: "שלום! אשמח לראות איך מנהל ה-AI עובד",
    botReply: "שלום! אני מנהל ה-AI של DC Production. ספרו לי על העסק ואציע פתרון 🙂",
  },
  en: {
    meta: "DC Production portfolio",
    kicker: "Portfolio",
    title: "Our work",
    em: "in one place",
    sub: "Websites, ad campaigns and the AI manager. Pick a section above.",
    all: "All", sites: "Websites", results: "Ad results", bot: "AI chat manager",
    open: "Open website",
    botTitle: "AI manager", botEm: "for chats",
    botText: "Answers your customers on WhatsApp in seconds, day and night. Message it yourself and see how it works.",
    botPoints: ["Replies in seconds, 24/7", "Understands Hebrew, Russian and English", "Collects the request and passes it to you"],
    botCta: "Message on WhatsApp", botNote: "Opens a WhatsApp chat",
    cta: "Want the same?", ctaText: "Message us and we'll suggest a solution for your business.", ctaBtn: "Discuss a project",
    waHello: "Hi! I'd like to see how the AI manager works",
    botReply: "Hi! I'm the DC Production AI manager. Tell me about your business and I'll suggest a solution 🙂",
  },
  es: {
    meta: "Portafolio de DC Production",
    kicker: "Portafolio",
    title: "Nuestro trabajo",
    em: "en un solo lugar",
    sub: "Webs, campañas publicitarias y el gestor de IA. Elige una sección arriba.",
    all: "Todo", sites: "Webs", results: "Resultados publicitarios", bot: "Gestor de chats con IA",
    open: "Abrir la web",
    botTitle: "Gestor de IA", botEm: "para chats",
    botText: "Responde a tus clientes en WhatsApp en segundos, de día y de noche. Escríbele tú mismo y mira cómo funciona.",
    botPoints: ["Responde en segundos, 24/7", "Entiende hebreo, ruso e inglés", "Recoge la solicitud y te la pasa"],
    botCta: "Escribir por WhatsApp", botNote: "Se abrirá un chat de WhatsApp",
    cta: "¿Quieres lo mismo?", ctaText: "Escríbenos y te propondremos una solución para tu negocio.", ctaBtn: "Hablar del proyecto",
    waHello: "¡Hola! Quiero ver cómo funciona el gestor de IA",
    botReply: "¡Hola! Soy el gestor de IA de DC Production. Cuéntame sobre tu negocio y te sugeriré una solución 🙂",
  },
  ar: {
    meta: "أعمال DC Production",
    kicker: "أعمالنا",
    title: "أعمالنا",
    em: "في مكان واحد",
    sub: "مواقع وحملات إعلانية ومدير ذكاء اصطناعي. اختر القسم من الأعلى.",
    all: "الكل", sites: "المواقع", results: "نتائج الإعلانات", bot: "مدير محادثات بالذكاء الاصطناعي",
    open: "فتح الموقع",
    botTitle: "مدير ذكاء اصطناعي", botEm: "للمحادثات",
    botText: "يرد على عملائك في واتساب خلال ثوانٍ، ليلاً ونهاراً. راسله بنفسك وشاهد كيف يعمل.",
    botPoints: ["يرد خلال ثوانٍ، 24/7", "يفهم العبرية والروسية والإنجليزية", "يجمع الطلب ويرسله إليك"],
    botCta: "مراسلة عبر واتساب", botNote: "ستُفتح محادثة واتساب",
    cta: "تريد نفس الشيء؟", ctaText: "راسلنا وسنقترح حلاً لعملك.", ctaBtn: "لنناقش المشروع",
    waHello: "مرحباً! أريد أن أرى كيف يعمل مدير الذكاء الاصطناعي",
    botReply: "مرحباً! أنا مدير الذكاء الاصطناعي في DC Production. أخبرني عن عملك وسأقترح حلاً 🙂",
  },
};
export const showcaseCopy = (l: string) => C[l] ?? C.en;
