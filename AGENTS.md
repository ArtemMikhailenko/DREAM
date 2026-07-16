<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Content lives in the CMS, not in `messages/*.json`

Site copy is managed in Payload at `/admin` and stored in Postgres. `messages/{en,ru,he}.json`
are **no longer read by the site** — they are kept only as the seed source and a backup of the
pre-CMS copy. Editing them changes nothing.

- **Schema:** `src/collections/*` (Услуги, Кейсы, Отзывы, Медиа, Заявки, Пользователи) and
  `src/globals/*` (Главная, О студии, Навигация, страницы, Шоурил, Форма заявки).
  Field names deliberately mirror the next-intl message keys.
- **The bridge:** `src/lib/messages.ts` rebuilds the whole message tree from Payload;
  `src/i18n/request.ts` feeds it to next-intl. Because the shape is identical to the old JSON,
  components still call `t("Home.hero.kicker")` and needed no changes. Keep it that way — if you
  add a field, add it in both places.
- **Locales:** one document holds en/ru/he (`localized: true`); the admin's locale switcher swaps
  between them. `slug` fields are never localized — they are URLs.
- **Rendering:** pages stay statically generated. Saving in the admin triggers
  `src/hooks/revalidate.ts`, which purges the routes. That hook must stay tolerant of running
  outside a request (the seed and CLI have no render store) — see the try/catch there.

## Setup

```bash
createdb dream_cms                  # or point DATABASE_URI at Neon/Supabase
cp .env.example .env                # set DATABASE_URI + PAYLOAD_SECRET
npm run seed                        # messages/*.json → Payload (idempotent)
npm run dev                         # /admin creates the first user
```

`npm run generate:types` after any schema change; `npm run generate:importmap` after adding
custom admin components.
