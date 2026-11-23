/**
 * Copy for the hidden client showcase (/showcase): a page we send to clients in
 * WhatsApp instead of Drive folders. Not in the menu, sitemap or search.
 *
 * Sections: sites, ad results, video, ad posts, AI chat manager, voice bot,
 * telephony. Posts, voice bot and telephony show a live demo of how it works
 * and a WhatsApp button for examples until their own files are uploaded.
 */
export const WA_BOT = "972536260121";

export type Line = { me?: boolean; t: string };
type Service = { title: string; em: string; text: string; points: string[]; cta: string; wa: string };

export type ShowcaseCopy = {
  meta: string;
  kicker: string;
  sub: string;
  tabs: { all: string; sites: string; results: string; video: string; posts: string; bot: string; voice: string; tel: string };
  open: string;
  light: string;
  dark: string;
  // video
  videoTitle: string;
  videoText: string;
  langs: Record<string, string>;
  videoMore: string;
  videoWa: string;
  // posts
  posts: Service;
  // AI chat manager
  bot: Service & { note: string; typing: string; chat: Line[] };
  // voice bot
  voice: Service & { calling: string; script: Line[] };
  // telephony
  tel: Service & { calls: { who: string; src: string; st: string }[]; head: string; rec: string };
  cta: string;
  ctaText: string;
  ctaBtn: string;
  waMore: string;
};

const C: Record<string, ShowcaseCopy> = {
  ru: {
    meta: "Портфолио DC Production",
    kicker: "Портфолио DC Production",
    sub: "Выберите раздел: всё открывается прямо здесь.",
    tabs: { all: "Все", sites: "Сайты", results: "Результаты рекламы", video: "Видео", posts: "Рекламные посты", bot: "ИИ-менеджер по перепискам", voice: "Разговорный бот", tel: "Телефония" },
    open: "Открыть сайт",
    light: "Светлая тема", dark: "Тёмная тема",
    videoTitle: "Рекламный ролик DC Production",
    videoText: "Один сценарий, снятый и смонтированный на пяти языках. Нажмите, чтобы посмотреть.",
    langs: { ru: "Русский", he: "Иврит", en: "English", es: "Español", ar: "العربية" },
    videoMore: "Ещё ролики под вашу нишу пришлём в WhatsApp",
    videoWa: "Здравствуйте! Хочу посмотреть примеры видеороликов",
    posts: {
      title: "Рекламные", em: "посты и баннеры",
      text: "Посты, сторис и баннеры для Instagram и Facebook: дизайн и тексты под вашу аудиторию на иврите и русском.",
      points: ["Ленты, сторис, карусели", "Тексты на иврите и русском", "Готовы к запуску рекламы"],
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
      text: "Голосовой ИИ, который сам отвечает на звонки: говорит с клиентом живым голосом, отвечает на вопросы и записывает на услугу.",
      points: ["Берёт трубку с первого гудка", "Говорит на иврите и русском", "Записывает клиента и присылает вам итог"],
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
    tel: {
      title: "Телефония", em: "для бизнеса",
      text: "Все звонки в одном месте: видно, с какой рекламы позвонил клиент, каждый разговор записан, пропущенные не теряются.",
      points: ["Номер для рекламы и сайта", "Запись всех разговоров", "Источник каждого звонка"],
      cta: "Узнать подробнее", wa: "Здравствуйте! Хочу узнать про телефонию для бизнеса",
      head: "Звонки сегодня", rec: "Запись",
      calls: [
        { who: "Новый клиент", src: "Instagram", st: "Принят" },
        { who: "Новый клиент", src: "Facebook", st: "Принят" },
        { who: "Новый клиент", src: "Google", st: "Перезвонили" },
        { who: "Постоянный клиент", src: "Сайт", st: "Принят" },
      ],
    },
    cta: "Хотите так же?", ctaText: "Напишите нам, и мы предложим решение под ваш бизнес.", ctaBtn: "Обсудить проект",
    waMore: "Здравствуйте! Посмотрел ваше портфолио, хочу обсудить проект",
  },
  he: {
    meta: "תיק עבודות DC Production",
    kicker: "תיק עבודות DC Production",
    sub: "בחרו קטגוריה: הכל נפתח כאן.",
    tabs: { all: "הכל", sites: "אתרים", results: "תוצאות פרסום", video: "וידאו", posts: "פוסטים ממומנים", bot: "מנהל AI לשיחות", voice: "בוט קולי", tel: "טלפוניה" },
    open: "לאתר",
    light: "מצב בהיר", dark: "מצב כהה",
    videoTitle: "סרטון הפרסום של DC Production",
    videoText: "תסריט אחד, צולם ונערך בחמש שפות. לחצו לצפייה.",
    langs: { he: "עברית", ru: "Русский", en: "English", es: "Español", ar: "العربية" },
    videoMore: "סרטונים נוספים בתחום שלכם נשלח בוואטסאפ",
    videoWa: "שלום! אשמח לראות דוגמאות של סרטונים",
    posts: {
      title: "פוסטים", em: "ובאנרים",
      text: "פוסטים, סטוריז ובאנרים לאינסטגרם ופייסבוק: עיצוב וטקסטים לקהל שלכם בעברית וברוסית.",
      points: ["פיד, סטוריז, קרוסלות", "טקסטים בעברית וברוסית", "מוכנים להשקת קמפיין"],
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
      text: "AI קולי שעונה לשיחות בעצמו: מדבר עם הלקוח בקול טבעי, עונה על שאלות וקובע תורים.",
      points: ["עונה מהצלצול הראשון", "מדבר עברית ורוסית", "קובע תור ושולח לכם סיכום"],
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
    tel: {
      title: "טלפוניה", em: "לעסקים",
      text: "כל השיחות במקום אחד: רואים מאיזה פרסום הלקוח התקשר, כל שיחה מוקלטת ושיחות שלא נענו לא הולכות לאיבוד.",
      points: ["מספר לפרסום ולאתר", "הקלטת כל השיחות", "מקור של כל שיחה"],
      cta: "לפרטים נוספים", wa: "שלום! אשמח לשמוע על טלפוניה לעסקים",
      head: "שיחות היום", rec: "הקלטה",
      calls: [
        { who: "לקוח חדש", src: "Instagram", st: "נענתה" },
        { who: "לקוח חדש", src: "Facebook", st: "נענתה" },
        { who: "לקוח חדש", src: "Google", st: "חזרנו" },
        { who: "לקוח קבוע", src: "אתר", st: "נענתה" },
      ],
    },
    cta: "רוצים גם?", ctaText: "כתבו לנו ונציע פתרון לעסק שלכם.", ctaBtn: "לדבר על פרויקט",
    waMore: "שלום! ראיתי את תיק העבודות, אשמח לדבר על פרויקט",
  },
  en: {
    meta: "DC Production portfolio",
    kicker: "DC Production portfolio",
    sub: "Pick a section: everything opens right here.",
    tabs: { all: "All", sites: "Websites", results: "Ad results", video: "Video", posts: "Ad posts", bot: "AI chat manager", voice: "Voice bot", tel: "Telephony" },
    open: "Open site",
    light: "Light theme", dark: "Dark theme",
    videoTitle: "DC Production ad film",
    videoText: "One script, shot and edited in five languages. Tap to watch.",
    langs: { en: "English", ru: "Русский", he: "עברית", es: "Español", ar: "العربية" },
    videoMore: "More videos for your niche, sent on WhatsApp",
    videoWa: "Hi! I'd like to see examples of your videos",
    posts: {
      title: "Ad posts", em: "and banners",
      text: "Posts, stories and banners for Instagram and Facebook: design and copy for your audience in Hebrew and Russian.",
      points: ["Feed, stories, carousels", "Copy in Hebrew and Russian", "Ready to launch ads"],
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
      text: "Voice AI that answers calls itself: talks to the customer in a natural voice, answers questions and books appointments.",
      points: ["Picks up on the first ring", "Speaks Hebrew and Russian", "Books the client and sends you a summary"],
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
    tel: {
      title: "Business", em: "telephony",
      text: "Every call in one place: see which ad the customer called from, every conversation recorded, no missed call lost.",
      points: ["A number for ads and the site", "Every call recorded", "The source of each call"],
      cta: "Learn more", wa: "Hi! I'd like to know about business telephony",
      head: "Calls today", rec: "Recording",
      calls: [
        { who: "New client", src: "Instagram", st: "Answered" },
        { who: "New client", src: "Facebook", st: "Answered" },
        { who: "New client", src: "Google", st: "Called back" },
        { who: "Regular client", src: "Website", st: "Answered" },
      ],
    },
    cta: "Want the same?", ctaText: "Message us and we'll suggest a solution for your business.", ctaBtn: "Discuss a project",
    waMore: "Hi! I saw your portfolio and would like to discuss a project",
  },
  es: {
    meta: "Portafolio de DC Production",
    kicker: "Portafolio de DC Production",
    sub: "Elige una sección: todo se abre aquí mismo.",
    tabs: { all: "Todo", sites: "Webs", results: "Resultados de anuncios", video: "Vídeo", posts: "Publicaciones", bot: "Gestor IA de chats", voice: "Bot de voz", tel: "Telefonía" },
    open: "Abrir web",
    light: "Tema claro", dark: "Tema oscuro",
    videoTitle: "Spot publicitario de DC Production",
    videoText: "Un guion, rodado y montado en cinco idiomas. Pulsa para verlo.",
    langs: { es: "Español", en: "English", ru: "Русский", he: "עברית", ar: "العربية" },
    videoMore: "Más vídeos de tu sector, por WhatsApp",
    videoWa: "¡Hola! Me gustaría ver ejemplos de vídeos",
    posts: {
      title: "Publicaciones", em: "y banners",
      text: "Posts, stories y banners para Instagram y Facebook: diseño y textos pensados para tu público.",
      points: ["Feed, stories, carruseles", "Textos en varios idiomas", "Listos para lanzar anuncios"],
      cta: "Ver ejemplos", wa: "¡Hola! Me gustaría ver ejemplos de publicaciones",
    },
    bot: {
      title: "Gestor IA", em: "de chats",
      text: "Responde a tus clientes en WhatsApp en segundos, de día y de noche. Escríbele y comprueba cómo funciona.",
      points: ["Responde en segundos, 24/7", "Entiende varios idiomas", "Recoge la solicitud y te la pasa"],
      cta: "Escribir por WhatsApp", wa: "¡Hola! Quiero ver cómo funciona el gestor IA",
      note: "Se abrirá un chat con el gestor IA",
      typing: "escribiendo…",
      chat: [
        { t: "¡Hola! ¿Cuánto cuesta la publicidad para un salón?" },
        { me: true, t: "¡Hola! Depende de la ciudad y el presupuesto. ¿Dónde está el salón?" },
        { t: "En Valencia" },
        { me: true, t: "Perfecto, preparo opciones. ¿Te llama un gestor hoy a las 17:00?" },
        { t: "Sí, vale 👍" },
      ],
    },
    voice: {
      title: "Bot", em: "de voz",
      text: "IA de voz que atiende las llamadas: habla con el cliente con voz natural, responde preguntas y agenda citas.",
      points: ["Contesta al primer tono", "Habla varios idiomas", "Agenda al cliente y te envía un resumen"],
      cta: "Escuchar una demo", wa: "¡Hola! Quiero escuchar cómo funciona el bot de voz",
      calling: "Llamada en curso",
      script: [
        { me: true, t: "¡Hola! Estudio de belleza, ¿en qué te ayudo?" },
        { t: "Quiero una manicura para mañana" },
        { me: true, t: "Mañana hay hueco a las 11:00 y a las 15:30. ¿Cuál prefieres?" },
        { t: "A las 15:30" },
        { me: true, t: "Reservado a las 15:30. Te envío la confirmación por WhatsApp." },
      ],
    },
    tel: {
      title: "Telefonía", em: "para empresas",
      text: "Todas las llamadas en un sitio: ves de qué anuncio llamó cada cliente, cada conversación grabada, ninguna perdida.",
      points: ["Un número para anuncios y web", "Grabación de llamadas", "Origen de cada llamada"],
      cta: "Saber más", wa: "¡Hola! Quiero saber más sobre la telefonía para empresas",
      head: "Llamadas de hoy", rec: "Grabación",
      calls: [
        { who: "Cliente nuevo", src: "Instagram", st: "Atendida" },
        { who: "Cliente nuevo", src: "Facebook", st: "Atendida" },
        { who: "Cliente nuevo", src: "Google", st: "Devuelta" },
        { who: "Cliente habitual", src: "Web", st: "Atendida" },
      ],
    },
    cta: "¿Quieres lo mismo?", ctaText: "Escríbenos y te proponemos una solución para tu negocio.", ctaBtn: "Hablar del proyecto",
    waMore: "¡Hola! He visto vuestro portafolio y quiero hablar de un proyecto",
  },
  ar: {
    meta: "أعمال DC Production",
    kicker: "أعمال DC Production",
    sub: "اختر قسمًا: كل شيء يفتح هنا.",
    tabs: { all: "الكل", sites: "مواقع", results: "نتائج الإعلانات", video: "فيديو", posts: "منشورات إعلانية", bot: "مدير محادثات بالذكاء الاصطناعي", voice: "بوت صوتي", tel: "اتصالات" },
    open: "افتح الموقع",
    light: "الوضع الفاتح", dark: "الوضع الداكن",
    videoTitle: "الفيلم الإعلاني لـ DC Production",
    videoText: "سيناريو واحد، صُوّر ومُنتج بخمس لغات. اضغط للمشاهدة.",
    langs: { ar: "العربية", he: "עברית", en: "English", ru: "Русский", es: "Español" },
    videoMore: "فيديوهات أخرى في مجالك نرسلها عبر واتساب",
    videoWa: "مرحبًا! أود رؤية أمثلة على الفيديوهات",
    posts: {
      title: "منشورات", em: "وبانرات",
      text: "منشورات وستوري وبانرات لإنستغرام وفيسبوك: تصميم ونصوص لجمهورك.",
      points: ["فيد، ستوري، كاروسيل", "نصوص بعدة لغات", "جاهزة لإطلاق الإعلانات"],
      cta: "احصل على أمثلة", wa: "مرحبًا! أود رؤية أمثلة على المنشورات الإعلانية",
    },
    bot: {
      title: "مدير محادثات", em: "بالذكاء الاصطناعي",
      text: "يرد على عملائك في واتساب خلال ثوانٍ، ليلًا ونهارًا. راسله بنفسك وشاهد كيف يعمل.",
      points: ["يرد خلال ثوانٍ، 24/7", "يفهم العربية والعبرية والإنجليزية", "يجمع الطلب ويرسله إليك"],
      cta: "راسل عبر واتساب", wa: "مرحبًا! أود أن أرى كيف يعمل مدير الذكاء الاصطناعي",
      note: "ستُفتح محادثة مع المدير الذكي",
      typing: "يكتب…",
      chat: [
        { t: "مرحبًا! كم تكلفة الإعلان لصالون؟" },
        { me: true, t: "مرحبًا! يعتمد على المدينة والميزانية. أين يقع الصالون؟" },
        { t: "في حيفا" },
        { me: true, t: "ممتاز، سأجهز خيارات. هل يناسبك أن يتصل بك مندوب اليوم الساعة 17:00؟" },
        { t: "نعم، تمام 👍" },
      ],
    },
    voice: {
      title: "بوت", em: "صوتي",
      text: "ذكاء اصطناعي صوتي يرد على المكالمات بنفسه: يتحدث مع العميل بصوت طبيعي، يجيب عن الأسئلة ويحجز المواعيد.",
      points: ["يرد من الرنة الأولى", "يتحدث العربية والعبرية", "يحجز للعميل ويرسل لك ملخصًا"],
      cta: "اسمع مكالمة تجريبية", wa: "مرحبًا! أود أن أسمع كيف يعمل البوت الصوتي",
      calling: "مكالمة جارية",
      script: [
        { me: true, t: "مرحبًا! استوديو تجميل، كيف أساعدك؟" },
        { t: "أريد موعد مانيكير غدًا" },
        { me: true, t: "غدًا متاح 11:00 و15:30. أيهما يناسبك؟" },
        { t: "15:30" },
        { me: true, t: "تم حجزك الساعة 15:30. سأرسل تأكيدًا عبر واتساب." },
      ],
    },
    tel: {
      title: "اتصالات", em: "للأعمال",
      text: "كل المكالمات في مكان واحد: ترى من أي إعلان اتصل العميل، كل مكالمة مسجلة، ولا تضيع أي مكالمة فائتة.",
      points: ["رقم للإعلانات والموقع", "تسجيل كل المكالمات", "مصدر كل مكالمة"],
      cta: "اعرف المزيد", wa: "مرحبًا! أود معرفة المزيد عن الاتصالات للأعمال",
      head: "مكالمات اليوم", rec: "تسجيل",
      calls: [
        { who: "عميل جديد", src: "Instagram", st: "تم الرد" },
        { who: "عميل جديد", src: "Facebook", st: "تم الرد" },
        { who: "عميل جديد", src: "Google", st: "اتصلنا مجددًا" },
        { who: "عميل دائم", src: "الموقع", st: "تم الرد" },
      ],
    },
    cta: "تريد نفس النتيجة؟", ctaText: "راسلنا وسنقترح حلًا لعملك.", ctaBtn: "ناقش مشروعك",
    waMore: "مرحبًا! شاهدت أعمالكم وأود مناقشة مشروع",
  },
};

export const showcaseCopy = (l: string): ShowcaseCopy => C[l] ?? C.en;

/** Showcase URL per locale (English at the root, Hebrew under /heb). */
export const SHOWCASE_LANGS: { id: string; label: string; href: string }[] = [
  { id: "he", label: "HE", href: "/heb/showcase" },
  { id: "ru", label: "RU", href: "/ru/showcase" },
  { id: "en", label: "EN", href: "/showcase" },
  { id: "es", label: "ES", href: "/es/showcase" },
  { id: "ar", label: "AR", href: "/ar/showcase" },
];
