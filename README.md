# Cape Town Marathon 2027 — RUN & Travel Platform

**Africa's first Abbott World Marathon Majors Candidate** — Next.js 15 + React 19 + TypeScript + Tailwind CSS + Prisma + Supabase PostgreSQL

🔗 **Production:** [cape-town-marathon-2027.vercel.app](https://cape-town-marathon-2027.vercel.app)

---

## 📋 What's Inside

| Feature | Status | Details |
|---------|--------|---------|
| **17+ Pages** | ✅ | Full marathon website with App Router |
| **Wow Effects** | ✅ | WebGL grain, Kinetic typography, 3D tilt cards, Trail cursor, Scroll video |
| **Booking System** | ✅ | 5-step wizard with trainer selection, calculator, Google Sheets sync |
| **Trainer Profiles** | ✅ | Book with trainer, ratings, reviews, Google Sheets integration |
| **Contact Forms v2** | ✅ | Zod validation, rate limiting, honeypot, Telegram notifications, DB persistence |
| **Telegram Bot** | ✅ | Admin notifications for contacts & bookings, webhook handler |
| **Admin Dashboard** | ✅ | Bookings, packages, trainers, documents, stats |
| **Google Sheets Sync** | ✅ | Bookings (A-L) + Users (A-G) auto-sync |
| **Auth** | ✅ | NextAuth v5 (beta) + Credentials provider + bcryptjs |
| **Database** | ✅ | Supabase PostgreSQL + Prisma ORM + @prisma/adapter-pg |
| **Blog** | ✅ | With admin panel via Prisma |
| **Account** | ✅ | Checklist, documents, bookings dashboard |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([nodejs.org](https://nodejs.org))
- **Git** ([git-scm.com](https://git-scm.com))

### 1. Clone & Install

```bash
git clone https://github.com/shvykov81-ops/cape-town-marathon-2027.git
cd cape-town-marathon-2027
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

**Critical env variables:**
- `DATABASE_URL` — Supabase PostgreSQL connection (with `pgbouncer=true&connection_limit=5`)
- `DIRECT_URL` — Direct Supabase connection (port 5432)
- `NEXTAUTH_SECRET` — Random 32+ char string for JWT signing
- `TELEGRAM_BOT_TOKEN` — From @BotFather
- `TELEGRAM_ADMIN_GROUP_ID` — Telegram group/chat ID for admin notifications
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — Google Sheets service account
- `GOOGLE_PRIVATE_KEY` or `GOOGLE_PRIVATE_KEY_BASE64` — Service account key (Base64 recommended for Vercel)
- `GOOGLE_SHEET_ID_BOOKINGS` — Google Sheet ID for bookings
- `GOOGLE_SHEET_ID_USERS` — Google Sheet ID for users

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🌐 Deploy to Vercel

```bash
git add .
git commit -m "Ready for deploy"
git push origin main
```

1. Go to [vercel.com](https://vercel.com), import your repo
2. Add all environment variables from `.env` in **Settings → Environment Variables**
3. Deploy

---

## 📁 Project Structure

```
cape-town-marathon-2027/
├── app/
│   ├── (home)/                    # Homepage with wow effects
│   ├── about-race/
│   ├── account/                   # User dashboard (bookings, checklist, docs)
│   ├── admin/                     # Admin panel (bookings, packages, trainers, docs)
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth v5 beta
│   │   ├── booking/               # Booking creation (Zod + rate limit + Telegram + Sheets)
│   │   ├── bookings/              # User bookings list
│   │   ├── contact/               # Contact form v2 (Zod + rate limit + honeypot + Telegram + DB)
│   │   ├── admin/                 # Admin APIs (bookings, packages, trainers, docs, stats)
│   │   ├── trainers/              # Public trainer APIs
│   │   ├── packages/              # Public package APIs
│   │   ├── reviews/               # Reviews API
│   │   ├── checklist/             # Auto-create default checklist
│   │   ├── documents/             # Document upload API
│   │   └── telegram/webhook/      # Telegram bot webhook handler
│   ├── blog/[slug]/
│   ├── booking/                   # Booking page (reads trainer from URL)
│   ├── contact/                   # Contact v2 (Telegram-only, no email)
│   ├── dashboard/                 # User bookings dashboard
│   ├── trainers/                  # Trainer listing + detail pages
│   ├── pricing/
│   ├── prep-camp/
│   ├── cape-town-guide/
│   ├── race-week/
│   ├── terms/ | privacy/ | refund/ | cookies/
│   ├── globals.css                # Clean, no duplication, custom cursor styles
│   ├── layout.tsx                 # dynamic = 'force-dynamic', Inter font
│   └── providers.tsx
├── components/
│   ├── admin/
│   │   └── bookings-table.tsx     # Admin bookings table with Trainer column
│   ├── effects/                   # Wow effects + design tokens
│   │   ├── webgl-grain.tsx
│   │   ├── kinetic-typography.tsx
│   │   ├── scroll-video.tsx
│   │   ├── interactive-elements.tsx (Magnetic, Trail, Tilt)
│   │   ├── preloader.tsx
│   │   ├── hero-section-v2.tsx
│   │   ├── route-visualization-v2.tsx
│   │   ├── trainers-teaser.tsx
│   │   ├── glassmorphism-feature-card.tsx
│   │   ├── ambient-background.tsx
│   │   ├── kinetic-section-title.tsx
│   │   └── animated-counter.tsx
│   ├── trainers/
│   │   ├── trainer-profile.tsx    # Links to /booking?trainer=ID
│   │   └── trainers-list.tsx
│   ├── navigation.tsx
│   ├── footer.tsx                 # No email, Telegram CTA
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── auth-helper.ts             # ⚠️ DO NOT DELETE — getAuthUser, used in 6+ APIs
│   ├── prisma.ts                  # Prisma client singleton
│   ├── design-tokens.ts           # Centralized design tokens
│   ├── sheets-sync.ts             # Google Sheets sync (bookings + users)
│   ├── telegram.ts                # Telegram Bot API wrapper
│   ├── rate-limit.ts              # LRU-cache rate limiter
│   ├── google-sheets.ts           # Google Sheets API wrapper
│   ├── validations/               # Zod schemas
│   │   ├── contact.ts             # Contact form schema
│   │   ├── booking.ts             # Booking schema
│   │   └── [package.ts, trainer.ts, review.ts, document.ts — TODO]
│   └── utils.ts
├── prisma/
│   ├── schema.prisma              # Full schema (User, Booking, Package, Trainer, Review, ContactMessage, TelegramLog, etc.)
│   └── seed.ts
├── public/
│   ├── images/
│   └── videos/hero.mp4
├── auth.ts                        # NextAuth v5 config
├── middleware.ts                  # NextAuth middleware (⚠️ rate limit NOT applied here yet)
├── tailwind.config.ts             # Tailwind v3 with custom colors, shadows, animations
├── next.config.js
└── package.json
```

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 15.3.8 (App Router) |
| React | React | 19 |
| Language | TypeScript | 5.7 |
| Styling | Tailwind CSS | 3.4.17 |
| UI | shadcn/ui | Radix UI components |
| Animations | Framer Motion | 11.18.2 |
| Auth | NextAuth v5 | beta.31 |
| ORM | Prisma | 6.0.0 + @prisma/adapter-pg |
| Database | Supabase PostgreSQL | |
| Icons | Lucide React | 0.460.0 |
| Search | Fuse.js | 7.4.2 |
| Validation | Zod | 3.24.0 |
| Rate Limit | lru-cache | 11.5.1 |
| Notifications | Telegram Bot API | |
| Sheets | Google Sheets API | |
| Deployment | Vercel | |

### Wow Effects (Zero External Deps for WebGL/Canvas)

| Effect | Implementation | Dependencies |
|--------|---------------|--------------|
| Film Grain | Pure WebGL API | Zero |
| Kinetic Text | Custom split-flap | Zero |
| Trail Cursor | Canvas 2D | Zero |
| 3D Tilt | CSS perspective + preserve-3d | Zero |
| Scroll Video | Framer Motion useScroll | Framer Motion |
| Magnetic Button | Framer Motion useMotionValue | Framer Motion |
| Route Viz | SVG pathLength animation | Zero |

---

## 🔐 Security Status

| Check | Status | Note |
|-------|--------|------|
| TypeScript (`npx tsc --noEmit`) | ✅ 0 errors | Clean |
| Build (`npm run build`) | ✅ Success | 17+ pages, 20+ API routes |
| Contact form Zod validation | ✅ | `lib/validations/contact.ts` |
| Contact form rate limiting | ✅ | 5 req/min per IP |
| Contact form honeypot | ✅ | Hidden `website` field |
| Booking Zod validation | ✅ | `lib/validations/booking.ts` |
| Login rate limiting | ❌ **MISSING** | Brute force risk |
| Booking rate limiting | ❌ **MISSING** | Spam booking risk |
| Admin API rate limiting | ❌ **MISSING** | DoS risk |
| Package/Trainer/Review Zod | ❌ **MISSING** | Injection/NaN risk |
| DELETE FK check | ❌ **MISSING** | 500 on active bookings |

**⚠️ CRITICAL:** Rate limiting and Zod validation are only applied to `POST /api/contact` and `POST /api/booking`. All other APIs are unprotected.

---

## 🎯 Current Features Detail

### Booking with Trainer

```
/trainers/[id] → "Book with Name" button → /booking?trainer=ID
                                      ↓
                    Form reads trainerId from URL → Loads trainer data
                                      ↓
                    Shows badge + trainer card in Order Summary
                                      ↓
                    POST /api/booking → Dashboard → Admin → Google Sheets
```

### Contact Form v2 (Telegram-Only)

- No email field in UI — all communication via Telegram
- Zod validation for name, email (hidden), phone, subject, message
- Rate limit: 5 requests/minute per IP
- Honeypot field (`website`) — must be empty
- Telegram notification to admin group
- DB persistence in `ContactMessage` table
- Audit trail in `TelegramLog` table

### Telegram Bot Architecture

```
Contact Form → sendContactNotification() → Admin Group
Booking      → sendBookingNotification() → Admin Group
User Message → Webhook Handler → FAQ / Admin Forward
```

**Env vars:**
- `TELEGRAM_BOT_TOKEN` — From @BotFather
- `TELEGRAM_ADMIN_GROUP_ID` — Group/chat ID for notifications
- `NEXT_PUBLIC_TELEGRAM_GROUP_URL` — Public group link for CTA

### Google Sheets Integration

| Sheet | Columns | Status |
|-------|---------|--------|
| Bookings | A: ID, B: Date, C: Email, D: Name, E: Package ID, F: Dates, G: Guests, H: Price, I: Status, J: Phone, K: Trainer Name, L: Trainer ID | ✅ Synced |
| Users | A: ID, B: Date, C: Email, D: Name, E: Phone, F: Nationality, G: Telegram ID | ✅ Synced |
| Contacts | — | ❌ Not implemented |

**⚠️ Known Issue:** `GOOGLE_PRIVATE_KEY` may fail on Vercel due to newline escaping. Use `GOOGLE_PRIVATE_KEY_BASE64` instead (base64-encoded key).

---

## 🚨 Known Issues & Next Steps

### P0 (Critical — Block Production)

1. **Rate limiting on ALL APIs** — Currently only contact is protected. Login, booking, admin APIs are open.
2. **Zod validation on ALL APIs** — packages, trainers, reviews, documents POST endpoints accept any input.
3. **Google Sheets Base64 fix** — `GOOGLE_PRIVATE_KEY` fails on Vercel. Implement `GOOGLE_PRIVATE_KEY_BASE64`.
4. **DELETE with FK check** — Deleting package/trainer with active bookings causes 500.
5. **Stripe integration** — Bookings stay in "pending" forever. Need payment flow.

### P1 (Important — UX & Scale)

6. **Email notifications** — Add Resend for booking confirmations and contact acknowledgments.
7. **Server-side pagination** — Admin tables will break at 1000+ records.
8. **Computed trainer rating** — Remove manual rating input, calculate from `Review` aggregate.
9. **Image optimization** — Remove `unoptimized` prop from `<Image>`, configure domains.
10. **Error/loading boundaries** — Add `error.tsx` and `loading.tsx` to admin segments.
11. **Prisma connection pool** — Increase `connection_limit` from 1 to 5-10.
12. **Cache for stats** — `unstable_cache` for `/api/admin/stats` (6 COUNT queries per request).

### P2 (Polish — Growth)

13. **3D Route Visualization** — Mapbox GL JS with Table Mountain terrain.
14. **View Transitions API** — Smooth page transitions.
15. **i18n (RU/EN)** — Russian-speaking audience is ~30% of traffic.
16. **SEO + dynamic meta tags** — Google indexing, social sharing.
17. **Analytics** — Plausible or GA4 for funnel tracking.
18. **PWA** — Offline-first, push notifications.

---

## 📝 Environment Variables Reference

```env
# ==========================================
# DATABASE (Supabase PostgreSQL)
# ==========================================
# Use Supabase Connection Pooler (port 6543) for serverless
# Add pgbouncer=true and connection_limit=5 for Prisma + serverless
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5&pool_timeout=20"
# Direct connection (port 5432) for migrations
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# ==========================================
# AUTH (NextAuth v5 beta)
# ==========================================
NEXTAUTH_SECRET="your-random-32-char-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"

# ==========================================
# TELEGRAM BOT (Required)
# ==========================================
TELEGRAM_BOT_TOKEN="1234567890:ABC..."
TELEGRAM_ADMIN_GROUP_ID="-1001234567890"
NEXT_PUBLIC_TELEGRAM_GROUP_URL="https://t.me/your_channel"

# ==========================================
# GOOGLE SHEETS (Required)
# ==========================================
GOOGLE_SERVICE_ACCOUNT_EMAIL="service-account@project.iam.gserviceaccount.com"
# Option A: Raw key (may fail on Vercel due to newlines)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n"
# Option B: Base64-encoded key (RECOMMENDED for Vercel)
GOOGLE_PRIVATE_KEY_BASE64="base64-encoded-key-here"
GOOGLE_SHEET_ID_BOOKINGS="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
GOOGLE_SHEET_ID_USERS="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

# ==========================================
# OPTIONAL (Future Features)
# ==========================================
# RESEND_API_KEY="re_..."                    # Email notifications
# STRIPE_SECRET_KEY="sk_..."                 # Payments
# STRIPE_WEBHOOK_SECRET="whsec_..."          # Stripe webhooks
# STRIPE_PUBLISHABLE_KEY="pk_..."            # Frontend Stripe
# MAPBOX_ACCESS_TOKEN="pk.eyJ1..."          # 3D Route Visualization
```

---

## 🧪 Useful Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npx prisma studio        # GUI database browser
npx prisma db push       # Push schema changes (no migrations)
npx prisma db seed       # Seed test data
npx tsc --noEmit         # TypeScript check (0 errors expected)
```

---

## ⚠️ Critical Notes for AI Agents / New Developers

1. **DO NOT DELETE `lib/auth-helper.ts`** — `getAuthUser` is used in 6+ API files.
2. **DO NOT DELETE `lib/telegram.ts`** — Active notifications system.
3. **DO NOT DELETE `lib/rate-limit.ts`** — Used in contact API, planned for all APIs.
4. **DO NOT DELETE `lib/validations/contact.ts`** — Active Zod schema.
5. **DO NOT DELETE `lib/sheets-sync.ts`** — Active Google Sheets integration.
6. **DO NOT DELETE `lib/design-tokens.ts`** — Used by new components.
7. **DO NOT RADICALLY CHANGE `auth.ts`** — `Object.assign(session.user, {...})` is the only working pattern with NextAuth v5 + strict TS.
8. **DO NOT DELETE `app/api/admin/package-trainers/`** — Used by admin page.
9. **DO NOT DELETE `components/effects/`** — Wow effects used on homepage.
10. **DO NOT CHANGE `hero-section-v2.tsx` WITHOUT COORDINATION** — Complex WebGL + Video + Kinetic composition.
11. **Tailwind v3** — Not v4. `tw-animate-css` was removed.
12. **`dynamic = 'force-dynamic'`** — Set in `app/layout.tsx` and `app/(home)/page.tsx`.
13. **NextAuth v5 beta** — `Object.assign` in `callbacks.session` is required.
14. **Schema updates** — Use `npx prisma db push`, not `npx prisma migrate deploy`.
15. **Database** — Supabase PostgreSQL with `@prisma/adapter-pg`, NOT Neon.

---

## 📞 Support

If something doesn't work:

1. Check Node.js version: `node -v` (should be v18+)
2. Delete `node_modules` and `package-lock.json`, then `npm install`
3. Check `.env` — all variables from `.env.example` must be filled
4. Verify Supabase connection string format (pgbouncer + connection_limit)
5. Check Vercel logs for specific errors

---

**Built with ❤️ for Cape Town Marathon 2027** 🏃‍♂️🏔️

*Last updated: 2026-06-16 | Based on Technical Specification v6.1 & Roadmap v7*
