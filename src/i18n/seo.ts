/**
 * Page titles and meta descriptions, kept in code so every page always has a
 * proper snippet in Google (several were empty in the CMS, so Google built the
 * snippet from leftover page data — old prices included). Spanish lives in es.json; Arabic is here.
 */
type Meta = { title: string; description: string };
type SeoSet = { home: Meta; servicesIndex: Meta; about: Meta; portfolio: Meta; testimonials: Meta; services: Record<string, Meta> };

const en: SeoSet = {
  home: {
    title: "DC Production — Digital Marketing & Ad Agency | Leads in 48 Hours",
    description: "DC Production (Dream Chase Production): full-cycle digital marketing. Facebook, Instagram & Google ads, SEO, video, websites and chatbots. Leads in 48 hours.",
  },
  servicesIndex: {
    title: "Digital Marketing Services | DC Production",
    description: "Ads on Facebook, Instagram and Google, SEO, social media, photo and video, websites, chatbots and sales automation. One team from strategy to customers.",
  },
  about: {
    title: "About DC Production — Marketing & Sales Done for You",
    description: "DC Production grew from a video team into a full-cycle studio: we bring customers, help handle leads and build a sales system that runs without you.",
  },
  portfolio: {
    title: "Our Work: Cases, Ad Results & Websites | DC Production",
    description: "Case studies, real numbers from our ad accounts and websites we built. See what DC Production does for businesses like yours.",
  },
  testimonials: {
    title: "Client Reviews | DC Production",
    description: "What clients say about working with DC Production: ads, video, social media and full sales funnels.",
  },
  services: {
    "seo": { title: "SEO Services in Israel — Rank on Google | DC Production", description: "Technical audit, on-page SEO, keyword research and link building that bring steady organic traffic and customers from Google, without paying per click." },
    "targeted-advertising": { title: "Facebook & Instagram Ads Agency | DC Production", description: "Meta and TikTok ads that reach people who need your product: audience research, creatives, launch, retargeting and weekly optimisation. Leads from day one." },
    "smm": { title: "Social Media Management for Business | DC Production", description: "Content plan, posts, stories and Reels, community management and monthly reports for Instagram, Facebook and TikTok. Social media that brings customers." },
    "google-ads": { title: "Google Ads Agency — Search, YouTube & Remarketing | DC Production", description: "Google Ads campaigns built for conversions: keyword research, negative keywords, clear structure, conversion tracking and budget optimisation." },
    "photo-video": { title: "Video Production & Product Photography | DC Production", description: "A mobile studio that comes to you: ad videos, Reels, product photos, 3D and VFX. Script, shoot, edit and colour, delivered ready to publish." },
    "marketing-strategy": { title: "Marketing Strategy & Sales Funnels | DC Production", description: "We study your business and customers, then build a go-to-market plan and a sales funnel where no lead gets lost, from the first ad to the deal." },
    "website-development": { title: "Website & Landing Page Development | DC Production", description: "Fast, mobile-first websites and landing pages that turn visitors into leads, with pixel, analytics, CRM and WhatsApp connected from day one." },
    "automation": { title: "WhatsApp Chatbots & Business Automation | DC Production", description: "Chatbots for WhatsApp, Instagram and Facebook that answer in seconds, qualify leads and send them to your CRM, 24/7. No lead gets lost." },
    "geo-ai-seo": { title: "GEO — Get Recommended by ChatGPT & AI Search | DC Production", description: "Generative engine optimisation: we prepare your business to appear in ChatGPT, Perplexity and Google AI Overviews answers." },
  },
};

const ru: SeoSet = {
  home: {
    title: "DC Production — рекламное агентство: клиенты за 48 часов",
    description: "DC Production (Dream Chase Production) — маркетинг под ключ: реклама в Facebook, Instagram и Google, SEO, видео, сайты и чат-боты. Первые заявки за 48 часов.",
  },
  servicesIndex: {
    title: "Услуги digital-маркетинга | DC Production",
    description: "Реклама в Facebook, Instagram и Google, SEO, соцсети, фото и видео, сайты, чат-боты и автоматизация продаж. Одна команда от стратегии до клиентов.",
  },
  about: {
    title: "О DC Production — маркетинг и продажи под ключ",
    description: "DC Production вырос из видеопродакшна в студию полного цикла: приводим клиентов, помогаем с заявками и строим систему продаж, которая работает без вас.",
  },
  portfolio: {
    title: "Наши работы: кейсы, результаты рекламы и сайты | DC Production",
    description: "Кейсы, реальные цифры из наших рекламных кабинетов и сайты, которые мы сделали. Посмотрите, что DC Production делает для бизнеса.",
  },
  testimonials: {
    title: "Отзывы клиентов | DC Production",
    description: "Что говорят клиенты о работе с DC Production: реклама, видео, соцсети и воронки продаж.",
  },
  services: {
    "seo": { title: "SEO-продвижение сайта в Google | DC Production", description: "Технический аудит, оптимизация страниц, подбор ключевых запросов и ссылки. Клиенты находят вас в обычном поиске Google, без оплаты за каждый клик." },
    "targeted-advertising": { title: "Таргетированная реклама в Facebook и Instagram | DC Production", description: "Реклама в Meta и TikTok для тех, кому нужен ваш продукт: аудитория, креативы, запуск, ретаргетинг и еженедельная оптимизация. Заявки с первых дней." },
    "smm": { title: "Ведение соцсетей для бизнеса (SMM) | DC Production", description: "Контент-план, посты, сторис и Reels, работа с комментариями и отчёт каждый месяц. Instagram, Facebook и TikTok, которые приводят клиентов." },
    "google-ads": { title: "Реклама в Google Ads: поиск, YouTube, ремаркетинг | DC Production", description: "Кампании Google Ads под заявки: подбор запросов и минус-слов, понятная структура, отслеживание конверсий и оптимизация бюджета." },
    "photo-video": { title: "Видеопродакшн и предметная фотосъёмка | DC Production", description: "Выездная студия: рекламные ролики, Reels, фото товаров, 3D и VFX. Сценарий, съёмка, монтаж и цветокоррекция, готово к публикации." },
    "marketing-strategy": { title: "Маркетинговая стратегия и воронка продаж | DC Production", description: "Разбираем ваш бизнес и клиентов, строим план выхода на рынок и воронку, в которой не теряется ни одна заявка, от первой рекламы до сделки." },
    "website-development": { title: "Разработка сайтов и лендингов | DC Production", description: "Быстрые сайты и лендинги, которые превращают посетителей в заявки. Пиксель, аналитика, CRM и WhatsApp подключены с первого дня." },
    "automation": { title: "Чат-боты для WhatsApp и автоматизация бизнеса | DC Production", description: "Боты для WhatsApp, Instagram и Facebook отвечают за секунды, квалифицируют заявки и передают их в CRM 24/7. Ни одна заявка не теряется." },
    "geo-ai-seo": { title: "GEO: чтобы ChatGPT и ИИ-поиск рекомендовали вас | DC Production", description: "Оптимизация под генеративный поиск: готовим ваш бизнес к тому, чтобы его называли ChatGPT, Perplexity и обзоры Google с ИИ." },
  },
};

const he: SeoSet = {
  home: {
    title: "DC Production — סוכנות פרסום ושיווק דיגיטלי | לידים תוך 48 שעות",
    description: "DC Production (Dream Chase Production) — שיווק דיגיטלי מקצה לקצה: פרסום בפייסבוק, באינסטגרם ובגוגל, SEO, וידאו, אתרים וצ'אטבוטים. לידים ראשונים תוך 48 שעות.",
  },
  servicesIndex: {
    title: "שירותי שיווק דיגיטלי | DC Production",
    description: "פרסום בפייסבוק, באינסטגרם ובגוגל, SEO, רשתות חברתיות, צילום ווידאו, אתרים, צ'אטבוטים ואוטומציית מכירות. צוות אחד מהאסטרטגיה ועד הלקוחות.",
  },
  about: {
    title: "על DC Production — שיווק ומכירות מקצה לקצה",
    description: "DC Production התחילה כצוות הפקת וידאו והפכה לסטודיו מלא: מביאים לקוחות, עוזרים לטפל בלידים ובונים מערכת מכירות שעובדת בלעדיכם.",
  },
  portfolio: {
    title: "העבודות שלנו: פרויקטים, תוצאות פרסום ואתרים | DC Production",
    description: "פרויקטים, מספרים אמיתיים מחשבונות הפרסום שלנו ואתרים שבנינו. ראו מה DC Production עושה לעסקים.",
  },
  testimonials: {
    title: "המלצות לקוחות | DC Production",
    description: "מה הלקוחות אומרים על העבודה עם DC Production: פרסום, וידאו, רשתות חברתיות ומשפכי מכירה.",
  },
  services: {
    "seo": { title: "קידום אתרים אורגני (SEO) בגוגל | DC Production", description: "בדיקה טכנית, אופטימיזציה לעמודים, מחקר מילות מפתח ובניית קישורים. לקוחות מוצאים אתכם בחיפוש של גוגל, בלי לשלם על כל קליק." },
    "targeted-advertising": { title: "פרסום ממומן בפייסבוק ובאינסטגרם | DC Production", description: "פרסום ב-Meta וב-TikTok למי שצריך את המוצר שלכם: קהלים, קריאייטיב, השקה, רימרקטינג ואופטימיזציה שבועית. לידים מהימים הראשונים." },
    "smm": { title: "ניהול רשתות חברתיות לעסקים | DC Production", description: "תוכנית תוכן, פוסטים, סטוריז ורילס, ניהול תגובות ודוח חודשי. אינסטגרם, פייסבוק וטיקטוק שמביאים לקוחות." },
    "google-ads": { title: "פרסום בגוגל (Google Ads): חיפוש, יוטיוב ורימרקטינג | DC Production", description: "קמפיינים בגוגל שבנויים ללידים: מחקר מילות מפתח ומילים שליליות, מבנה ברור, מעקב המרות ואופטימיזציה של התקציב." },
    "photo-video": { title: "הפקת וידאו וצילומי מוצר | DC Production", description: "סטודיו נייד שמגיע אליכם: סרטוני פרסום, רילס, צילומי מוצר, תלת-ממד ו-VFX. תסריט, צילום, עריכה ותיקון צבע, מוכן לפרסום." },
    "marketing-strategy": { title: "אסטרטגיה שיווקית ומשפך מכירות | DC Production", description: "מנתחים את העסק והלקוחות, בונים תוכנית יציאה לשוק ומשפך שבו אף ליד לא הולך לאיבוד, מהמודעה הראשונה ועד העסקה." },
    "website-development": { title: "בניית אתרים ודפי נחיתה | DC Production", description: "אתרים ודפי נחיתה מהירים שהופכים מבקרים ללידים, עם פיקסל, אנליטיקס, CRM ווואטסאפ מחוברים מהיום הראשון." },
    "automation": { title: "צ'אטבוטים לוואטסאפ ואוטומציה לעסקים | DC Production", description: "בוטים לוואטסאפ, לאינסטגרם ולפייסבוק שעונים תוך שניות, מסננים לידים ומעבירים אותם ל-CRM, 24/7. אף ליד לא הולך לאיבוד." },
    "geo-ai-seo": { title: "GEO: שה-ChatGPT וחיפוש ה-AI ימליצו עליכם | DC Production", description: "אופטימיזציה לחיפוש גנרטיבי: מכינים את העסק להופיע בתשובות של ChatGPT, Perplexity וסקירות ה-AI של גוגל." },
  },
};

const ar: SeoSet = {
  home: {
    title: "DC Production — تسويق رقمي وإعلانات ممولة | طلبات خلال 48 ساعة",
    description: "DC Production (Dream Chase Production) وكالة تسويق رقمي متكاملة: إعلانات فيسبوك وإنستغرام وجوجل، SEO، فيديو، مواقع وروبوتات محادثة. أول الطلبات خلال 48 ساعة.",
  },
  servicesIndex: {
    title: "خدمات التسويق الرقمي | DC Production",
    description: "إعلانات فيسبوك وإنستغرام وجوجل، SEO، إدارة السوشيال ميديا، تصوير وفيديو، مواقع، روبوتات محادثة وأتمتة المبيعات. فريق واحد من الاستراتيجية حتى الزبائن.",
  },
  about: {
    title: "عن DC Production — تسويق ومبيعات متكاملة",
    description: "بدأت DC Production كفريق إنتاج فيديو وأصبحت استوديو متكاملاً: نجلب الزبائن، نساعد في متابعة الطلبات ونبني نظام مبيعات يعمل من دونك.",
  },
  portfolio: {
    title: "أعمالنا: مشاريع ونتائج إعلانات ومواقع | DC Production",
    description: "مشاريع، أرقام حقيقية من حساباتنا الإعلانية ومواقع بنيناها. شاهد ما تقدّمه DC Production للأعمال.",
  },
  testimonials: {
    title: "آراء العملاء | DC Production",
    description: "ماذا يقول العملاء عن العمل مع DC Production: إعلانات، فيديو، سوشيال ميديا ومسارات بيع كاملة.",
  },
  services: {
    "seo": { title: "تحسين محركات البحث SEO والظهور في جوجل | DC Production", description: "تدقيق تقني، تحسين الصفحات، بحث الكلمات المفتاحية وبناء الروابط. زبائن يجدونك في بحث جوجل الطبيعي دون أن تدفع على كل نقرة." },
    "targeted-advertising": { title: "إعلانات ممولة على فيسبوك وإنستغرام | DC Production", description: "إعلانات Meta و TikTok تصل لمن يحتاج منتجك: دراسة الجمهور، تصاميم، إطلاق، إعادة استهداف وتحسين أسبوعي. طلبات من الأيام الأولى." },
    "smm": { title: "إدارة السوشيال ميديا للأعمال | DC Production", description: "خطة محتوى، منشورات وستوري وريلز، إدارة التعليقات وتقرير شهري. إنستغرام وفيسبوك وتيك توك تجلب لك زبائن." },
    "google-ads": { title: "إعلانات جوجل Google Ads: بحث ويوتيوب وإعادة استهداف | DC Production", description: "حملات جوجل مبنية لجلب الطلبات: بحث الكلمات المفتاحية والسلبية، هيكل واضح، تتبّع التحويلات وتحسين الميزانية." },
    "photo-video": { title: "إنتاج فيديو وتصوير منتجات | DC Production", description: "استوديو متنقل يأتي إليك: فيديوهات إعلانية، ريلز، صور منتجات، 3D ومؤثرات بصرية. سيناريو وتصوير ومونتاج وألوان، جاهز للنشر." },
    "marketing-strategy": { title: "استراتيجية تسويق ومسار مبيعات | DC Production", description: "ندرس عملك وزبائنك، ثم نبني خطة دخول إلى السوق ومسار بيع لا يضيع فيه أي طلب، من أول إعلان حتى الصفقة." },
    "website-development": { title: "تصميم وتطوير مواقع وصفحات هبوط | DC Production", description: "مواقع وصفحات هبوط سريعة تحوّل الزوار إلى طلبات، مع البكسل والتحليلات و CRM وواتساب متصلة من اليوم الأول." },
    "automation": { title: "روبوتات محادثة لواتساب وأتمتة الأعمال | DC Production", description: "روبوتات لواتساب وإنستغرام وفيسبوك ترد خلال ثوانٍ، تفرز الطلبات وترسلها إلى CRM على مدار الساعة. لا يضيع أي طلب." },
    "geo-ai-seo": { title: "GEO: اجعل ChatGPT والبحث بالذكاء الاصطناعي يوصي بك | DC Production", description: "تحسين للبحث التوليدي: نهيّئ عملك للظهور في إجابات ChatGPT و Perplexity وملخصات جوجل بالذكاء الاصطناعي." },
  },
};

const es: SeoSet = {
  home: {
    title: "DC Production — Agencia de marketing digital y publicidad",
    description: "DC Production (Dream Chase Production): marketing digital integral. Anuncios en Meta, TikTok y Google, SEO, vídeo, webs y chatbots. Clientes en 48 horas.",
  },
  servicesIndex: {
    title: "Servicios de marketing digital | DC Production",
    description: "SEO, publicidad en Meta, TikTok y Google, redes sociales, foto y vídeo, webs, chatbots y GEO. Un solo equipo, de la estrategia a los clientes.",
  },
  about: {
    title: "Sobre DC Production — marketing y ventas llave en mano",
    description: "DC Production pasó de la producción de vídeo a un estudio integral: traemos clientes, gestionamos los leads y montamos un sistema de ventas que funciona sin ti.",
  },
  portfolio: {
    title: "Trabajos: casos, resultados publicitarios y webs | DC Production",
    description: "Casos reales, cifras de nuestras cuentas publicitarias y webs que hemos creado. Mira lo que DC Production hace por negocios como el tuyo.",
  },
  testimonials: {
    title: "Opiniones de clientes | DC Production",
    description: "Lo que dicen los clientes de DC Production: publicidad, vídeo, redes sociales y embudos de venta completos.",
  },
  services: {
    "seo": { title: "Agencia SEO en España: posicionamiento en Google | DC Production", description: "Posicionamiento SEO en España: auditoría técnica, SEO on-page, palabras clave y link building para crecer en Google sin pagar por cada clic." },
    "targeted-advertising": { title: "Publicidad en Facebook, Instagram y TikTok | DC Production", description: "Anuncios en Meta y TikTok para empresas en España: audiencias, creativos, lanzamiento, retargeting y optimización semanal. Clientes desde el primer día." },
    "smm": { title: "Gestión de redes sociales para empresas | DC Production", description: "Gestión de Instagram, Facebook y TikTok: plan de contenidos, posts, stories y Reels, comunidad e informe mensual. Redes que traen clientes." },
    "google-ads": { title: "Agencia de Google Ads en España | DC Production", description: "Campañas de Google Ads para empresas en España: Search, Shopping y YouTube, palabras negativas, seguimiento de conversiones y presupuesto optimizado." },
    "photo-video": { title: "Producción de vídeo y fotografía de producto | DC Production", description: "Estudio móvil de foto y vídeo: anuncios, Reels, fotografía de producto, 3D y VFX. Guion, rodaje, edición y color, listo para publicar." },
    "marketing-strategy": { title: "Estrategia de marketing y embudos de venta | DC Production", description: "Analizamos tu negocio y tus clientes, y construimos el plan de salida al mercado y un embudo en el que no se pierde ningún lead." },
    "website-development": { title: "Diseño web y landing pages para empresas | DC Production", description: "Webs y landing pages rápidas, pensadas para móvil, que convierten visitas en clientes. Pixel, GA4, CRM y WhatsApp conectados desde el primer día." },
    "automation": { title: "Chatbots para WhatsApp y automatización | DC Production", description: "Bots para WhatsApp, Instagram y Facebook que responden en segundos, filtran leads y los envían a tu CRM las 24 horas. Ningún cliente se pierde." },
    "geo-ai-seo": { title: "GEO: aparece en ChatGPT y búsquedas con IA | DC Production", description: "Optimización GEO para que tu negocio aparezca en las respuestas de ChatGPT, Perplexity y Google AI Overviews." },
  },
};

const SETS: Record<string, SeoSet> = { en, ru, he, ar, es };

type Tree = Record<string, Record<string, unknown>>;
const put = (obj: Record<string, unknown> | undefined, m: Meta) => { if (obj) obj.meta = { ...(obj.meta as object), ...m }; };

/** Writes the metas into a message tree, and drops the old price list that no page shows any more. */
export function applySeo(messages: Tree, locale: string): Tree {
  const s = SETS[locale];
  if (s) {
    put(messages.Home, s.home);
    put(messages.ServicesIndex, s.servicesIndex);
    put(messages.About, s.about);
    put(messages.Portfolio, s.portfolio);
    put(messages.Testimonials, s.testimonials);
    const svc = messages.Services as Record<string, Record<string, unknown>> | undefined;
    if (svc) for (const [slug, m] of Object.entries(s.services)) put(svc[slug], m);
  }
  // The old package list (with prices) is no longer rendered anywhere; drop it so it
  // is not serialized into the page for Google to pick up.
  if (messages.Home) delete messages.Home.pricing;
  return messages;
}
