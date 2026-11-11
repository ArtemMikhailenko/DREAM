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
const svcEs: ServicesCopy = {
  sub: "Todo lo que hace falta para que los clientes te encuentren, te escriban y te compren. Explicado sin tecnicismos",
  more: "Pedir presupuesto",
  ctaHeading: "¿No sabes cuál de estos necesitas?",
  ctaText: "Cuéntanos sobre tu negocio. Elegimos la combinación adecuada y te enviamos presupuesto",
  ctaBtn: "Pedir presupuesto",
  items: {
    "seo": { title: "Tu web en los primeros puestos de Google", tag: "SEO", teaser: "Los clientes te encuentran solos en la búsqueda normal de Google, sin pagar por cada clic" },
    "targeted-advertising": { title: "Publicidad en Instagram y Facebook", tag: "Anuncios", teaser: "Tus anuncios llegan justo a quien necesita tu producto y traen solicitudes" },
    "smm": { title: "Gestión de redes sociales", tag: "Social media", teaser: "Posts, stories y vídeos que convierten seguidores en clientes" },
    "google-ads": { title: "Publicidad en Google", tag: "Google Ads", teaser: "Tu anuncio lo ve quien busca tu servicio ahora mismo" },
    "photo-video": { title: "Foto y vídeo", tag: "Producción", teaser: "Vídeos y fotos de nivel cine para anuncios, redes y tu web" },
    "marketing-strategy": { title: "Estrategia de ventas", tag: "Estrategia", teaser: "Analizamos tu negocio y trazamos un camino claro del primer anuncio a la compra" },
    "website-development": { title: "Webs y landing pages", tag: "Webs", teaser: "Webs rápidas que venden y captan solicitudes las 24 horas" },
    "automation": { title: "Chatbots y automatización", tag: "Bots", teaser: "Un bot responde a tus clientes en segundos y ningún lead se pierde" },
    "geo-ai-seo": { title: "Recomendado por ChatGPT", tag: "Búsqueda IA", teaser: "Hacemos que ChatGPT y otros asistentes de IA te recomienden a ti" },
  },
};
const svcAr: ServicesCopy = {
  sub: "كل ما يلزم ليجدك الزبائن ويراسلوك ويشتروا منك. بلغة بسيطة وواضحة",
  more: "اطلب عرض سعر",
  ctaHeading: "لست متأكداً أيها تحتاج؟",
  ctaText: "أخبرنا عن عملك. نختار لك المزيج المناسب ونرسل عرض سعر",
  ctaBtn: "احصل على عرض سعر",
  items: {
    "seo": { title: "موقعك في أعلى نتائج جوجل", tag: "SEO", teaser: "الزبائن يجدونك بأنفسهم في بحث جوجل العادي، دون أن تدفع على كل نقرة" },
    "targeted-advertising": { title: "إعلانات على إنستغرام وفيسبوك", tag: "استهداف", teaser: "إعلاناتك تصل تحديداً لمن يحتاج منتجك، وتجلب الطلبات" },
    "smm": { title: "إدارة السوشيال ميديا", tag: "سوشيال ميديا", teaser: "منشورات وستوري وفيديوهات تحوّل المتابعين إلى زبائن" },
    "google-ads": { title: "إعلانات على جوجل", tag: "Google Ads", teaser: "إعلانك يظهر لمن يبحث عن خدمتك الآن" },
    "photo-video": { title: "تصوير وفيديو", tag: "إنتاج", teaser: "فيديوهات وصور بجودة سينمائية للإعلانات والسوشيال والموقع" },
    "marketing-strategy": { title: "استراتيجية مبيعات", tag: "استراتيجية", teaser: "ندرس عملك ونرسم طريقاً واضحاً من أول إعلان حتى الشراء" },
    "website-development": { title: "مواقع وصفحات هبوط", tag: "مواقع", teaser: "مواقع سريعة تبيع وتجمع الطلبات على مدار الساعة" },
    "automation": { title: "روبوتات محادثة وأتمتة", tag: "روبوتات", teaser: "روبوت يرد على الزبائن خلال ثوانٍ، فلا يضيع أي طلب" },
    "geo-ai-seo": { title: "توصيات في ChatGPT", tag: "بحث AI", teaser: "نجعل ChatGPT ومساعدي الذكاء الاصطناعي يوصون بك أنت" },
  },
};
export const servicesCopy = (l: string) => ({ ru: svcRu, he: svcHe, es: svcEs, ar: svcAr } as Record<string, ServicesCopy>)[l] ?? svcEn;

/* Portfolio filters: plain names; old CMS tags map onto them */
export const portfolioCategories = (l: string) =>
  ({
    ru: ["Все", "Имиджевое видео", "Реклама и креативы", "Social media", "Чат-боты", "Промо-видео", "Сайты"],
    he: ["הכל", "סרטון תדמית", "פרסום וקריאייטיב", "Social media", "צ'אטבוטים", "סרטון פרסום", "אתרים"],
    es: ["Todo", "Vídeo de imagen", "Publicidad y creativos", "Social media", "Chatbots", "Vídeo promocional", "Webs"],
    ar: ["الكل", "فيديو تعريفي", "إعلانات وتصاميم", "سوشيال ميديا", "روبوتات محادثة", "فيديو إعلاني", "مواقع"],
  } as Record<string, string[]>)[l] ?? ["All", "Image video", "Ads & creatives", "Social media", "Chatbots", "Promo video", "Websites"];
export const portfolioTagMap: Record<string, string> = {
  "SMM": "Social media",
  "Полная воронка": "Чат-боты", "Full funnel": "Chatbots", "משפך מלא": "צ'אטבוטים",
  "Promotional video": "Promo video",
  "Embudo completo": "Chatbots",
  "مسار بيع كامل": "روبوتات محادثة",
};
export const portfolioEmpty = (l: string) =>
  ({ ru: "Скоро здесь появятся новые кейсы", he: "בקרוב יעלו לכאן פרויקטים חדשים", es: "Pronto habrá nuevos casos aquí", ar: "قريباً ستُضاف هنا مشاريع جديدة" } as Record<string, string>)[l] ?? "New cases coming soon";

/* About: what we do, in plain words */
export type AboutCopy = {
  heroLabel: string; heroHeading: string; heroEm: string; heroSub: string;
  storyLabel: string; storyHeading: string; p1: string; p2: string; slogan: string;
  valuesLabel: string; valuesHeading: string; values: { title: string; desc: string }[];
  clientsHeading: string;
};
const aboutRu: AboutCopy = {
  heroLabel: "О DC Production",
  heroHeading: "Маркетинг и продажи",
  heroEm: "под ключ",
  heroSub: "Приводим клиентов, помогаем обрабатывать заявки и выстраиваем систему продаж, которая работает без вас",
  storyLabel: "Наша история",
  storyHeading: "Как мы начинали",
  p1: "DC Production начинался как команда видеопродакшна. Мы снимали красиво, но быстро поняли: бизнесу нужны не просто красивые ролики, а клиенты.",
  p2: "Сегодня мы студия полного цикла. Приводим вам клиентов, помогаем обрабатывать заявки и выстраиваем всю систему маркетинга и продаж: с ботами и автоматизацией, чтобы бизнес рос, а вы не тратили на это своё время.",
  slogan: "от идеи к результату",
  valuesLabel: "Наши принципы",
  valuesHeading: "Как мы работаем",
  values: [
    { title: "Качество прежде всего", desc: "Каждый кадр, текст и цифра сделаны на уровне сильной продакшн-студии. Слабая работа от нас не выходит" },
    { title: "Всё делает одна команда", desc: "Реклама, контент, сайт и продажи работают как надо, только когда их делает одна команда. Поэтому мы берём всё на себя" },
    { title: "Результат обязателен", desc: "Красивая работа, которая не приносит заявки, — это провал. У каждого проекта есть понятный результат в цифрах" },
    { title: "Всё честно и понятно", desc: "Вы всегда знаете, сколько пришло заявок и сколько стоила каждая. Без сложных терминов и красивых отчётов ни о чём" },
  ],
  clientsHeading: "Наши клиенты",
};
const aboutEn: AboutCopy = {
  heroLabel: "About DC Production",
  heroHeading: "Marketing and sales",
  heroEm: "done for you",
  heroSub: "We bring you customers, help handle the leads and build a sales system that runs without you",
  storyLabel: "Our story",
  storyHeading: "How we started",
  p1: "DC Production started as a video production team. Our work looked great, but we soon saw that businesses need more than beautiful videos. They need customers.",
  p2: "Today we're a full-cycle studio. We bring you customers, help handle the leads and build the whole marketing and sales system, with bots and automation, so the business grows and you don't spend your time on it.",
  slogan: "from idea to result",
  valuesLabel: "Our principles",
  valuesHeading: "How we work",
  values: [
    { title: "Quality first", desc: "Every frame, word and number is made to the standard of a strong production studio. Weak work never leaves the studio" },
    { title: "One team does it all", desc: "Ads, content, website and sales only work properly when one team builds them. That's why we take it all on" },
    { title: "Results are a must", desc: "Beautiful work that brings no leads is a failure. Every project has a clear result in numbers" },
    { title: "Honest and clear", desc: "You always know how many leads came in and what each one cost. No jargon and no pretty reports about nothing" },
  ],
  clientsHeading: "Our clients",
};
const aboutHe: AboutCopy = {
  heroLabel: "על DC Production",
  heroHeading: "שיווק ומכירות",
  heroEm: "מקצה לקצה",
  heroSub: "מביאים לכם לקוחות, עוזרים לטפל בלידים ובונים מערכת מכירות שעובדת בלעדיכם",
  storyLabel: "הסיפור שלנו",
  storyHeading: "איך התחלנו",
  p1: "DC Production התחילה כצוות הפקת וידאו. צילמנו יפה, אבל מהר הבנו שעסקים צריכים לא רק סרטונים יפים, אלא לקוחות.",
  p2: "היום אנחנו סטודיו מלא. מביאים לכם לקוחות, עוזרים לטפל בלידים ובונים את כל מערכת השיווק והמכירות, עם בוטים ואוטומציה, כדי שהעסק יצמח ואתם לא תבזבזו על זה זמן.",
  slogan: "מרעיון לתוצאה",
  valuesLabel: "העקרונות שלנו",
  valuesHeading: "איך אנחנו עובדים",
  values: [
    { title: "איכות קודם כול", desc: "כל פריים, מילה ומספר נעשים ברמה של סטודיו הפקה חזק. עבודה חלשה לא יוצאת מאיתנו" },
    { title: "צוות אחד עושה הכול", desc: "פרסום, תוכן, אתר ומכירות עובדים נכון רק כשצוות אחד בונה אותם. לכן אנחנו לוקחים הכול על עצמנו" },
    { title: "תוצאה היא חובה", desc: "עבודה יפה שלא מביאה לידים היא כישלון. לכל פרויקט יש תוצאה ברורה במספרים" },
    { title: "הכול שקוף וברור", desc: "אתם תמיד יודעים כמה לידים הגיעו וכמה עלה כל אחד. בלי מונחים מסובכים ובלי דוחות יפים על כלום" },
  ],
  clientsHeading: "הלקוחות שלנו",
};
const aboutEs: AboutCopy = {
  heroLabel: "Sobre DC Production",
  heroHeading: "Marketing y ventas",
  heroEm: "llave en mano",
  heroSub: "Te traemos clientes, te ayudamos a gestionar los leads y montamos un sistema de ventas que funciona sin ti",
  storyLabel: "Nuestra historia",
  storyHeading: "Cómo empezamos",
  p1: "DC Production empezó como un equipo de producción de vídeo. Nuestro trabajo se veía genial, pero pronto vimos que los negocios necesitan algo más que vídeos bonitos: necesitan clientes.",
  p2: "Hoy somos un estudio de ciclo completo. Te traemos clientes, te ayudamos con los leads y montamos todo el sistema de marketing y ventas, con bots y automatización, para que el negocio crezca sin que le dediques tu tiempo.",
  slogan: "de la idea al resultado",
  valuesLabel: "Nuestros principios",
  valuesHeading: "Cómo trabajamos",
  values: [
    { title: "La calidad primero", desc: "Cada plano, palabra y cifra se hace con nivel de productora. El trabajo flojo nunca sale del estudio" },
    { title: "Un solo equipo lo hace todo", desc: "Publicidad, contenido, web y ventas solo funcionan bien cuando los construye un mismo equipo. Por eso nos encargamos de todo" },
    { title: "Los resultados son obligatorios", desc: "Un trabajo bonito que no trae clientes es un fracaso. Cada proyecto tiene un resultado claro en cifras" },
    { title: "Claro y honesto", desc: "Siempre sabes cuántos leads llegaron y cuánto costó cada uno. Sin tecnicismos ni informes bonitos que no dicen nada" },
  ],
  clientsHeading: "Nuestros clientes",
};
const aboutAr: AboutCopy = {
  heroLabel: "عن DC Production",
  heroHeading: "تسويق ومبيعات",
  heroEm: "متكاملة",
  heroSub: "نجلب لك الزبائن، نساعدك في متابعة الطلبات ونبني نظام مبيعات يعمل من دونك",
  storyLabel: "قصتنا",
  storyHeading: "كيف بدأنا",
  p1: "بدأت DC Production كفريق إنتاج فيديو. كانت أعمالنا جميلة، لكننا أدركنا بسرعة أن الأعمال تحتاج أكثر من فيديوهات جميلة. إنها تحتاج زبائن.",
  p2: "اليوم نحن استوديو متكامل. نجلب لك الزبائن، نساعدك في متابعة الطلبات ونبني نظام التسويق والمبيعات كاملاً، مع روبوتات وأتمتة، ليكبر عملك دون أن تصرف وقتك عليه.",
  slogan: "من الفكرة إلى النتيجة",
  valuesLabel: "مبادئنا",
  valuesHeading: "كيف نعمل",
  values: [
    { title: "الجودة أولاً", desc: "كل لقطة وكلمة ورقم تُصنع بمستوى استوديو إنتاج قوي. العمل الضعيف لا يخرج من عندنا" },
    { title: "فريق واحد يفعل كل شيء", desc: "الإعلانات والمحتوى والموقع والمبيعات تعمل كما يجب فقط عندما يبنيها فريق واحد. لذلك نتولى كل شيء" },
    { title: "النتيجة شرط", desc: "العمل الجميل الذي لا يجلب طلبات فشل. لكل مشروع نتيجة واضحة بالأرقام" },
    { title: "صدق ووضوح", desc: "تعرف دائماً كم طلباً وصل وكم كلّف كل واحد. بلا مصطلحات معقدة ولا تقارير جميلة بلا معنى" },
  ],
  clientsHeading: "عملاؤنا",
};
export const aboutCopy = (l: string): AboutCopy => ({ ru: aboutRu, he: aboutHe, es: aboutEs, ar: aboutAr } as Record<string, AboutCopy>)[l] ?? aboutEn;

/* Works page: the ad-results block */
export const portfolioResults = (l: string) =>
  ({
    ru: { label: "Результаты рекламы", heading: "Цифры из", em: "рекламных кабинетов", sub: "Реальные кампании наших клиентов: сколько пришло заявок и сколько стоила каждая" },
    he: { label: "תוצאות פרסום", heading: "מספרים מתוך", em: "חשבונות הפרסום", sub: "קמפיינים אמיתיים של הלקוחות שלנו: כמה לידים הגיעו וכמה עלה כל אחד" },
    ar: { label: "نتائج الإعلانات", heading: "أرقام من", em: "حساباتنا الإعلانية", sub: "حملات حقيقية لعملائنا: كم طلباً وصل وكم كلّف كل واحد" },
    es: { label: "Resultados publicitarios", heading: "Cifras de", em: "nuestras cuentas publicitarias", sub: "Campañas reales de nuestros clientes: cuántos leads llegaron y cuánto costó cada uno" },
  } as Record<string, { label: string; heading: string; em: string; sub: string }>)[l] ?? { label: "Ad results", heading: "Numbers from", em: "our ad accounts", sub: "Real campaigns for our clients: how many leads came in and what each one cost" };

export const aboutTags = (l: string) =>
  ({
    ru: ["Реклама в Instagram и Facebook", "Реклама в Google", "Съёмка фото и видео", "Контент для соцсетей", "Сайты и лендинги", "Чат-боты", "Автоматизация продаж", "Помощь с продажами"],
    he: ["פרסום באינסטגרם ובפייסבוק", "פרסום בגוגל", "צילום ווידאו", "תוכן לרשתות", "אתרים ודפי נחיתה", "צ'אטבוטים", "אוטומציית מכירות", "עזרה במכירות"],
    ar: ["إعلانات إنستغرام وفيسبوك", "إعلانات جوجل", "تصوير صور وفيديو", "محتوى للسوشيال ميديا", "مواقع وصفحات هبوط", "روبوتات محادثة", "أتمتة المبيعات", "مساعدة في المبيعات"],
    es: ["Publicidad en Instagram y Facebook", "Publicidad en Google", "Foto y vídeo", "Contenido para redes", "Webs y landing pages", "Chatbots", "Automatización de ventas", "Ayuda con las ventas"],
  } as Record<string, string[]>)[l] ?? ["Instagram & Facebook ads", "Google ads", "Photo & video shoots", "Social media content", "Websites & landing pages", "Chatbots", "Sales automation", "Help with sales"];

/* Works page: websites we built (screenshots in public/sites) */
export type SiteItem = { name: string; domain: string; url: string; desc: string; img: string; phone: string };
export const portfolioSites = (l: string) => {
  const t = ({
    ru: { open: "Открыть сайт", d: ["Сайт производителя алюминиевых конструкций: перголы, остекление и ZIP-шторы. Заявки на бесплатную консультацию прямо с первого экрана", "Сайт для израильтян, которые хотят купить первую квартиру в Грузии: понятные цифры, конкретные дома и запись на вебинар", "Сайт винного бутика в Ришон-ле-Ционе: живые сцены при прокрутке, три языка и заявки на доставку"] },
    ar: { open: "زيارة الموقع", d: ["موقع لمصنّع هياكل الألمنيوم: برغولات، زجاج وستائر ZIP. طلب استشارة مجانية من الشاشة الأولى", "موقع لمن يريد شراء شقته الأولى في جورجيا: أرقام واضحة، مشاريع محددة وتسجيل للندوات", "موقع لمتجر نبيذ في ريشون لتسيون: مشاهد حية عند التمرير، ثلاث لغات وطلبات توصيل"] },
    es: { open: "Ver la web", d: ["Web para un fabricante de estructuras de aluminio: pérgolas, acristalamientos y toldos ZIP. Solicitudes de consulta gratuita desde la primera pantalla", "Web para quienes compran su primer piso en Georgia: cifras claras, edificios concretos e inscripción a webinars", "Web para una tienda de vinos: escenas vivas al hacer scroll, tres idiomas y pedidos a domicilio"] },
    he: { open: "לאתר", d: ["אתר ליצרן מבני אלומיניום: פרגולות, זיגוג ומסכי ZIP. השארת פרטים לייעוץ חינם כבר במסך הראשון", "אתר לישראלים שרוצים לקנות דירה ראשונה בגאורגיה: מספרים ברורים, פרויקטים ספציפיים והרשמה לוובינר", "אתר לבוטיק יין בראשון לציון: סצנות חיות בגלילה, שלוש שפות ופניות למשלוח"] },
  } as Record<string, { open: string; d: string[] }>)[l] ?? { open: "Visit site", d: ["Website for an aluminium structures manufacturer: pergolas, glazing and ZIP screens. Free consultation requests right from the first screen", "Website for Israelis buying their first apartment in Georgia: clear numbers, specific buildings and webinar sign-ups", "Website for a wine boutique in Rishon LeZion: living scenes on scroll, three languages and delivery requests"] };
  // each site is shown in the visitor's language; Vitlion has only Russian and Hebrew,
  // so everyone outside the Hebrew version sees its Russian one (Arabic pages show the Hebrew screenshots)
  const L = (l === "ar" ? "he" : ["ru", "he"].includes(l) ? l : "en") as "ru" | "he" | "en";
  const vit = L === "he" ? "he" : "ru";
  const items: SiteItem[] = [
    { name: "Vitlion Group", domain: "vitlion.co.il", url: vit === "ru" ? "https://www.vitlion.co.il/ru" : "https://www.vitlion.co.il/", desc: t.d[0], img: `/sites/vitlion-${vit}-desktop.webp`, phone: `/sites/vitlion-${vit}-phone.webp` },
    { name: "Nexis Capital", domain: "nexiscapital-israel.com", url: "https://nexiscapital-israel.com", desc: t.d[1], img: `/sites/nexis-${L}-desktop.webp`, phone: `/sites/nexis-${L}-phone.webp` },
    { name: "40 MAALOT", domain: "40maalot.co.il", url: { ru: "https://40maalot.co.il/ru/", en: "https://40maalot.co.il/en/", he: "https://40maalot.co.il/" }[L], desc: t.d[2], img: `/sites/maalot-${L}-desktop.webp`, phone: `/sites/maalot-${L}-phone.webp` },
  ];
  return { open: t.open, items };
};
