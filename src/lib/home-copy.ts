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
  heroMetaR: "Your customers are waiting",
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
  heroMetaR: "Клиенты уже вас ждут",
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
  heroMetaR: "הלקוחות כבר מחכים לכם",
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
    { name: "ניתוח תוצאות", desc: "סופרים כל ליד: כמה הוא עלה, מאיפה הגיע ואיזו מודעה עובדת הכי טוב. אתם רואים לאן הולך הכסף ומה הוא מחזיר" },
    { name: "ליווי שוטף", desc: "משפרים את הפרסום כל שבוע, שולחים דוח ברור כל חודש ומייעלים את השגרה עם צ'אטבוטים ואוטומציות" },
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

const es: HomeCopy = {
  heroMetaL: "Clientes para tu negocio sin dolores de cabeza, desde los primeros días de campaña",
  heroMetaR: "Tus clientes te esperan",
  heroLanes: ["Agencia de publicidad", "Producción de vídeo", "Leads en 24 horas"],
  heroDesc: "Nos encargamos de todo: estrategia, sesiones de foto y vídeo, lanzamiento de anuncios llave en mano, redes sociales, chatbots y automatización de ventas. Tú recibes un flujo constante de clientes y sabes cuánto te cuesta cada uno",
  heroRail: ["Publicidad llave en mano", "Redes sociales", "Foto y vídeo", "Chatbots", "Automatización de ventas", "Publicidad", "Producción de vídeo"],
  feats: [
    { t: "Errores", s: "frecuentes", d: "Los errores que casi todos los negocios cometen en 2026 y en los que queman su presupuesto" },
    { t: "Solo publicidad", s: "no basta", d: "Por qué en 2026 los anuncios por sí solos no se pagan, y qué más hace falta" },
    { t: "Resultados", s: "garantizados", d: "Garantizamos resultados en las primeras 48 horas tras el lanzamiento" },
  ],
  heroWatch: "Ver el vídeo",
  heroScroll: "Desliza",
  popVideoEyebrow: "Showreel · 60 s",
  popVideoTitle: "Mira cómo trabajamos en un minuto",
  popVideoBtn: "Ver el vídeo",
  popLeadEyebrow: "Consulta gratuita",
  popLeadTitle: "Veamos dónde se pierden tus clientes",
  popLeadText: "Cuéntanos sobre tu negocio. Te respondemos en un día laborable con un plan claro",
  close: "Cerrar",
  steps: [
    { name: "Estrategia", desc: "Analizamos a fondo tu negocio y tu competencia: el producto, su precio y cómo encaja en el mercado" },
    { name: "Idea", desc: "Con todo lo que nos cuentas y nuestra propia investigación, el equipo crea contenido pensado para traer clientes, no solo alcance" },
    { name: "Producción", desc: "Nos ocupamos de todo: guiones, días de rodaje, edición, diseño y cada visual hasta el lanzamiento" },
    { name: "Rodaje", desc: "Rodamos con equipo profesional para que tu marca se vea premium y genere confianza desde el primer plano" },
    { name: "Publicidad", desc: "Cada negocio tiene su enfoque: de anuncios en Facebook e Instagram a Google Ads, SEO y GEO" },
    { name: "Análisis", desc: "Seguimos cada lead: cuánto costó, de dónde vino y qué anuncio funciona mejor. Ves a dónde va el dinero y qué te devuelve" },
    { name: "Acompañamiento", desc: "Mejoramos tus anuncios cada semana, enviamos un informe claro cada mes y automatizamos la rutina con chatbots" },
  ],
  results: [
    { value: "48", label: "horas hasta los primeros leads de calidad tras lanzar la publicidad. Garantizado" },
    { value: "×2", label: "menos coste por lead cuando rehacemos tus anuncios" },
    { value: "7", label: "días desde la firma hasta la primera campaña activa" },
    { value: "+100", label: "clientes nuevos en el primer mes trabajando con nosotros" },
  ],
  bentoStatement: ["No solo hacemos contenido", "Construimos sistemas"],
  bentoStatementCta: "Empezar un proyecto",
  bentoCtaTitle: "Reserva una consulta gratuita",
  bentoCtaText: "Revisamos tus anuncios y tu contenido y te mostramos dónde se escapan los clientes",
  bentoCtaBtn: "Contactar",
  workKicker: "Caso de éxito",
  workOpen: "Ver caso",
  wallLabel: "Nuestros clientes",
  ribbonWords: ["Resultados", "publicitarios"],
  ribbonNote: "Cifras reales de nuestras cuentas publicitarias",
};

const ar: HomeCopy = {
  heroMetaL: "زبائن لعملك بلا وجع رأس، من الأيام الأولى بعد إطلاق الإعلانات",
  heroMetaR: "زبائنك بانتظارك",
  heroLanes: ["وكالة إعلانات", "إنتاج فيديو", "طلبات خلال 24 ساعة"],
  heroDesc: "نتولى كل شيء: الاستراتيجية، تصوير الصور والفيديو، إطلاق الإعلانات من الألف إلى الياء، السوشيال ميديا، روبوتات المحادثة وأتمتة المبيعات. تحصل على تدفق ثابت من الطلبات وتكلفة واضحة لكل زبون",
  heroRail: ["إطلاق إعلانات متكامل", "سوشيال ميديا", "تصوير صور وفيديو", "روبوتات محادثة", "أتمتة المبيعات", "إعلانات", "إنتاج فيديو"],
  feats: [
    { t: "الأخطاء", s: "الشائعة", d: "الأخطاء التي يقع فيها كل عمل تقريباً في 2026 ويحرق عليها ميزانيته" },
    { t: "الإعلان وحده", s: "لا يكفي", d: "لماذا لا تكفي الإعلانات وحدها في 2026 لتربح، وما الذي تحتاجه أيضاً" },
    { t: "نتائج", s: "مضمونة", d: "الشركة الوحيدة في البلاد التي تضمن النتائج خلال 48 ساعة من الإطلاق" },
  ],
  heroWatch: "شاهد الفيلم",
  heroScroll: "مرّر",
  popVideoEyebrow: "فيلم تعريفي · 60 ثانية",
  popVideoTitle: "شاهد كيف نعمل في دقيقة واحدة",
  popVideoBtn: "شاهد الفيلم",
  popLeadEyebrow: "استشارة مجانية",
  popLeadTitle: "لنكتشف أين تضيع طلباتك",
  popLeadText: "أخبرنا عن عملك، وسنرد خلال يوم عمل واحد بخطة واضحة",
  close: "إغلاق",
  steps: [
    { name: "الاستراتيجية", desc: "نحلل عملك ومنافسيك بعمق: المنتج، سعره ومدى ملاءمته للسوق" },
    { name: "الفكرة", desc: "من كل ما تشاركه معنا ومن بحثنا الخاص، يبتكر الفريق محتوى يجلب طلبات جادة، لا مجرد وصول" },
    { name: "الإنتاج", desc: "نتولى كل شيء: السيناريو، أيام التصوير، المونتاج، التصميم وكل عنصر بصري حتى الإطلاق" },
    { name: "التصوير", desc: "نصوّر بمعدات احترافية، فتبدو علامتك فاخرة وتكسب الثقة من اللقطة الأولى" },
    { name: "الإعلانات", desc: "لكل عمل نهجه الخاص: من الإعلانات الموجّهة على فيسبوك وإنستغرام إلى إعلانات جوجل و SEO و GEO" },
    { name: "تحليل النتائج", desc: "نتتبّع كل طلب: كم كلّف، من أين جاء وأي إعلان يعمل أفضل. ترى أين تذهب أموالك وماذا تعيد لك" },
    { name: "المتابعة", desc: "نحسّن إعلاناتك كل أسبوع، نرسل تقريراً واضحاً كل شهر ونؤتمت الروتين بروبوتات محادثة ومسارات ذكية" },
  ],
  results: [
    { value: "48", label: "ساعة حتى أول طلبات جادة بعد إطلاق الإعلانات. مضمون" },
    { value: "×2", label: "تكلفة أقل للطلب بعد أن نعيد بناء إعلاناتك" },
    { value: "7", label: "أيام من التوقيع حتى إطلاق أول حملة" },
    { value: "+100", label: "زبون جديد في الشهر الأول من العمل معنا" },
  ],
  bentoStatement: ["نحن لا نصنع محتوى فقط", "نحن نبني أنظمة"],
  bentoStatementCta: "ابدأ مشروعاً",
  bentoCtaTitle: "احجز استشارة مجانية",
  bentoCtaText: "نراجع إعلاناتك ومحتواك ونريك أين تضيع الطلبات",
  bentoCtaBtn: "تواصل معنا",
  workKicker: "دراسة حالة",
  workOpen: "افتح المشروع",
  wallLabel: "عملاؤنا",
  ribbonWords: ["نتائج", "الإعلانات"],
  ribbonNote: "أرقام حقيقية من حساباتنا الإعلانية",
};

const COPY: Record<string, HomeCopy> = { en, ru, he, es, ar };
export const homeCopy = (locale: string): HomeCopy => COPY[locale] ?? en;

/** Headings and short labels read cleaner without a closing full stop. */
export const noDot = (s: string) => s.replace(/[.。]+\s*$/u, "");

/* ── Home flow v3: solution, services, numbers, work formats, pain ── */
export type HomeFlow = {
  solLabel: string; solHeading: string; solEm: string;
  solItems: { title: string; text: string }[];
  svcLabel: string; svcHeading: string; svcEm: string; svcAll: string;
  svcItems: { title: string; tag: string; text: string }[];
  resLabel: string; resHeading: string; resEm: string;
  fmtLabel: string; fmtHeading: string; fmtEm: string; fmtBtn: string; fmtPopular: string; fmtNote: string;
  fmtItems: { name: string; tag: string; lead: string; rows: string[] }[];
  painEyebrow: string; painLine: string; painEm: string; painText: string; painBtn: string;
};

const flowRu: HomeFlow = {
  solLabel: "Решение",
  solHeading: "Как мы превращаем рекламу",
  solEm: "в клиентов",
  solItems: [
    { title: "Приводим тех, кто готов купить", text: "Настраиваем рекламу в Facebook, Instagram и Google на людей, которым ваш продукт нужен сейчас, а не на случайные клики" },
    { title: "Упаковываем так, что хочется купить", text: "Видео, фото, дизайн и сайт показывают ценность с первого экрана и снимают сомнения ещё до звонка" },
    { title: "Доводим заявку до сделки", text: "Боты отвечают клиентам за секунды, ни одна заявка не теряется, а мы помогаем вашим продажам закрывать сделки" },
  ],
  svcLabel: "Услуги",
  svcHeading: "Закрываем весь путь клиента",
  svcEm: "от рекламы до продажи",
  svcAll: "Все услуги",
  svcItems: [
    { title: "Реклама и продвижение", tag: "Привлечение", text: "Таргетированная реклама в Facebook и Instagram, Google Ads, SEO, GEO и органическое продвижение. Находим клиентов везде, где они ищут то, что вы продаёте" },
    { title: "Контент, дизайн и сайты", tag: "Упаковка", text: "Снимаем видео и фото, делаем посты, дизайн и сайты, которые продают. Ваш бизнес выглядит сильнее конкурентов с первого взгляда" },
    { title: "Автоматизация и продажи", tag: "Сделки", text: "Чат-боты отвечают клиентам 24/7, процессы и CRM работают сами. Помогаем с продажами и подбираем людей в отдел продаж, чтобы заявки становились деньгами" },
  ],
  resLabel: "Результаты",
  resHeading: "Цифры",
  resEm: "из нашего опыта",
  fmtLabel: "Формат работы",
  fmtHeading: "Подберём формат",
  fmtEm: "под ваш бизнес",
  fmtBtn: "Обсудить этот формат",
  fmtPopular: "Чаще выбирают",
  fmtNote: "Стоимость считаем под ваши задачи после бесплатного аудита",
  fmtItems: [
    { name: "Поток заявок", tag: "Быстрый старт", lead: "Когда клиенты нужны уже сейчас", rows: ["Запуск рекламы в Facebook и Instagram", "Лендинг для сбора заявок", "Чат-бот, который сразу отвечает клиентам", "Рекламные креативы каждый месяц", "Понятный отчёт по заявкам"] },
    { name: "Рост бренда", tag: "Рост", lead: "Стабильный поток клиентов и сильный бренд", rows: ["Полноценный сайт", "Реклама в соцсетях и Google", "Регулярные ролики и фотосъёмки", "Органическое продвижение в Instagram, Facebook и TikTok", "Автоматизация процессов"] },
    { name: "Бизнес на автопилоте", tag: "Под ключ", lead: "Система, которая продаёт вместо вас", rows: ["Сайт под ваш продукт со всеми интеграциями", "Бот-продавец в WhatsApp: ведёт переписку и закрывает продажи", "Телефония, боты и CRM в одной системе", "Автоматизация всего процесса продаж", "Реклама и постоянный поток клиентов в систему"] },
  ],
  painEyebrow: "Каждый день на счету",
  painLine: "Пока вы ждёте,",
  painEm: "клиенты покупают у конкурентов",
  painText: "Бюджет на рекламу уходит, заявки теряются в переписках, а вы тратите время на то, что давно можно автоматизировать. Покажем, где именно вы теряете деньги, бесплатно",
  painBtn: "Получить бесплатный аудит",
};

const flowEn: HomeFlow = {
  solLabel: "Solution",
  solHeading: "How we turn ads",
  solEm: "into customers",
  solItems: [
    { title: "We bring people ready to buy", text: "We target ads on Facebook, Instagram and Google at people who need your product now, not at random clicks" },
    { title: "We package you so they want to buy", text: "Video, photo, design and a website that show your value from the first screen and remove doubts before the first call" },
    { title: "We take the lead all the way to a sale", text: "Bots answer customers in seconds, no lead gets lost, and we help your sales team close the deals" },
  ],
  svcLabel: "Services",
  svcHeading: "We cover the whole customer journey",
  svcEm: "from ad to sale",
  svcAll: "All services",
  svcItems: [
    { title: "Ads and promotion", tag: "Acquisition", text: "Targeted ads on Facebook and Instagram, Google Ads, SEO, GEO and organic growth. We find customers wherever they look for what you sell" },
    { title: "Content, design and websites", tag: "Packaging", text: "We shoot video and photo, make posts, design and websites that sell. Your business looks stronger than competitors at first glance" },
    { title: "Automation and sales", tag: "Deals", text: "Chatbots answer customers 24/7, processes and CRM run on their own. We help with sales and hire people for your sales team, so leads turn into money" },
  ],
  resLabel: "Results",
  resHeading: "Numbers",
  resEm: "from our experience",
  fmtLabel: "How we work",
  fmtHeading: "We'll match the format",
  fmtEm: "to your business",
  fmtBtn: "Discuss this format",
  fmtPopular: "Most chosen",
  fmtNote: "We price it around your goals after a free audit",
  fmtItems: [
    { name: "Lead flow", tag: "Quick start", lead: "When you need customers right now", rows: ["Ads on Facebook and Instagram", "Landing page that collects leads", "Chatbot that answers customers instantly", "Fresh ad creatives every month", "Clear report on your leads"] },
    { name: "Brand growth", tag: "Growth", lead: "A steady flow of customers and a strong brand", rows: ["Full website", "Ads on social media and Google", "Regular videos and photo shoots", "Organic growth on Instagram, Facebook and TikTok", "Process automation"] },
    { name: "Business on autopilot", tag: "Turnkey", lead: "A system that sells for you", rows: ["Website built around your product with every integration", "WhatsApp sales bot that chats and closes deals", "Phone line, bots and CRM in one system", "Your whole sales process automated", "Ads and a steady flow of customers into the system"] },
  ],
  painEyebrow: "Every day counts",
  painLine: "While you wait,",
  painEm: "customers buy from competitors",
  painText: "Ad budget drains away, leads get lost in chats, and you spend time on work that could run itself. We'll show you exactly where you're losing money, free",
  painBtn: "Get a free audit",
};

const flowHe: HomeFlow = {
  solLabel: "הפתרון",
  solHeading: "איך אנחנו הופכים פרסום",
  solEm: "ללקוחות",
  solItems: [
    { title: "מביאים את מי שמוכן לקנות", text: "מכוונים את הפרסום בפייסבוק, באינסטגרם ובגוגל לאנשים שצריכים את המוצר שלכם עכשיו, ולא לקליקים מקריים" },
    { title: "אורזים אתכם כך שבא לקנות", text: "וידאו, צילום, עיצוב ואתר שמראים את הערך מהמסך הראשון ומורידים התלבטויות עוד לפני השיחה" },
    { title: "מביאים את הליד עד לעסקה", text: "בוטים עונים ללקוחות תוך שניות, אף ליד לא הולך לאיבוד, ואנחנו עוזרים לצוות המכירות שלכם לסגור עסקאות" },
  ],
  svcLabel: "שירותים",
  svcHeading: "מכסים את כל הדרך של הלקוח",
  svcEm: "מהמודעה ועד המכירה",
  svcAll: "כל השירותים",
  svcItems: [
    { title: "פרסום וקידום", tag: "גיוס לקוחות", text: "פרסום ממומן בפייסבוק ובאינסטגרם, Google Ads, SEO, GEO וקידום אורגני. מוצאים לקוחות בכל מקום שבו הם מחפשים את מה שאתם מוכרים" },
    { title: "תוכן, עיצוב ואתרים", tag: "מיתוג", text: "מצלמים וידאו וסטילס, יוצרים פוסטים, עיצוב ואתרים שמוכרים. העסק שלכם נראה חזק יותר מהמתחרים כבר במבט ראשון" },
    { title: "אוטומציה ומכירות", tag: "עסקאות", text: "צ'אטבוטים עונים ללקוחות 24/7, התהליכים וה-CRM עובדים לבד. עוזרים במכירות ומגייסים אנשים לצוות המכירות, כדי שלידים יהפכו לכסף" },
  ],
  resLabel: "תוצאות",
  resHeading: "מספרים",
  resEm: "מהניסיון שלנו",
  fmtLabel: "פורמט עבודה",
  fmtHeading: "נתאים את הפורמט",
  fmtEm: "לעסק שלכם",
  fmtBtn: "לדבר על הפורמט הזה",
  fmtPopular: "הכי נבחר",
  fmtNote: "את המחיר מתאימים למשימות שלכם אחרי אודיט חינם",
  fmtItems: [
    { name: "זרם לידים", tag: "התחלה מהירה", lead: "כשצריך לקוחות כבר עכשיו", rows: ["השקת פרסום בפייסבוק ובאינסטגרם", "דף נחיתה לאיסוף לידים", "צ'אטבוט שעונה ללקוחות מיד", "קריאייטיבים חדשים כל חודש", "דוח ברור על הלידים"] },
    { name: "צמיחת המותג", tag: "צמיחה", lead: "זרם יציב של לקוחות ומותג חזק", rows: ["אתר מלא", "פרסום ברשתות ובגוגל", "סרטונים וצילומים באופן קבוע", "קידום אורגני באינסטגרם, בפייסבוק ובטיקטוק", "אוטומציה של תהליכים"] },
    { name: "עסק על טייס אוטומטי", tag: "מקצה לקצה", lead: "מערכת שמוכרת במקומכם", rows: ["אתר למוצר שלכם עם כל האינטגרציות", "בוט מכירות בוואטסאפ שמנהל שיחות וסוגר עסקאות", "טלפוניה, בוטים ו-CRM במערכת אחת", "אוטומציה של כל תהליך המכירה", "פרסום וזרם קבוע של לקוחות למערכת"] },
  ],
  painEyebrow: "כל יום חשוב",
  painLine: "בזמן שאתם מחכים,",
  painEm: "הלקוחות קונים אצל המתחרים",
  painText: "תקציב הפרסום נשרף, לידים הולכים לאיבוד בשיחות, ואתם מבזבזים זמן על מה שאפשר מזמן לעשות אוטומטית. נראה לכם בדיוק איפה אתם מפסידים כסף, בחינם",
  painBtn: "לאודיט חינם",
};

const flowEs: HomeFlow = {
  solLabel: "Solución",
  solHeading: "Cómo convertimos la publicidad",
  solEm: "en clientes",
  solItems: [
    { title: "Traemos a gente lista para comprar", text: "Dirigimos los anuncios de Facebook, Instagram y Google a quien necesita tu producto ahora, no a clics al azar" },
    { title: "Te presentamos para que quieran comprarte", text: "Vídeo, foto, diseño y una web que muestran tu valor desde la primera pantalla y quitan dudas antes de la primera llamada" },
    { title: "Llevamos el lead hasta la venta", text: "Los bots responden en segundos, ningún lead se pierde y ayudamos a tu equipo comercial a cerrar" },
  ],
  svcLabel: "Servicios",
  svcHeading: "Cubrimos todo el camino del cliente",
  svcEm: "del anuncio a la venta",
  svcAll: "Todos los servicios",
  svcItems: [
    { title: "Publicidad y promoción", tag: "Captación", text: "Anuncios en Facebook e Instagram, Google Ads, SEO, GEO y crecimiento orgánico. Encontramos clientes allí donde buscan lo que vendes" },
    { title: "Contenido, diseño y webs", tag: "Imagen", text: "Rodamos vídeo y foto, creamos posts, diseño y webs que venden. Tu negocio parece más fuerte que la competencia a primera vista" },
    { title: "Automatización y ventas", tag: "Cierres", text: "Los chatbots atienden 24/7, los procesos y el CRM funcionan solos. Te ayudamos con las ventas y a contratar comerciales, para que los leads se conviertan en dinero" },
  ],
  resLabel: "Resultados",
  resHeading: "Cifras",
  resEm: "de nuestra experiencia",
  fmtLabel: "Cómo trabajamos",
  fmtHeading: "Elegimos el formato",
  fmtEm: "para tu negocio",
  fmtBtn: "Hablar de este formato",
  fmtPopular: "El más elegido",
  fmtNote: "El precio se calcula según tus objetivos tras una auditoría gratuita",
  fmtItems: [
    { name: "Flujo de clientes", tag: "Arranque rápido", lead: "Cuando necesitas clientes ya", rows: ["Anuncios en Facebook e Instagram", "Landing que capta solicitudes", "Chatbot que responde al instante", "Creativos nuevos cada mes", "Informe claro de tus leads"] },
    { name: "Crecimiento de marca", tag: "Crecimiento", lead: "Clientes constantes y una marca fuerte", rows: ["Web completa", "Anuncios en redes y Google", "Vídeos y sesiones de fotos regulares", "Crecimiento orgánico en Instagram, Facebook y TikTok", "Automatización de procesos"] },
    { name: "Negocio en piloto automático", tag: "Llave en mano", lead: "Un sistema que vende por ti", rows: ["Web hecha para tu producto con todas las integraciones", "Bot de ventas en WhatsApp que conversa y cierra", "Telefonía, bots y CRM en un solo sistema", "Todo tu proceso de ventas automatizado", "Publicidad y clientes entrando al sistema"] },
  ],
  painEyebrow: "Cada día cuenta",
  painLine: "Mientras esperas,",
  painEm: "tus clientes compran a la competencia",
  painText: "El presupuesto se va, los leads se pierden en los chats y dedicas tiempo a tareas que podrían hacerse solas. Te mostramos gratis dónde estás perdiendo dinero",
  painBtn: "Auditoría gratuita",
};

const flowAr: HomeFlow = {
  solLabel: "الحل",
  solHeading: "كيف نحوّل الإعلانات",
  solEm: "إلى زبائن",
  solItems: [
    { title: "نجلب من هو جاهز للشراء", text: "نوجّه الإعلانات على فيسبوك وإنستغرام وجوجل لمن يحتاج منتجك الآن، لا لنقرات عشوائية" },
    { title: "نقدّمك بشكل يجعلهم يريدون الشراء", text: "فيديو وصور وتصميم وموقع تُظهر قيمتك من الشاشة الأولى وتزيل الشكوك قبل أول مكالمة" },
    { title: "نوصل الطلب حتى البيع", text: "الروبوتات ترد على الزبائن خلال ثوانٍ، لا يضيع أي طلب، ونساعد فريق مبيعاتك على إغلاق الصفقات" },
  ],
  svcLabel: "الخدمات",
  svcHeading: "نغطي رحلة الزبون كاملة",
  svcEm: "من الإعلان حتى البيع",
  svcAll: "كل الخدمات",
  svcItems: [
    { title: "إعلانات وترويج", tag: "جلب الزبائن", text: "إعلانات موجّهة على فيسبوك وإنستغرام، إعلانات جوجل، SEO، GEO ونمو طبيعي. نجد الزبائن أينما يبحثون عمّا تبيعه" },
    { title: "محتوى وتصميم ومواقع", tag: "التقديم", text: "نصوّر الفيديو والصور ونصنع المنشورات والتصاميم والمواقع التي تبيع. يبدو عملك أقوى من المنافسين من النظرة الأولى" },
    { title: "أتمتة ومبيعات", tag: "الصفقات", text: "روبوتات المحادثة ترد على الزبائن على مدار الساعة، والعمليات و CRM تعمل وحدها. نساعد في المبيعات ونوظّف أشخاصاً لفريق مبيعاتك لتتحول الطلبات إلى أموال" },
  ],
  resLabel: "النتائج",
  resHeading: "أرقام",
  resEm: "من خبرتنا",
  fmtLabel: "طريقة العمل",
  fmtHeading: "نختار الصيغة",
  fmtEm: "المناسبة لعملك",
  fmtBtn: "ناقش هذه الصيغة",
  fmtPopular: "الأكثر اختياراً",
  fmtNote: "نحدد السعر حسب أهدافك بعد تدقيق مجاني",
  fmtItems: [
    { name: "تدفق الطلبات", tag: "بداية سريعة", lead: "عندما تحتاج زبائن الآن", rows: ["إعلانات على فيسبوك وإنستغرام", "صفحة هبوط تجمع الطلبات", "روبوت محادثة يرد على الزبائن فوراً", "تصاميم إعلانية جديدة كل شهر", "تقرير واضح عن طلباتك"] },
    { name: "نمو العلامة", tag: "نمو", lead: "تدفق ثابت من الزبائن وعلامة قوية", rows: ["موقع كامل", "إعلانات على السوشيال ميديا وجوجل", "فيديوهات وجلسات تصوير منتظمة", "نمو طبيعي على إنستغرام وفيسبوك وتيك توك", "أتمتة العمليات"] },
    { name: "عمل على الطيار الآلي", tag: "متكامل", lead: "نظام يبيع عنك", rows: ["موقع مبني حول منتجك مع كل الربطات", "روبوت مبيعات على واتساب يحادث ويغلق الصفقات", "خط هاتف وروبوتات و CRM في نظام واحد", "عملية المبيعات كلها مؤتمتة", "إعلانات وتدفق ثابت من الزبائن إلى النظام"] },
  ],
  painEyebrow: "كل يوم مهم",
  painLine: "بينما تنتظر،",
  painEm: "الزبائن يشترون من المنافسين",
  painText: "ميزانية الإعلانات تتسرب، الطلبات تضيع في المحادثات، وتقضي وقتك في عمل يمكن أن يعمل وحده. سنريك بالضبط أين تخسر المال، مجاناً",
  painBtn: "احصل على تدقيق مجاني",
};

const FLOW: Record<string, HomeFlow> = { en: flowEn, ru: flowRu, he: flowHe, es: flowEs, ar: flowAr };
export const homeFlow = (locale: string): HomeFlow => FLOW[locale] ?? flowEn;

/* ── FAQ: real questions business owners ask before they start ── */
export const homeFaq = (locale: string): { q: string; a: string }[] =>
  ({
    ru: [
      { q: "Через сколько придут первые заявки?", a: "Обычно первые заявки приходят в первые 24–48 часов после запуска рекламы. Результат в первые 48 часов мы гарантируем." },
      { q: "Что входит в вашу работу?", a: "Всё, что нужно для потока клиентов: реклама в Facebook, Instagram и Google, съёмка и контент, сайт, чат-боты и помощь с продажами." },
      { q: "Как я пойму, что реклама работает?", a: "Вы видите, сколько пришло заявок и сколько стоила каждая. Раз в месяц присылаем понятный отчёт без сложных терминов." },
      { q: "Что будет с заявками, когда они придут?", a: "Чат-бот сразу отвечает клиенту, заявка попадает к вам без потерь, а мы помогаем выстроить продажи, чтобы заявки становились сделками." },
    ],
    he: [
      { q: "תוך כמה זמן יגיעו הלידים הראשונים?", a: "בדרך כלל הלידים הראשונים מגיעים תוך 24–48 שעות מהשקת הפרסום. אנחנו מבטיחים תוצאה כבר ב-48 השעות הראשונות." },
      { q: "מה כלול בעבודה שלכם?", a: "כל מה שצריך לזרם לקוחות: פרסום בפייסבוק, באינסטגרם ובגוגל, צילום ותוכן, אתר, צ'אטבוטים ועזרה במכירות." },
      { q: "איך אדע שהפרסום עובד?", a: "תראו כמה לידים הגיעו וכמה עלה כל אחד. פעם בחודש נשלח דוח ברור בלי מונחים מסובכים." },
      { q: "מה קורה עם הלידים כשהם מגיעים?", a: "צ'אטבוט עונה ללקוח מיד, הליד מגיע אליכם בלי לאבד אף אחד, ואנחנו עוזרים לבנות מכירות כדי שלידים יהפכו לעסקאות." },
    ],
    es: [
      { q: "¿Cuándo llegan los primeros leads?", a: "Normalmente en las primeras 24–48 horas tras lanzar la publicidad. Garantizamos resultados en las primeras 48 horas." },
      { q: "¿Qué incluye vuestro trabajo?", a: "Todo lo necesario para traer clientes: anuncios en Facebook, Instagram y Google, rodajes y contenido, web, chatbots y ayuda con las ventas." },
      { q: "¿Cómo sabré que la publicidad funciona?", a: "Ves cuántos leads llegaron y cuánto costó cada uno. Una vez al mes enviamos un informe claro, sin tecnicismos." },
      { q: "¿Qué pasa con los leads cuando llegan?", a: "Un chatbot responde al cliente al momento, cada lead te llega y te ayudamos a montar las ventas para que se conviertan en cierres." },
    ],
    ar: [
      { q: "متى تصل الطلبات الأولى؟", a: "عادةً خلال 24–48 ساعة من إطلاق الإعلانات. ونضمن النتائج خلال أول 48 ساعة." },
      { q: "ماذا يشمل عملكم؟", a: "كل ما يلزم لجلب الزبائن: إعلانات على فيسبوك وإنستغرام وجوجل، تصوير ومحتوى، موقع، روبوتات محادثة ومساعدة في المبيعات." },
      { q: "كيف أعرف أن الإعلانات تعمل؟", a: "ترى كم طلباً وصل وكم كلّف كل واحد. ومرة في الشهر نرسل تقريراً واضحاً بلا مصطلحات معقدة." },
      { q: "ماذا يحدث للطلبات عندما تصل؟", a: "روبوت المحادثة يرد على الزبون فوراً، كل طلب يصلك دون أن يضيع، ونساعدك في بناء المبيعات لتتحول الطلبات إلى صفقات." },
    ],
  } as Record<string, { q: string; a: string }[]>)[locale] ?? [
    { q: "How soon will the first leads come?", a: "Usually within 24–48 hours of the ads going live. We guarantee results within the first 48 hours." },
    { q: "What's included in your work?", a: "Everything it takes to bring customers: ads on Facebook, Instagram and Google, shoots and content, a website, chatbots and help with sales." },
    { q: "How will I know the ads work?", a: "You see how many leads came in and what each one cost. Once a month we send a clear report with no jargon." },
    { q: "What happens to the leads when they come in?", a: "A chatbot replies to the customer right away, every lead reaches you, and we help set up sales so leads turn into deals." },
  ];

/* ad-account screenshots (real campaigns) used in the results band and on the works page */
export const AD_RESULTS = [1, 4, 3, 9, 15, 12, 7, 14, 19, 6, 16, 20, 5, 13, 21, 10, 17, 18, 8, 2].map((n) => `/results/r${String(n).padStart(2, "0")}.webp`);
