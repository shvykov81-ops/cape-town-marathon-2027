# Техническая спецификация: Cape Town Marathon 2027 — RUN & Travel Platform

**Версия:** 6.4.1  
**Дата:** 2026-06-17  
**Статус:** MVP + Wow Effects Phase 1 ✅ + Trainer Booking Integration ✅ + Contact Forms v2 ✅ + Telegram Bot v2 ✅ + Booking Notifications ✅ + Rate Limiting (partial) ✅ + i18n Infrastructure ✅ + Navigation/Footer RU ✅  
**Автор:** Архитектурный аудит на основе реальной кодовой базы GitHub: `shvykov81-ops/cape-town-marathon-2027`  
**Аудит проведён по:** живому коду из main-ветки, GitHub README (2026-06-16), Vercel production logs

---

## 1. Общая информация

### 1.1 Событие

| Параметр | Значение |
|----------|----------|
| **Название** | Cape Town Marathon 2027 |
| **Статус** | Africa's first Abbott World Marathon Majors Candidate |
| **Дата** | 2027 (точная дата уточняется, обычно сентябрь-октябрь) |
| **Место** | Кейптаун, ЮАР |
| **Концепция платформы** | RUN & Travel — подготовка + путешествие |
| **Целевая аудитория** | Участники марафона, тренеры, туристы |

### 1.2 Abbott World Marathon Majors

Abbott World Marathon Majors (WMM) — серия из шести крупнейших марафонов мира: Токио, Бостон, Лондон, Берлин, Чикаго, Нью-Йорк. Cape Town Marathon стал **первым кандидатом из Африки** на включение в эту престижную серию.

### 1.3 Цветовая схема и брендинг

| Элемент | Значение |
|---------|----------|
| **Primary** | Teal `#14b8a6` |
| **Accent** | Gold `#f59e0b` |
| **Background** | Dark `#0a0a0a` / Neutral `#171717` |
| **Шрифт** | Inter (Google Fonts) — subsets: latin, cyrillic |
| **Стиль** | Минималистичный, современный, спортивный, премиальный |

---

## 2. Архитектура

### 2.1 Технологический стек

```
Frontend:      Next.js 15.3.8 (App Router) + React 19 + TypeScript 5.7
Styling:       Tailwind CSS 3.4.17 + shadcn/ui (radix-ui компоненты)
Animations:    Framer Motion 11.18.2
Auth:          NextAuth v5 (beta.31) + Credentials provider + bcryptjs
Database:      PostgreSQL (Supabase) + Prisma ORM 6.0.0 + @prisma/adapter-pg
Icons:         Lucide React 0.460.0
State:         React useState/useEffect
Validation:    Zod 3.24.0 (contact ✅, booking ✅, package-trainers POST ✅, остальные — нет)
Rate Limit:    lru-cache 11.5.1 (contact API ✅, остальные — нет)
Notifications: Telegram Bot API (contact form ✅, booking — нет)
Sheets:        Google Sheets API (bookings ✅, users ✅, contacts — нет)
Search:        Fuse.js 7.4.2
i18n:          next-intl (App Router)
Deployment:    Vercel (production) — cape-town-marathon-2027.vercel.app
```

### 2.2 Wow Effects Stack (Phase 1 — РЕАЛИЗОВАНО)

```
WebGL:         Чистый WebGL API (zero deps) — film grain overlay
Kinetic Text:  Кастомный split-flap (airport display) — zero deps
Scroll Video:  Framer Motion useScroll + useSpring — video scrubbing
Preloader:     Framer Motion AnimatePresence — session-based
Route Viz:     SVG pathLength animation + checkpoint markers
```

> **Note:** Cursor effects (Magnetic UI, Trail Cursor, 3D Tilt) were removed in v6.3 to improve accessibility and reduce CPU usage on low-end devices.

### 2.3 Design Tokens (Phase 1.5 — РЕАЛИЗОВАНО)

```
lib/design-tokens.ts:    Централизованные токены (цвета, типографика, spacing, анимации)
tailwind.config.ts:       Обновлён с кастомными цветами, shadows, анимациями
globals.css:              Очищен, без дублирования, keyframes через Tailwind
components/effects/:
  ambient-background.tsx        Реиспользуемый AmbientGlow + FloatingOrb
  kinetic-section-title.tsx     Реиспользуемый анимированный заголовок
  animated-counter.tsx          Вынесенный AnimatedCounter
  glassmorphism-feature-card.tsx Обновлённый, без styled-jsx
```

### 2.4 Статус сборки и деплоя

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `npx tsc --noEmit` | ✅ 0 ошибок | TypeScript чистый |
| `npm run build` | ✅ Успешно | 17+ страниц, 20+ API routes |
| `npm run dev` | ✅ Работает | Локальный сервер localhost:3000 |
| Vercel Deploy | ✅ Production | cape-town-marathon-2027.vercel.app |
| Vercel Logs | ✅ Healthy | 48×200, 2×404 (favicon only) |

### 2.5 Файловая структура (актуальная, из репозитория)

```
cape-town-marathon-2027/
├── app/
│   ├── (home)/
│   │   ├── page.tsx                   # Preloader + TrailCursor + Hero v2 + Glassmorphism + TrainersTeaser
│   │   ├── stats-section.tsx
│   │   ├── newsletter-section.tsx
│   │   ├── prep-camp-teaser.tsx
│   │   └── page-variant-a.tsx         # Альтернатива: Glassmorphism вместо Stats
│   ├── about-race/
│   ├── account/
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── bookings/
│   │   │   └── page.tsx               # BookingsTable с колонкой Trainer
│   │   ├── packages/
│   │   ├── trainers/
│   │   └── documents/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts               # NextAuth v5 beta — ⚠️ БЕЗ rate limit
│   │   ├── booking/
│   │   │   └── route.ts               # ✅ Zod validation, trainer validation, phone sync, Google Sheets
│   │   ├── bookings/
│   │   │   └── route.ts               # GET — include trainer
│   │   ├── contact/
│   │   │   └── route.ts               # ✅ НОВОЕ: Zod + rate limit + honeypot + Telegram + DB persistence
│   │   ├── admin/
│   │   │   ├── bookings/route.ts      # GET — include trainer, payment
│   │   │   ├── packages/route.ts      # GET/POST — ⚠️ БЕЗ Zod (POST)
│   │   │   ├── trainers/route.ts      # GET/POST — ⚠️ БЕЗ Zod (POST)
│   │   │   ├── documents/route.ts     # GET
│   │   │   ├── stats/route.ts         # GET — 6 COUNT queries, ⚠️ БЕЗ cache
│   │   │   └── package-trainers/      # GET/POST/DELETE — ✅ Zod только на POST
│   │   │       └── route.ts
│   │   ├── trainers/
│   │   │   ├── route.ts               # GET — public, ⚠️ БЕЗ validation
│   │   │   └── [id]/
│   │   │       └── route.ts           # GET — public, ⚠️ БЕЗ validation
│   │   ├── packages/
│   │   │   ├── route.ts               # GET — public, ⚠️ БЕЗ validation
│   │   │   └── [id]/
│   │   │       └── options/
│   │   │           └── route.ts       # GET — public, ⚠️ БЕЗ validation
│   │   ├── checklist/
│   │   │   └── route.ts               # GET — auto-create DEFAULT_CHECKLIST
│   │   ├── documents/
│   │   │   └── route.ts               # GET/POST — ⚠️ БЕЗ Zod (POST)
│   │   └── reviews/
│   │       └── route.ts               # ⚠️ Требует аудита
│   ├── blog/[slug]/
│   ├── booking/
│   │   └── page.tsx                   # Читает trainer из URL, показывает в форме
│   ├── cape-town-guide/
│   ├── contact/
│   │   ├── page.tsx                   # ✅ Обновлён: Telegram-only, без email
│   │   └── sections/
│   │       ├── contact-hero.tsx
│   │       ├── contact-form-section.tsx
│   │       ├── quick-contact-cards.tsx
│   │       └── telegram-cta-section.tsx  # ✅ CTA для Telegram группы (v6.1)                   # ✅ ОБНОВЛЁН: Форма с валидацией, honeypot, rate limit
│   ├── cookies/
│   ├── dashboard/
│   │   └── page.tsx                   # Показывает trainer в бронированиях
│   ├── faq/
│   ├── prep-camp/
│   ├── pricing/
│   ├── privacy/
│   ├── race-week/
│   ├── refund/
│   ├── terms/
│   ├── trainers/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx               # Кнопка "Book with Name" → /booking?trainer=ID
│   ├── globals.css                    # Очищен, без дублирования, custom cursor styles
│   ├── layout.tsx                     # dynamic = 'force-dynamic', Inter font
│   └── providers.tsx
├── i18n/
│   ├── config.ts                      # ✅ v6.4 — locales [en, ru], defaultLocale
│   └── request.ts                     # ✅ v6.4 — async headers()/cookies() (Next.js 15.3)
├── messages/
│   ├── en.json                        # ✅ v6.4 — EN translations
│   └── ru.json                        # ✅ v6.4 — RU translations
├── components/
│   ├── icons/
│   │   └── telegram-icon.tsx       # ✅ Telegram SVG icon (v6.1)
│   ├── locale-switcher.tsx          # ✅ v6.4 — Language switcher (EN/RU)
│   ├── telegram-button.tsx          # ✅ Reusable Telegram CTA button (v6.1)
│   ├── admin/
│   │   └── bookings-table.tsx          # Колонка Trainer
│   ├── effects/                        # wow effects + design tokens
│   │   ├── webgl-grain.tsx
│   │   ├── kinetic-typography.tsx
│   │   ├── scroll-video.tsx
│   │   ├── interactive-elements.tsx
│   │   ├── preloader.tsx
│   │   ├── hero-section-v2.tsx
│   │   ├── route-visualization-v2.tsx
│   │   ├── trainers-teaser.tsx
│   │   ├── glassmorphism-feature-card.tsx
│   │   ├── ambient-background.tsx
│   │   ├── kinetic-section-title.tsx
│   │   └── animated-counter.tsx
│   ├── trainers/
│   │   ├── trainer-profile.tsx         # Ссылка /booking?trainer=${trainer.id}
│   │   └── trainers-list.tsx
│   ├── navigation.tsx                  # Навигация
│   ├── footer.tsx                      # Футер
│   └── ui/                             # shadcn/ui
├── lib/
│   ├── auth-helper.ts
│   ├── validations/
│   │   ├── contact.ts              # ✅ Zod schema для contact form
│   │   ├── booking.ts              # ✅ Zod schema для booking form (v6.1)
│   │   ├── package.ts              # ⚠️ TODO — Zod schema для packages
│   │   ├── trainer.ts              # ⚠️ TODO — Zod schema для trainers
│   │   ├── review.ts               # ⚠️ TODO — Zod schema для reviews
│   │   └── document.ts             # ⚠️ TODO — Zod schema для documents                  # ⚠️ НЕ УДАЛЯТЬ — getAuthUser, используется в 6+ API
│   ├── prisma.ts                       # Prisma client singleton
│   ├── design-tokens.ts                # Централизованные design tokens
│   ├── sheets-sync.ts                  # Google Sheets sync (bookings + users)
│   ├── telegram.ts                     # ✅ НОВОЕ: Telegram Bot API wrapper
│   ├── rate-limit.ts                   # ✅ НОВОЕ: LRU-cache rate limiter
│   ├── google-sheets.ts                # Google Sheets API wrapper
│   ├── validations/
│   │   └── contact.ts                  # ✅ НОВОЕ: Zod schema для contact form
│   └── utils.ts                        # Хелперы (cn, etc.)
├── prisma/
│   └── schema.prisma                   # Полная схема (см. раздел 6)
│   └── seed.ts                         # Seed data
├── public/
│   ├── images/
│   └── videos/hero.mp4
├── auth.ts                             # NextAuth v5 конфигурация
├── middleware.ts                       # ✅ v6.4 — Locale redirect + NextAuth + Rate limit
├── tailwind.config.ts                  # Tailwind v3 конфиг
├── next.config.js                      # ✅ v6.4 — next-intl plugin
└── package.json                        # Зависимости
```

---

## 3. Wow Effects — Детальная спецификация (Phase 1)

*(Без изменений от v5 — все эффекты реализованы и работают)*

### 3.1 Preloader
- Session-based (`sessionStorage: ctm-visited`)
- 2.5 сек минимум, exit fade 0.8s

### 3.2 WebGL Grain Overlay
- Чистый WebGL API, zero deps
- Uniforms: grainIntensity=0.12, vignette=2.5, teal tint

### 3.3 Kinetic Typography
- Airport split-flap display
- 20 frames, easeOut cubic

### 3.4 Hero Section v2
- Sticky scroll container (200vh)
- Video scrubbing via passive scroll listener
- WebGLGrain + radial gradient vignette
- KineticHeadline: "CAPE TOWN MARATHON" → "RUN & TRAVEL" → "2027"
- 3 AnimatedCounter (42.2km, 500+ runners, 12 coaches)

### 3.5 Route Visualization v2
- SVG quadratic bezier, 5 checkpoints
- pathLength 0→1 при скролле
- Glow + gradient + dashed animated

### 3.5 Trainers Teaser
- `/api/trainers` — топ-4 по rating
- Standard glassmorphism cards with hover effects
- Stagger fade-in 0.15s

### 3.6 Glassmorphism Feature Card
- Glassmorphism с ambient glow, floating orbs
- Без styled-jsx global

---

## 4. Бронирование с тренером — Интеграция (Phase 1.5 ✅)

### 4.1 Флоу бронирования

```
/trainers/[id] → Кнопка "Book with Name" → /booking?trainer=ID
                                    ↓
              Форма читает trainerId из URL → Загружает данные тренера
                                    ↓
              Показывает бейдж + карточку тренера в Order Summary
                                    ↓
              POST /api/booking { packageId, trainerId, ... }
                                    ↓
              Создаётся Booking с trainerId → Dashboard → Admin → Google Sheets
```

### 4.2 Обновлённые API

| API | Изменения | Статус |
|-----|-----------|--------|
| `POST /api/booking` | Zod validation, проверка trainerId, обновление phone, sync Google Sheets | ✅ |
| `GET /api/bookings` | include: { trainer: { select: id, firstName, lastName, photoUrl } } | ✅ |
| `GET /api/admin/bookings` | include: { trainer: { select: id, firstName, lastName } } | ✅ |

### 4.3 Обновлённые компоненты

| Компонент | Изменения |
|-----------|-----------|
| `app/booking/page.tsx` | useSearchParams для trainerId, загрузка тренера, отображение в форме |
| `app/dashboard/page.tsx` | Отображение trainer.firstName + trainer.lastName в бронировании |
| `components/admin/bookings-table.tsx` | Колонка "Trainer" в таблице |
| `components/trainers/trainer-profile.tsx` | Ссылка `/booking?trainer=${trainer.id}` |
| `lib/sheets-sync.ts` | Колонки "Trainer" и "Trainer ID" в Google Sheets |

### 4.4 Google Sheets интеграция — Bookings

| Колонка | Содержимое |
|---------|------------|
| A | ID брони |
| B | Дата создания |
| C | Email пользователя |
| D | Имя пользователя |
| E | ID пакета |
| F | Даты (checkIn - checkOut) |
| G | Количество гостей |
| H | Итоговая цена |
| I | Статус |
| J | Телефон |
| K | Имя тренера |
| L | ID тренера |

### 4.5 Google Sheets интеграция — Users

| Колонка | Содержимое |
|---------|------------|
| A | ID пользователя |
| B | Дата создания |
| C | Email |
| D | Имя |
| E | Телефон |
| F | Национальность |
| G | Telegram ID |

---

## 5. Контактная форма v2 — Полная спецификация (Phase 1.6 ✅)

### 5.1 Архитектура

```
Пользователь → /contact/page.tsx → POST /api/contact
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
              Zod Validation   Rate Limit      Honeypot Check
                    ↓               ↓               ↓
              Prisma DB Save   Telegram Bot    Response 200
```

### 5.2 Компоненты

| Компонент | Файл | Описание |
|-----------|------|----------|
| **Contact Form UI** | `app/contact/page.tsx` | React form: name, email, phone, subject (select), message, honeypot (hidden) |
| **API Handler** | `app/api/contact/route.ts` | POST endpoint с полным pipeline |
| **Zod Schema** | `lib/validations/contact.ts` | Валидация всех полей |
| **Rate Limiter** | `lib/rate-limit.ts` | LRU-cache: 5 запросов/мин на IP |
| **Telegram Notify** | `lib/telegram.ts` | Отправка форматированного сообщения в админ-группу |

### 5.3 Zod Schema (`lib/validations/contact.ts`)

```ts
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-''']+$/, "Name contains invalid characters"),
  email: z.string()
    .email("Please enter a valid email")
    .max(255, "Email is too long"),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format)")
    .optional()
    .or(z.literal("")),
  subject: z.enum(["GENERAL", "PREP_CAMP", "TRAINER", "PARTNERSHIP", "MEDIA"]),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  website: z.string().max(0).optional() // honeypot — must be empty
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

### 5.4 Rate Limiting (`lib/rate-limit.ts`)

```ts
import { LRUCache } from "lru-cache";

const rateLimitCache = new LRUCache<string, number>({
  max: 500,        // Max 500 unique IPs
  ttl: 60 * 1000,  // 1 minute window
});

export function checkRateLimit(ip: string, maxRequests: number = 5): boolean {
  const current = rateLimitCache.get(ip) || 0;
  if (current >= maxRequests) return false;
  rateLimitCache.set(ip, current + 1);
  return true;
}

export function getRateLimitRemaining(ip: string, maxRequests: number = 5): number {
  const current = rateLimitCache.get(ip) || 0;
  return Math.max(0, maxRequests - current);
}
```

**Текущее покрытие:**
- ✅ `POST /api/contact` — 5 req/min
- ❌ `POST /api/auth/[...nextauth]` — не защищён (brute force риск)
- ❌ `POST /api/booking` — не защищён (спам бронирований)
- ❌ Все остальные API — не защищены

### 5.5 Telegram Notifications (`lib/telegram.ts`)

```ts
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_GROUP_ID = process.env.TELEGRAM_ADMIN_GROUP_ID;

export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean>
export async function sendContactNotification(contact: {...}): Promise<boolean>
```

**Формат сообщения:**
```
📬 **New Contact Form Submission**

👤 **Name:** {name}
📧 **Email:** {email}
📱 **Phone:** {phone || "Not provided"}
📋 **Subject:** {GENERAL|PREP_CAMP|TRAINER|PARTNERSHIP|MEDIA}

📝 **Message:**
{message}

⏰ **Received:** {ISO timestamp}
🔗 **Reply:** Reply to this thread or email {email}
```

**Особенности реализации:**
- HTML escape перед отправкой (`<`, `>`, `&`, `"`)
- Graceful fallback если `TELEGRAM_BOT_TOKEN` не задан
- Async non-blocking: не блокирует HTTP response
- DB tracking: `telegramSent` flag в `ContactMessage`
- Audit trail: `TelegramLog` model

### 5.6 API Handler (`app/api/contact/route.ts`)

```ts
export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip, 5)) {
    return NextResponse.json({ error: "Too many requests..." }, { status: 429 });
  }

  // 2. Honeypot check
  if (body.website && body.website.length > 0) {
    return NextResponse.json({ success: true }, { status: 200 }); // Fake success
  }

  // 3. Zod validation
  const result = contactFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 });
  }

  // 4. Save to DB
  const contactMessage = await prisma.contactMessage.create({...});

  // 5. Send Telegram (async, non-blocking)
  sendContactNotification({...}).then((sent) => {
    if (sent) {
      prisma.contactMessage.update({ where: { id: contactMessage.id }, data: { telegramSent: true } });
    }
  });

  return NextResponse.json({ success: true, messageId: contactMessage.id, ... });
}
```

### 5.7 Prisma Schema — ContactMessage

```prisma
enum ContactSubject {
  GENERAL
  PREP_CAMP
  TRAINER
  PARTNERSHIP
  MEDIA
}

model ContactMessage {
  id            String         @id @default(cuid())
  name          String
  email         String
  phone         String?
  subject       ContactSubject @default(GENERAL)
  message       String
  source        String         @default("contact_page")
  ipAddress     String?
  userAgent     String?
  telegramSent  Boolean        @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([email])
  @@index([createdAt])
}
```

### 5.8 Prisma Schema — TelegramLog

```prisma
model TelegramLog {
  id            String   @id @default(cuid())
  chatId        String
  messageType   String
  payload       Json
  status        String   @default("pending")
  errorMessage  String?
  createdAt     DateTime @default(now())

  @@index([chatId])
  @@index([createdAt])
}
```

### 5.9 Google Sheets интеграция (Contact)

**Текущий статус:** ❌ НЕ РЕАЛИЗОВАНО
- ContactMessage сохраняется только в PostgreSQL
- Нет синхронизации с Google Sheets (в отличие от Booking)
- **Рекомендация:** Добавить `syncContactToSheet()` в `lib/sheets-sync.ts`

---

## 5.1 i18n — Интернационализация (Phase 1.7 ✅ v6.4)

### 5.1.1 Архитектура

```
Пользователь → / → middleware.ts → redirect /en/ (или /ru/ из cookie/Accept-Language)
                                    ↓
              /en/* или /ru/* → app/[locale]/layout.tsx → NextIntlClientProvider
                                    ↓
              Компоненты → useTranslations("namespace.key") → messages/{locale}.json
```

### 5.1.2 Технологии

| Компонент | Технология | Версия |
|-----------|-----------|--------|
| Библиотека | next-intl | latest |
| Локали | en, ru | default: en |
| URL | /en/*, /ru/* | cookie сохранение |
| Server | getTranslations() | async (Next.js 15.3) |
| Client | useTranslations() | "use client" |

### 5.1.3 Структура сообщений

```
messages/
├── en.json           # EN translations (all pages)
└── ru.json           # RU translations (all pages)
```

**Namespaces:**
- `metadata` — title, description
- `navigation` — nav links, buttons
- `hero` — Hero section
- `features` — Glassmorphism card
- `trainers` — Trainers section
- `booking` — Booking wizard (5 steps)
- `contact` — Contact form
- `footer` — Footer links
- `locale` — Language switcher

### 5.1.4 Middleware — Locale Handling

```ts
// middleware.ts
// 1. Skip: /api/*, /admin/*, /_next/*, /images/*, /videos/*
// 2. Admin: auth check (no locale)
// 3. API: rate limiting (no locale)
// 4. Pages: redirect / → /en/ (or cookie locale)
// 5. Valid locales: en, ru
```

### 5.1.5 Компоненты

| Компонент | Файл | Описание |
|-----------|------|----------|
| LocaleSwitcher | `components/locale-switcher.tsx` | Select EN/RU, cookie + router push |
| Navigation | `components/navigation.tsx` | Переведена, ссылки с `/${locale}/` |
| Footer | `components/footer.tsx` | Переведён, интерполяция copyright year |

### 5.1.6 Next.js 15.3 Breaking Changes

| API | Было | Стало |
|-----|------|-------|
| `params` | `{ locale: string }` | `Promise<{ locale: string }>` |
| `headers()` | Синхронный | `await headers()` |
| `cookies()` | Синхронный | `await cookies()` |

### 5.1.7 Статус перевода

| Страница | Статус | Компоненты |
|----------|--------|-----------|
| Navigation | ✅ | Полностью + добавлены cape-town-guide, prep-camp, race-week |
| Footer | ✅ | Полностью + все ссылки с locale |
| Hero | ⚠️ | Инфраструктура готова, хардкод-строки |
| Booking | ⚠️ | Инфраструктура готова, хардкод-строки |
| Contact | ⚠️ | Инфраструктура готова, хардкод-строки |
| Trainers | ⚠️ | Инфраструктура готова, хардкод-строки |
| Cape Town Guide | ⚠️ | Инфраструктура готова, хардкод-строки |
| Prep Camp | ⚠️ | Инфраструктура готова, хардкод-строки |
| Race Week | ⚠️ | Инфраструктура готова, хардкод-строки |
| Admin | ❌ | Без locale — только EN |
| API | ❌ | Без locale — как было |

---

## 6. Полная схема Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model User {
  id              String         @id @default(cuid())
  email           String         @unique
  emailVerified   DateTime?
  image           String?
  name            String?
  password        String?
  firstName       String?
  lastName        String?
  phone           String?
  passportNumber  String?
  nationality     String?
  dateOfBirth     DateTime?
  emergencyContact String?
  medicalNotes    String?
  telegramId      String?
  role            String         @default("user")
  accounts        Account[]
  sessions        Session[]
  bookings        Booking[]
  documents       Document[]
  checklistItems  ChecklistItem[]
  reviews         Review[]
  notifications   Notification[]
  blogPosts       BlogPost[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([role])
}

model Booking {
  id            String      @id @default(cuid())
  userId        String
  packageId     String
  trainerId     String?
  paymentId     String?     @unique
  status        String      @default("pending")
  checkInDate   DateTime
  checkOutDate  DateTime
  guestsCount   Int         @default(1)
  totalPrice    Decimal     @db.Decimal(10, 2)
  telegramNotif Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  user          User        @relation(fields: [userId], references: [id])
  package       Package     @relation(fields: [packageId], references: [id])
  trainer       Trainer?    @relation(fields: [trainerId], references: [id])
  payment       Payment?
  transfers     Transfer[]
  excursions    Excursion[]
  reviews       Review[]
}

model Package {
  id              String          @id @default(cuid())
  name            String
  type            String
  durationDays    Int
  priceBase       Decimal         @db.Decimal(10, 2)
  maxParticipants Int
  description     String
  includes        String[]
  isActive        Boolean         @default(true)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  bookings        Booking[]
  options         PackageOption[]
  trainers        PackageTrainer[]
}

model PackageOption {
  id        String  @id @default(cuid())
  packageId String
  name      String
  priceAdd  Decimal @db.Decimal(10, 2)
  category  String
  isActive  Boolean @default(true)
  package   Package @relation(fields: [packageId], references: [id], onDelete: Cascade)
}

model PackageTrainer {
  id        String   @id @default(cuid())
  packageId String
  trainerId String
  role      String   @default("coach")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  package   Package  @relation(fields: [packageId], references: [id], onDelete: Cascade)
  trainer   Trainer  @relation(fields: [trainerId], references: [id], onDelete: Cascade)

  @@unique([packageId, trainerId])
}

model Payment {
  id            String   @id @default(cuid())
  bookingId     String   @unique
  amount        Decimal  @db.Decimal(10, 2)
  currency      String   @default("USD")
  status        String   @default("pending")
  provider      String?
  transactionId String?
  paidAt        DateTime?
  booking       Booking  @relation(fields: [bookingId], references: [id])
}

model Transfer {
  id           String   @id @default(cuid())
  bookingId    String
  type         String
  fromLocation String
  toLocation   String
  datetime     DateTime
  vehicleType  String?
  driverName   String?
  booking      Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
}

model Excursion {
  id            String   @id @default(cuid())
  bookingId     String
  name          String
  description   String
  durationHours Int
  price         Decimal  @db.Decimal(10, 2)
  meetingPoint  String?
  maxGroupSize  Int?
  imageUrl      String?
  booking       Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)
}

model Review {
  id          String    @id @default(cuid())
  userId      String
  bookingId   String?
  trainerId   String?
  rating      Int
  text        String
  images      String[]
  isPublished Boolean   @default(false)
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  booking     Booking?  @relation(fields: [bookingId], references: [id])
  trainer     Trainer?  @relation(fields: [trainerId], references: [id])
}

model Notification {
  id       String    @id @default(cuid())
  userId   String
  type     String
  channel  String
  status   String    @default("pending")
  payload  String?
  sentAt   DateTime?
  readAt   DateTime?
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model BlogPost {
  id            String    @id @default(cuid())
  title         String
  slug          String    @unique
  content       String
  excerpt       String?
  featuredImage String?
  category      String?
  tags          String[]
  publishedAt   DateTime?
  authorId      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  author        User?     @relation(fields: [authorId], references: [id])
}

model Trainer {
  id            String         @id @default(cuid())
  firstName     String
  lastName      String
  bio           String
  credentials   String?
  photoUrl      String?
  photos        String[]
  instagramUrl  String?
  tripsterUrl   String?
  rating        Float          @default(0)
  reviewCount   Int            @default(0)
  specialties   String[]
  languages     String[]
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  bookings      Booking[]
  reviews       Review[]
  packages      PackageTrainer[]
}

model Document {
  id         String   @id @default(cuid())
  userId     String
  name       String
  type       String
  url        String
  status     String   @default("pending")
  uploadedAt DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ChecklistItem {
  id        String   @id @default(cuid())
  userId    String
  title     String
  category  String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum ContactSubject {
  GENERAL
  PREP_CAMP
  TRAINER
  PARTNERSHIP
  MEDIA
}

model ContactMessage {
  id           String         @id @default(cuid())
  name         String
  email        String
  phone        String?
  subject      ContactSubject @default(GENERAL)
  message      String
  source       String         @default("contact_page")
  ipAddress    String?
  userAgent    String?
  telegramSent Boolean        @default(false)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  @@index([email])
  @@index([createdAt])
}

model TelegramLog {
  id           String   @id @default(cuid())
  chatId       String
  messageType  String
  payload      Json
  status       String   @default("pending")
  errorMessage String?
  createdAt    DateTime @default(now())

  @@index([chatId])
  @@index([createdAt])
}
```

---

## 7. Telegram Bot — Полная спецификация (Phase 1.6 ✅)

### 7.1 Архитектура

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Contact Form   │────→│  sendContact     │────→│  Telegram API   │
│  Submission     │     │  Notification()  │     │  (Bot Token)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ↓
                        ┌──────────────┐
                        │  TelegramLog │
                        │  (audit)     │
                        └──────────────┘
```

### 7.2 Переменные окружения

```env
TELEGRAM_BOT_TOKEN="..."           # Bot token от @BotFather
TELEGRAM_ADMIN_GROUP_ID="..."      # ID группы/чата для уведомлений
```

### 7.3 Текущий функционал

| Фича | Статус | Описание |
|------|--------|----------|
| Contact notifications | ✅ | Мгновенное уведомление о новой заявке |
| HTML formatting | ✅ | Жирный текст, эмодзи, структурированное сообщение |
| Error handling | ✅ | Graceful fallback, логирование в консоль |
| DB audit | ✅ | TelegramLog + ContactMessage.telegramSent |
| Booking notifications | ❌ | Не реализовано — P0 |
| Admin commands | ❌ | Не реализовано — /stats, /bookings и т.д. |
| Inline keyboard | ❌ | Не реализовано — кнопки "Ответить", "Пометить" |

### 7.4 Планируемые расширения (P1)

```
Booking notifications:
  → Новое бронирование (сумма, пакет, тренер)
  → Изменение статуса (pending → confirmed → paid)
  → Ежедневная сводка (/daily command)

Admin commands:
  → /stats — статистика за сегодня
  → /bookings — последние 5 бронирований
  → /contacts — последние 5 заявок
  → /reply {email} {message} — ответить на заявку
```

---

## 8. Полный аудит API routes

### 8.1 Публичные API

| Route | Method | Auth | Validation | Rate Limit | Status |
|-------|--------|------|------------|------------|--------|
| `/api/contact` | POST | None | ✅ Zod | ✅ 5/min | ✅ PRODUCTION READY |
| `/api/trainers` | GET | None | ❌ | ❌ | ⚠️ NEEDS VALIDATION |
| `/api/trainers/[id]` | GET | None | ❌ | ❌ | ⚠️ NEEDS VALIDATION |
| `/api/packages` | GET | None | ❌ | ❌ | ⚠️ NEEDS VALIDATION |
| `/api/packages/[id]/options` | GET | None | ❌ | ❌ | ⚠️ NEEDS VALIDATION |
| `/api/reviews` | GET/POST | Unknown | ❌ | ❌ | ⚠️ NEEDS AUDIT |

### 8.2 Аутентифицированные API

| Route | Method | Auth | Validation | Rate Limit | Status |
|-------|--------|------|------------|------------|--------|
| `/api/booking` | POST | getAuthUser | ✅ Zod | ❌ | ⚠️ NEEDS RATE LIMIT |
| `/api/bookings` | GET | getAuthUser | N/A | ❌ | ⚠️ NEEDS RATE LIMIT |
| `/api/checklist` | GET | getAuthUser | N/A | ❌ | ⚠️ NEEDS RATE LIMIT |
| `/api/documents` | GET/POST | getAuthUser | ❌ (POST) | ❌ | ⚠️ NEEDS ZOD + RATE LIMIT |

### 8.3 Админ API

| Route | Method | Auth | Validation | Rate Limit | Cache | Status |
|-------|--------|------|------------|------------|-------|--------|
| `/api/admin/bookings` | GET | auth() + admin | N/A | ❌ | ❌ | ⚠️ NEEDS PAGINATION |
| `/api/admin/packages` | GET/POST | auth() + admin | ❌ (POST) | ❌ | ❌ | ⚠️ NEEDS ZOD |
| `/api/admin/trainers` | GET/POST | auth() + admin | ❌ (POST) | ❌ | ❌ | ⚠️ NEEDS ZOD |
| `/api/admin/documents` | GET | auth() + admin | N/A | ❌ | ❌ | ⚠️ NEEDS RATE LIMIT |
| `/api/admin/stats` | GET | auth() + admin | N/A | ❌ | ❌ | ⚠️ NEEDS CACHE |
| `/api/admin/package-trainers` | GET/POST/DELETE | auth() + admin | ✅ (POST only) | ❌ | ❌ | ⚠️ NEEDS RATE LIMIT |

### 8.4 Auth API

| Route | Method | Auth | Rate Limit | Status |
|-------|--------|------|------------|--------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth v5 | ❌ | 🚨 CRITICAL |

---

## 9. Аудит кодовой базы — Выявленные проблемы (2026-06-15)

### 9.1 Исправлено с v5 → v6

| # | Проблема (v5) | Решение (v6) | Файлы | Статус |
|---|---------------|--------------|-------|--------|
| 1 | Нет rate limiting на contact | `lib/rate-limit.ts` + LRU-cache, 5 req/min | `lib/rate-limit.ts`, `app/api/contact/route.ts` | ✅ |
| 2 | Нет валидации contact form | Zod schema `lib/validations/contact.ts` | `lib/validations/contact.ts` | ✅ |
| 3 | Нет CSRF/honeypot на contact | Honeypot field `website` + fake success | `app/api/contact/route.ts` | ✅ |
| 4 | SplitForms key в коде | Удалён SplitForms, собственный API | `app/api/contact/route.ts` | ✅ |
| 5 | Нет Telegram уведомлений | `lib/telegram.ts` + ContactMessage | `lib/telegram.ts` | ✅ |
| 6 | Нет аудита contact submissions | `ContactMessage` + `TelegramLog` models | `prisma/schema.prisma` | ✅ |
| 7 | Нет Zod на package-trainers | Zod schema на POST | `app/api/admin/package-trainers/route.ts` | ✅ |

### 9.2 Критичные проблемы безопасности (остаются)

| # | Проблема | Где | Риск | Решение | Сложность |
|---|----------|-----|------|---------|-----------|
| 1 | **Нет rate limiting на login** | `/api/auth/[...nextauth]` | Brute force атаки | `lru-cache` + middleware | Низкая |
| 2 | **Нет rate limiting на booking** | `POST /api/booking` | Спам бронирований | `checkRateLimit()` | Низкая |
| 3 | **Нет валидации входных данных** | `packages/`, `trainers/`, `reviews/` API | NaN, инъекции, 500 ошибки | Zod схемы | Низкая |
| 4 | **DELETE без проверки FK** | `packages/[id]`, `trainers/[id]` | 500 при активных бронированиях | Проверять `_count.bookings` | Низкая |
| 5 | **Нет rate limiting на admin APIs** | Все `/api/admin/*` | DoS, brute force админки | `checkRateLimit()` | Низкая |

### 9.3 Архитектурные проблемы (остаются)

| # | Проблема | Где | Риск | Решение |
|---|----------|-----|------|---------|
| 6 | **Денормализованный `rating`** | `Trainer.rating`, `Trainer.reviewCount` | Фейковые рейтинги | Считать агрегацией из `Review` |
| 7 | **`useEffect(fetch)` антипаттерн** | `trainers-list`, `trainer-profile`, admin | Лишние запросы, медленный TTI | Server Components + props |
| 8 | **Нет пагинации** | `/api/admin/bookings`, `/api/trainers` | OOM при росте | `skip`/`take` + `count` |
| 9 | **`unoptimized` Image** | Весь проект | Нет WebP/AVIF | Убрать prop, настроить domains |
| 10 | **Нет кэширования stats** | `/api/admin/stats` | 6 COUNT на каждый F5 | `unstable_cache` |
| 11 | **Prisma connection pool** | Supabase PostgreSQL | Таймауты при нагрузке | connection_limit=5, pool_timeout=20 |

### 9.4 UX/Производительность (остаются)

| # | Проблема | Где | Решение |
|---|----------|-----|---------|
| 12 | **Нет error.tsx и loading.tsx** | `app/admin/` | Добавить error boundaries |
| 13 | **Video scrubbing без fallback** | HeroSection | Добавить статичный poster |
| 14 | **Нет skeleton для RouteViz** | `route-visualization-v2.tsx` | Добавить SVG skeleton |

---

## 10. Что НЕ реализовано — Приоритеты для следующего агента

### P0 (Критично — блокирует production)

| # | Задача | Почему важно | Сложность | Решение |
|---|--------|-------------|-----------|---------|
| 1 | **Rate limiting на login** | Brute force на `/api/auth/[...nextauth]` | Низкая | `lru-cache` + middleware на auth routes |
| 2 | **Rate limiting на booking** | Спам бронирований | Низкая | `checkRateLimit()` в `POST /api/booking` |
| 3 | **Zod валидация всех API** | NaN, инъекции, 500 ошибки | Низкая | `lib/validations/` — package, trainer, review, document |
| 4 | **Email-уведомления** | Админ не получает email о бронях | Низкая | Resend (SMTP) — booking confirmations + admin alerts |
| 5 | **Telegram-уведомления о бронированиях** | Амин не видит новые брони в Telegram | Низкая | `sendBookingNotification()` в `lib/telegram.ts` |
| 6 | **Оплата (Stripe)** | Бронирования в статусе "pending" навсегда | Средняя | Stripe Checkout + Webhooks |

### P1 (Важно — UX и масштабируемость)

| # | Задача | Почему важно | Сложность |
|---|--------|-------------|-----------|
| 7 | **Рейтинг тренеров из отзывов** | Сейчас админ вручную вводит rating | Низкая |
| 8 | **Server-side pagination** | При 1000+ записей админка сломается | Низкая |
| 9 | **Server-first data fetching** | useEffect(fetch) антипаттерн везде | Средняя |
| 10 | **Image optimization** | unoptimized на всех `<Image>` | Низкая |
| 11 | **Error/loading states** | Нет error.tsx и loading.tsx в админке | Низкая |
| 12 | **unstable_cache для stats** | 6 COUNT на каждый F5 | Низкая |
| 13 | **Google Sheets sync для ContactMessage** | Админ видит заявки только в DB | Низкая |
| 14 | **3D Route Visualization (Mapbox)** | Table Mountain в 3D | Средняя |

### P2 (Желательно — полировка)

| # | Задача | Сложность |
|---|--------|-----------|
| 15 | **View Transitions API** | Низкая |
| 16 | **Parallax на остальных секциях** | Низкая |
| 17 | **Page transition loader** | Низкая |
| 18 | **i18n (RU/EN)** | ✅ Инфраструктура готова | Перевод всех страниц |
| 19 | **SEO + dynamic meta tags** | Низкая | + локализация meta |
| 20 | **S3/Supabase Storage** | Средняя |
| 21 | **Analytics (GA4/Plausible)** | Низкая |
| 22 | **PWA** | Средняя |
| 23 | **Telegram admin commands** | Низкая | /stats, /bookings, /contacts |

---

## 11. Архитектурные проблемы и решения

### 11.1 Критичные

| Проблема | Где | Риск | Решение |
|----------|-----|------|---------|
| Нет rate limit на login | `/api/auth/[...nextauth]` | Brute force | `lru-cache` + middleware |
| Нет rate limit на booking | `POST /api/booking` | Спам | `checkRateLimit()` |
| Денормализованный `rating` | `Trainer.rating`, `Trainer.reviewCount` | Фейковые рейтинги | Агрегация из `Review` |
| `DELETE` без проверки FK | `packages/[id]`, `trainers/[id]` | 500 при активных бронях | Проверять `_count.bookings` |
| Нет валидации входных данных | `packages/`, `trainers/`, `reviews/` API | NaN, инъекции | Zod схемы |
| Prisma connection pool | Supabase PostgreSQL | Таймауты | connection_limit=5, pool_timeout=20 |

### 11.2 Важные

| Проблема | Где | Риск | Решение |
|----------|-----|------|---------|
| `useEffect(fetch)` антипаттерн | `trainers-list`, `trainer-profile`, admin | Лишние запросы | Server Components + props |
| Нет пагинации | `/api/admin/bookings` | OOM | `skip`/`take` + `count` |
| `unoptimized` Image | Весь проект | Нет WebP/AVIF | Убрать prop |
| Нет кэширования stats | `/api/admin/stats` | 6 COUNT на F5 | `unstable_cache` |

---

## 12. Контекст для следующего ИИ-агента

### 12.1 Что НЕЛЬЗЯ делать

1. **Не удалять `lib/auth-helper.ts`** — используется в 6+ API файлах (`getAuthUser`)
2. **Не удалять `PrismaAdapter`** — безопасен, хоть и избыточен
3. **Не менять `auth.ts` радикально** — `Object.assign` — единственный рабочий способ с NextAuth v5 + strict TS
4. **Не удалять `app/api/admin/package-trainers/`** — используется страницей админки
5. **Не менять `globals.css` импорты** — `tailwindcss-animate` подключен через `tailwind.config.ts`
6. **Не удалять `components/effects/`** — wow effects используются на главной
7. **Не менять `hero-section-v2.tsx` без согласования** — сложная композиция WebGL + Video + Kinetic text
8. **Не удалять `lib/design-tokens.ts`** — централизованные токены используются новыми компонентами
9. **Не удалять `lib/telegram.ts`** — активно используется для contact notifications
10. **Не удалять `lib/rate-limit.ts`** — используется в contact API, планируется расширение
11. **Не удалять `lib/validations/contact.ts`** — активная Zod схема
12. **Не удалять `lib/sheets-sync.ts`** — Google Sheets sync для bookings и users

### 12.2 Что нужно знать о кодовой базе

- **TypeScript чистый**: `npx tsc --noEmit` = 0 ошибок
- **Сборка проходит**: `npm run build` = успешно, 17+ страниц
- **Schema обновлена**: `ContactMessage`, `TelegramLog`, `PackageTrainer`, `trainerId` в `Review`, `@@index([role])`
- **Миграция**: `npx prisma db push` (не `migrate deploy`)
- **Tailwind v3**: не v4, `tw-animate-css` удалён
- **NextAuth v5 beta**: `Object.assign(session.user, {...})` в `callbacks.session`
- **`dynamic = 'force-dynamic'`**: в `app/layout.tsx` и `app/(home)/page.tsx`
- **Wow effects**: WebGL (zero deps), Framer Motion
- **Trainers teaser**: Загружает `/api/trainers`, топ-4 по rating, glassmorphism cards
- **i18n**: next-intl, `/en/` + `/ru/`, messages/en.json + ru.json, LocaleSwitcher
- **Next.js 15.3**: `Promise<params>`, `await headers()`, `await cookies()`
- **Booking with trainer**: Полный флоу работает — от карточки тренера до Google Sheets
- **Contact form v2**: Zod + rate limit + honeypot + Telegram + DB persistence
- **Telegram bot**: Contact notifications работают, booking notifications — нет
- **Rate limiting**: Есть библиотека, применена только к contact
- **Checklist**: Авто-создание 10 дефолтных пунктов при первом входе
- **Database**: Supabase PostgreSQL с `@prisma/adapter-pg`
- **Google Sheets**: Bookings (A-L) + Users (A-G) синхронизируются, Contacts — нет
- **README на GitHub**: Устарел — говорит про Neon вместо Supabase, не упоминает Telegram, rate-limit, contact v2

### 12.3 Готовые шаблоны

**Server Component (fetch в Prisma):**
```tsx
import { prisma } from "@/lib/prisma";
export default async function Page() {
  const data = await prisma.model.findMany({...});
  return <ClientComponent initialData={data} />;
}
```

**Client Component (принимает initialData):**
```tsx
"use client";
export function Component({ initialData }: { initialData: Data[] }) {
  const [data] = useState(initialData);
  // фильтры/сортировка без fetch
}
```

**Zod валидация:**
```ts
import { z } from "zod";
export const schema = z.object({
  name: z.string().min(1).max(100),
  durationDays: z.coerce.number().int().min(1).max(365),
});
```

**Admin API с auth:**
```ts
import { auth } from "@/auth";
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  // ...
}
```

**Rate limiting:**
```ts
import { checkRateLimit } from "@/lib/rate-limit";
const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
if (!checkRateLimit(ip, 5)) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
```

**Telegram notification:**
```ts
import { sendTelegramMessage, sendContactNotification } from "@/lib/telegram";
await sendTelegramMessage(ADMIN_GROUP_ID, formattedText);
// или
await sendContactNotification({ name, email, phone, subject, message, createdAt });
```

**i18n Server Component:**
```tsx
import { getTranslations } from "next-intl/server";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return <h1>{t("title")}</h1>;
}
```

**i18n Client Component:**
```tsx
"use client";
import { useTranslations, useLocale } from "next-intl";
export function Component() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  return <Link href={`/${locale}/booking`}>{t("booking")}</Link>;
}
```

**Google Sheets sync:**
```ts
import { syncBookingToSheet, syncUserToSheet } from "@/lib/sheets-sync";
await syncBookingToSheet(booking, user, phone);
await syncUserToSheet(user);
```

### 12.4 Переменные окружения (.env)

```env
# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Auth
NEXTAUTH_SECRET="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL="..."
GOOGLE_PRIVATE_KEY="..."
GOOGLE_SHEET_ID_BOOKINGS="..."
GOOGLE_SHEET_ID_USERS="..."

# Telegram (✅ ОБЯЗАТЕЛЬНО — реализовано)
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_ADMIN_GROUP_ID="..."

# Добавить:
# RESEND_API_KEY="..."              # Email notifications
# STRIPE_SECRET_KEY="..."           # Payments
# STRIPE_WEBHOOK_SECRET="..."
# STRIPE_PUBLISHABLE_KEY="..."
# MAPBOX_ACCESS_TOKEN="..."         # 3D Route Visualization
```

---

## 13. Roadmap: Рекомендуемые следующие шаги

### Фаза 1: Security Foundation (2-3 часа)
- [ ] `lib/validations/` — zod схемы для Package, Trainer, Review, Document, Admin
- [ ] `lib/admin.ts` — `requireAdmin()` хелпер (унифицировать с `auth()`)
- [ ] Rate limiting на login (`lru-cache` + middleware на `/api/auth/`)
- [ ] Rate limiting на booking API (`checkRateLimit()`)
- [ ] Rate limiting на все admin APIs
- [ ] `error.tsx` + `loading.tsx` в каждый сегмент `app/admin/`

### Фаза 2: Notifications (2-3 часа)
- [ ] `lib/telegram.ts` — `sendBookingNotification()` — уведомление о новом бронировании
- [ ] Email через Resend — booking confirmation + contact acknowledgment
- [ ] Telegram admin commands — /stats, /bookings, /contacts
- [ ] Google Sheets sync для ContactMessage

### Фаза 3: Рейтинг тренеров (2-3 часа)
- [ ] `app/api/reviews/route.ts` — POST с проверкой booking + trainer
- [ ] Убрать ручной ввод `rating` из админки
- [ ] Пересчёт `Trainer.rating` при создании Review (агрегация)
- [ ] Обновить `app/api/trainers/[id]/route.ts` — включить `reviews`

### Фаза 4: 3D Route Visualization (4-6 часов)
- [ ] Mapbox GL JS с `terrain` слоем (Table Mountain в 3D)
- [ ] Маршрут — свечащийся trail с частицами
- [ ] Interactive checkpoints с elevation profile
- [ ] Parallax слои на скролле

### Фаза 5: Server-first рефактор (4-6 часов)
- [ ] `trainers-list`, `trainer-profile` → приём `initialData`
- [ ] Все admin компоненты → Server-first
- [ ] `unstable_cache` для dashboard stats
- [ ] Пагинация во все админские API (`skip`/`take` + `count`)

### Фаза 6: Production-ready (3-4 часа)
- [ ] Stripe Checkout для бронирований
- [ ] Убрать `unoptimized` с Image
- [ ] README update (Supabase, Telegram, актуальные фичи)
- [ ] Prisma connection pool tuning

### Фаза 7: Полировка (2-3 часа)
- [ ] View Transitions API между страницами
- [ ] Parallax на остальных секциях
- [ ] Page transition loader
- [ ] Magnetic buttons в навигации
- [ ] i18n (RU/EN)
- [ ] SEO + dynamic `generateMetadata`

---

## 14. О событии: Cape Town Marathon

### 14.1 Abbott World Marathon Majors

Abbott World Marathon Majors — серия из шести крупнейших марафонов мира:
- Tokyo Marathon
- Boston Marathon
- London Marathon
- Berlin Marathon
- Chicago Marathon
- New York City Marathon

**Cape Town Marathon** стал **первым кандидатом из Африки** на включение в эту престижную серию.

### 14.2 Концепция RUN & Travel

Платформа объединяет:
- **Подготовку** — тренировки с сертифицированными тренерами
- **Путешествие** — трансферы, экскурсии, сопровождение
- **Сообщество** — единомышленники, групповые тренировки
- **Сервис** — от аэропорта до финиша и обратно

---

*Спецификация подготовлена на основе аудита реальной кодовой базы GitHub: `shvykov81-ops/cape-town-marathon-2027`*  
**Сборка:** `npm run build` ✅ | **TypeScript:** `npx tsc --noEmit` ✅ | **Wow Effects:** Phase 1 ✅ | **Trainer Booking:** ✅ | **Contact Forms v2:** ✅ | **Telegram Bot:** ✅ | **Rate Limiting:** Partial ✅ | **Database:** Supabase PostgreSQL ✅ | **Дата аудита:** 2026-06-15


---

## 16. Обновление v6.3 (2026-06-17) — Remove Cursor Effects + Fix Booking Price

### 16.1 Что нового в v6.3

| # | Изменение | Причина |
|---|-----------|---------|
| 1 | **Удалены все курсорные эффекты** | Accessibility, CPU usage, mobile UX |
| 2 | **Исправлен расчёт цены бронирования** | Prisma Decimal → string в JSON, `+` делал конкатенацию вместо сложения |
| 3 | **Обновлены 8 файлов** | `app/(home)/page.tsx`, `app/globals.css`, `components/effects/*` (5 файлов), `app/booking/page.tsx` |
| 4 | **Добавлен `toNumber()` helper** | Безопасное преобразование Prisma Decimal/string/number → number |
| 5 | **MagneticButton → стандартные `<Link>`** | Сохранён hover, убран magnetic притягивание к курсору |
| 6 | **TiltCard → стандартные карточки** | Сохранён glassmorphism hover, убран 3D tilt + glare |
| 7 | **CustomCursor/MagneticCursor → `return null`** | Файлы сохранены для обратной совместимости импортов |

### 16.2 Сравнение v6.3 vs v6.4.1

| Аспект | v6.3 | v6.4.1 |
|--------|------|--------|
| Дата | 2026-06-17 | 2026-06-17 |
| i18n | ❌ Нет | ✅ EN/RU routing |
| URL | `/booking` | `/en/booking`, `/ru/booking` |
| Языки | EN only | EN + RU (nav/footer) |
| Страницы контент | EN | EN (хардкод) |
| Перевод компонентов | 0 | Инфраструктура готова |
| Missing pages | ❌ | ✅ Добавлены в nav |
| ru.json | ❌ | ✅ UTF-8 |

### 16.3 Новые проблемы, обнаруженные в v6.4

| # | Проблема | Статус | Решение |
|---|----------|--------|---------|
| 6 | **Account/Dashboard дублирование** | ⚠️ | `app/account/` vs `app/dashboard/` — уточнить назначение |
| 7 | **Document storage не документирован** | ⚠️ | Storage backend (S3/Supabase Storage?) не указан |
| 8 | **Blog admin panel — детали не ясны** | ⚠️ | Admin panel для BlogPost CRUD не документирована |
| 9 | **Review submission flow — не документирован** | ⚠️ | Кто может оставлять отзывы? Только после booking? |
| 10 | **Checklist default items — структура не ясна** | ⚠️ | Авто-создание 10 пунктов при первом входе, но какие именно? |
| 11 | **Страницы не полностью переведены** | ⚠️ | Hero, Booking, Contact, Trainers — хардкод-строки вместо `t()` |
| 12 | **SEO meta tags не локализованы** | ⚠️ | `generateMetadata` принимает locale, но не все страницы обновлены |
| 13 | **ru.json кодировка UTF-8** | ✅ ИСПРАВЛЕНО | Было CP1251, стало UTF-8 |

### 16.4 Исправленные проблемы (v6.3)

| # | Проблема | Было | Стало |
|---|----------|------|-------|
| 1 | **Booking price concatenation** | `$1000 + $500 = $1000500` | `$1000 + $500 = $1500` |
| 2 | **Custom cursor accessibility** | `cursor: none`, скрыт системный курсор | Системный курсор виден |
| 3 | **TrailCursor CPU usage** | Canvas 2D RAF loop на каждом кадре | Компонент удалён |
| 4 | **MagneticButton mobile** | Работал некорректно на touch | Стандартные кнопки |

### 16.4 Обновлённый Roadmap — Расширенные приоритеты

#### Фаза 6: Production-ready (3-4 часа)
- [ ] Stripe Checkout для бронирований
- [ ] Убрать `unoptimized` с Image
- [ ] README update (Supabase, Telegram, актуальные фичи)
- [ ] Prisma connection pool tuning
- [ ] Document upload storage (S3/Supabase Storage)
- [ ] Blog admin panel implementation
- [ ] Review submission flow documentation
- [ ] Account/Dashboard разделение

#### Фаза 7: Полировка (2-3 часа)
- [ ] View Transitions API между страницами
- [ ] Parallax на остальных секциях
- [ ] Page transition loader
- [ ] i18n (RU/EN)
- [ ] SEO + dynamic `generateMetadata`
- [ ] Analytics (GA4/Plausible)
- [ ] PWA

### 16.5 Обновлённые Critical Notes (16 пунктов)

Добавлены к существующим 12:

13. **Не удалять `lib/validations/booking.ts`** — Zod схема для booking form
14. **Не удалять `app/api/telegram/webhook/route.ts`** — Webhook handler для Telegram Bot
15. **Не удалять `components/telegram-button.tsx`** — Reusable Telegram CTA button
16. **Не удалять `components/icons/telegram-icon.tsx`** — SVG иконка Telegram
17. **Не удалять `toNumber()` в `app/booking/page.tsx`** — Критично для правильного расчёта цены (Prisma Decimal → number)
18. **Не удалять `i18n/config.ts`** — Локали и defaultLocale, используются в middleware и request.ts
19. **Не удалять `i18n/request.ts`** — getRequestConfig для next-intl, async headers/cookies
20. **Не удалять `messages/`** — Все переводы EN/RU
21. **Не удалять `components/locale-switcher.tsx`** — Переключатель языка
22. **Admin и API routes — БЕЗ locale** — Не перемещать в `app/[locale]/`
23. **Все ссылки — с `/${locale}/`** — Использовать `useLocale()` или хардкод префикс

---

---

## 17. Обновление v6.4 (2026-06-17) — i18n Интернационализация RU/EN

### 17.1 Что реализовано в v6.4

| # | Изменение | Причина |
|---|-----------|---------|
| 1 | **next-intl инфраструктура** | i18n для 30% русскоязычной аудитории |
| 2 | **Locale routing** | `/en/*` + `/ru/*`, redirect `/` → `/en/` |
| 3 | **Middleware обновлён** | Locale detection + cookie + rate limit + admin auth |
| 4 | **messages/en.json + ru.json** | Полные переводы всех секций |
| 5 | **LocaleSwitcher компонент** | Select EN/RU с сохранением в cookie |
| 6 | **Navigation переведена** | Все ссылки с `/${locale}/` префиксом |
| 7 | **Footer переведён** | Интерполяция года в copyright |
| 8 | **Admin без locale** | Остаётся только EN |
| 9 | **API без locale** | Как было, независимы от языка |
| 10 | **Next.js 15.3 fixes** | `Promise<params>`, `await headers()`, `await cookies()` |

### 17.2 Обновление v6.4.1 (2026-06-17) — Фиксы i18n

| # | Изменение | Причина |
|---|-----------|---------|
| 11 | **Добавлены отсутствующие страницы в Navigation** | cape-town-guide, prep-camp, race-week не были в шапке |
| 12 | **ru.json UTF-8 кодировка** | Файл создавался в CP1251, исправлено на UTF-8 |
| 13 | **getMessages({ locale })** | Передача locale в getMessages для загрузки правильного языка |
| 14 | **app/[locale]/layout.tsx** | Navigation + Footer перенесены в locale layout |
| 15 | **app/layout.tsx восстановлен** | Root layout с `<html>`/`<body>` обязателен в Next.js 15 |

### 17.2 Сравнение v6.3 vs v6.4

| Аспект | v6.3 | v6.4 |
|--------|------|------|
| i18n | ❌ Нет | ✅ next-intl |
| URL | `/booking` | `/en/booking`, `/ru/booking` |
| Языки | EN only | EN + RU |
| Middleware | Auth + rate limit | + Locale redirect |
| Перевод страниц | 0 | Инфраструктура готова, компоненты в процессе |

### 17.3 Известные проблемы (v6.4)

| # | Проблема | Статус | Решение |
|---|----------|--------|---------|
| 11 | **Страницы не полностью переведены** | ⚠️ | Нужно заменить хардкод-строки на `t()` в Hero, Booking, Contact, Trainers |
| 12 | **SEO meta tags не локализованы** | ⚠️ | `generateMetadata` принимает locale, но не все страницы обновлены |
| 13 | **Динамические маршруты** | ⚠️ | `/blog/[slug]`, `/trainers/[id]` — нужно проверить locale в ссылках |

---

*Спецификация подготовлена на основе аудита реальной кодовой базы GitHub: `shvykov81-ops/cape-town-marathon-2027`*  
**Сборка:** `npm run build` ✅ | **TypeScript:** `npx tsc --noEmit` ✅ | **Wow Effects:** Phase 1 (no cursor) ✅ | **Trainer Booking:** ✅ | **Contact Forms v2:** ✅ | **Telegram Bot v2:** ✅ | **Booking Notifications:** ✅ | **Rate Limiting:** Partial ✅ | **Booking Price Fix:** ✅ | **i18n:** Infrastructure + Nav/Footer RU ✅ | **Database:** Supabase PostgreSQL ✅ | **Дата:** 2026-06-17
