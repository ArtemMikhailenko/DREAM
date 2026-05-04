# DREAM

Next.js-лендинг для DREAM: быстрый сайт под рекламу и SEO, без личного кабинета, бронирования и блоговой части на старте.

## Что уже заложено

- Структура страницы: оффер, проблема, решение, видео, кейсы, о нас, отзывы, FAQ и финальная заявка.
- Базовая SEO-архитектура: metadata, canonical, Open Graph, Twitter Card, JSON-LD Organization/Service/FAQ, `sitemap.xml`, `robots.txt`, manifest.
- Заявка через `/api/lead` с передачей в CRM webhook.
- Meta Pixel + Conversions API с общим `event_id` для дедупликации.
- Google Tag Manager как основной слой событий для рекламных тегов.
- Опциональный прямой Google Ads conversion tracking, выключен по умолчанию, чтобы не задваивать лиды с GTM.
- TikTok Pixel с событием `SubmitForm`.

## Дедупликация лидов

Форма генерирует уникальный `eventId` на каждую отправку. Этот ID уходит:

- на сервер в `/api/lead`;
- в Meta Conversions API как `event_id`;
- в Meta Pixel как `eventID`;
- в `dataLayer` как `event_id`;
- в TikTok Pixel как `event_id`;
- в Google Ads `transaction_id`, если включен прямой режим.

Для Google Ads выберите один путь: либо отправка конверсии через GTM по событию `lead_submit`, либо прямой `gtag` через `NEXT_PUBLIC_GOOGLE_ADS_DIRECT_TRACKING=true`.

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните реальные ID пикселей, CRM webhook и site URL.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Проверка перед запуском

```bash
npm run lint
npm run build
```

## Где менять контент

- Основные блоки: `src/app/page.tsx`
- Форма заявки: `src/components/LeadForm.tsx`
- Пиксели и GTM: `src/components/Analytics.tsx`
- CRM и Meta CAPI: `src/lib/lead.ts`
- События браузера: `src/lib/tracking.ts`

Когда будут примеры и референсы, заменим временные визуальные слоты в блоке видео на реальные материалы.
