# dc.prod — URL-архитектура и SEO-настройки

> Стек: **Next.js 16 (App Router) + next-intl**. Маршрутизация — файловая (`src/app/[locale]`).
> Канонический домен берётся из `NEXT_PUBLIC_SITE_URL` (фолбэк: `https://dcprod.agency`).

---

## 1. Мультиязычность (i18n)

Три языка через **next-intl** (`localePrefix: "as-needed"`):

| Язык | Префикс URL | `dir` | Пример |
|------|-------------|-------|--------|
| Английский (`en`) — по умолчанию | **нет** (корень) | ltr | `/services/seo` |
| Русский (`ru`) | `/ru` | ltr | `/ru/services/seo` |
| Иврит (`he`) | `/he` | **rtl** | `/he/services/seo` |

- Английский живёт в корне без префикса — это канонический язык для SEO.
- `localeDetection: false` — корень `/` всегда отдаёт английский (не зависит от `Accept-Language`).
- Конфиг: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`.
- Тексты вынесены в `messages/{en,ru,he}.json` (структурные данные остаются в компонентах).

---

## 2. URL-архитектура

### Публичные страницы (индексируемые, ×3 языка)

| Путь (en) | Файл | Назначение |
|-----------|------|-----------|
| `/` | `src/app/[locale]/page.tsx` | Главная (лендинг) |
| `/about` | `src/app/[locale]/about/page.tsx` | О студии |
| `/portfolio` | `src/app/[locale]/portfolio/page.tsx` | Портфолио |
| `/testimonials` | `src/app/[locale]/testimonials/page.tsx` | Отзывы |
| `/services/seo` | `src/app/[locale]/services/seo/page.tsx` | SEO-продвижение |
| `/services/targeted-advertising` | `.../targeted-advertising/page.tsx` | Таргетированная реклама |
| `/services/smm` | `.../smm/page.tsx` | SMM |
| `/services/google-ads` | `.../google-ads/page.tsx` | Google Ads / PPC |
| `/services/photo-video` | `.../photo-video/page.tsx` | Фото и видео |
| `/services/marketing-strategy` | `.../marketing-strategy/page.tsx` | Маркетинговая стратегия и воронки |
| `/services/website-development` | `.../website-development/page.tsx` | Разработка сайтов |
| `/services/automation` | `.../automation/page.tsx` | Автоматизация и чат-боты |
| `/services/geo-ai-seo` | `.../geo-ai-seo/page.tsx` | GEO / AI-оптимизация |

Итого **13 страниц × 3 языка = 39 индексируемых URL**.
Сервисные страницы рендерятся общим компонентом `src/components/ServicePage.tsx` (контент — из неймспейса `Services.<slug>`).

### Якоря на главной (секции, не отдельные URL)

- `/#services` — услуги · `/#packages` — тарифы · `/#lead` — форма заявки

### API и служебные эндпоинты (в корне, вне `[locale]`)

| URL | Файл | Назначение |
|-----|------|-----------|
| `/api/lead` (POST) | `src/app/api/lead/route.ts` | Приём заявки → CRM webhook + Meta CAPI |
| `/robots.txt` | `src/app/robots.ts` | Генерируется Next.js |
| `/sitemap.xml` | `src/app/sitemap.ts` | Генерируется Next.js |
| `/manifest.webmanifest` | `src/app/manifest.ts` | PWA-манифест |
| `/opengraph-image` | `src/app/opengraph-image.tsx` | OG-картинка 1200×630 |

---

## 3. robots.txt

Генерируется из `src/app/robots.ts`:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /eng/

Sitemap: https://dcprod.agency/sitemap.xml
```

- `/api/` и старый префикс `/eng/` закрыты от индексации.
- Ссылка на sitemap — из `NEXT_PUBLIC_SITE_URL`.

---

## 4. sitemap.xml

Генерируется из `src/app/sitemap.ts` — конфиг-driven (`LOCALES` × `PAGES`). Для каждого URL проставлены `hreflang`-альтернаты (`en`, `ru`, `he`, `x-default`).

| Путь | priority | changefreq |
|------|----------|------------|
| `/` | 1.0 | weekly |
| `/services/seo`, `/targeted-advertising`, `/smm` | 0.9 | weekly |
| `/services/google-ads`, `/photo-video`, `/marketing-strategy`, `/website-development`, `/automation`, `/geo-ai-seo` | 0.8 | weekly |
| `/portfolio` | 0.9 | weekly |
| `/about` | 0.8 | monthly |
| `/testimonials` | 0.7 | monthly |

> Каждый путь размножается ×3 языка → **39 `<url>` записей**. `/api/` и служебные эндпоинты не входят.

---

## 5. Редиректы

Реализованы в `src/proxy.ts` (в Next 16 middleware переименован в `proxy.ts`):

- **`/eng` и `/eng/*` → 301** на тот же путь без префикса (`/eng/services/seo` → `/services/seo`).
- Всё остальное проходит через `intlMiddleware` (next-intl) — разбор локали и префиксов.
- `matcher`: `["/((?!api|_next|_vercel|.*\\..*).*)"]`.

Канонизация домена (www ↔ non-www, http → https, trailing slash) на уровне приложения не форсится — решается на хостинге/DNS.

---

## 6. SEO-метаданные

- Глобальные `metadata` — в `src/app/[locale]/layout.tsx`: шаблон `%s | dc.prod`, `metadataBase`, `robots` (index/follow). `<html lang={locale} dir={dir}>`.
- На каждой странице — `generateMetadata` с `alternates.canonical` (по локали) и `alternates.languages` (hreflang en/ru/he/x-default).
- Сервисные страницы: `title`/`description` берутся из `Services.<slug>.meta`.
- JSON-LD (Organization, Service, FAQPage) — инлайн на главной.

---

## 7. Что проверить перед продакшеном

1. **`NEXT_PUBLIC_SITE_URL`** обязательно выставить в проде — иначе canonical/robots/sitemap укажут на фолбэк `dcprod.agency`.
2. **`NEXT_PUBLIC_WHATSAPP_URL`** — задать реальный номер WhatsApp (сейчас фолбэк-плейсхолдер `https://wa.me/972000000000` в CTA сервисных страниц).
3. **Канонический домен** (www vs non-www, http→https) настроить на хостинге.
4. Логотип в шапке остаётся **DC.PROD**, тексты контента — **DC Project** (так задумано).
