# TECHNICAL SPECIFICATION v6.5.1
## Cape Town Marathon 2027 — RUN & Travel Platform

**Date:** 2026-06-19
**Status:** i18n Translation Phase — Active Development
**Last Updated By:** Lead Platform Architect

---

## 1. PROJECT OVERVIEW

High-performance Next.js 15 platform for Africa's first Abbott World Marathon Majors candidate. The site serves as both a marketing showcase and a functional booking platform for the marathon prep camp experience.

**Production URL:** https://cape-town-marathon-2027.vercel.app
**Repository:** https://github.com/shvykov81-ops/cape-town-marathon-2027

---

## 2. ARCHITECTURE STACK

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 15.1.3 (App Router) |
| Language | TypeScript | ^5.7.2 |
| Styling | Tailwind CSS | ^3.4.17 |
| UI Components | shadcn/ui | ^2.1.8 |
| Animation | Framer Motion | ^12.4.7 |
| Icons | Lucide React | ^0.460.0 |
| Auth | NextAuth.js | ^5.0.0-beta.25 |
| ORM | Prisma | ^6.3.1 |
| Database | PostgreSQL (Neon) | — |
| i18n | next-intl | ^4.0.2 |
| Forms | React Hook Form | ^7.54.2 |
| Validation | Zod | ^3.24.2 |
| Deployment | Vercel | — |

---

## 3. PROJECT STRUCTURE

```
├── app/
│   ├── [locale]/                    # i18n routing: /en/*, /ru/*
│   │   ├── (home)/                  # Landing page sections
│   │   │   ├── page.tsx             # Hero, features, route, newsletter, prep-camp teaser
│   │   │   ├── stats-section.tsx
│   │   │   ├── route-visualization.tsx
│   │   │   ├── prep-camp-teaser.tsx
│   │   │   └── newsletter-section.tsx
│   │   ├── about-race/              # ✅ Translated
│   │   ├── prep-camp/               # ✅ Translated
│   │   ├── race-week/               # ✅ Translated
│   │   ├── cape-town-guide/         # ✅ Translated (FIXED: Droplets in iconMap)
│   │   ├── trainers/
│   │   │   ├── page.tsx             # ✅ Translated
│   │   │   └── [id]/page.tsx        # ✅ Translated
│   │   ├── pricing/                 # ✅ Translated (FIXED: HeartPulse→Heart)
│   │   ├── blog/                    # ✅ Translated (NEW: Server Component + t.raw())
│   │   ├── contact/                 # ⚠️ Partial (nav/footer only, form hardcoded)
│   │   ├── booking/                 # ⚠️ NOT translated (all UI hardcoded)
│   │   ├── dashboard/               # ⚠️ NOT translated (dates, labels hardcoded)
│   │   ├── faq/                     # ⚠️ Status unknown
│   │   ├── terms/                   # ⚠️ Status unknown
│   │   ├── account/                 # ⚠️ Status unknown
│   │   └── layout.tsx               # Root layout with i18n provider
│   ├── admin/                       # Admin panel (EN only, no i18n)
│   ├── api/                         # API routes (no locale)
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── navigation.tsx               # ✅ Fully translated
│   ├── footer.tsx                   # ✅ Fully translated
│   ├── locale-switcher.tsx          # ✅ Works
│   ├── effects/                     # ⚠️ Partial (glassmorphism-card, trainers-teaser hardcoded)
│   └── trainers/
│       ├── trainer-profile.tsx      # ✅ Translated
│       └── trainers-list.tsx        # ✅ Translated
├── messages/
│   ├── en.json                      # All namespaces (including pricing, blog)
│   └── ru.json                      # All namespaces (including pricing, blog)
├── i18n/
│   ├── config.ts                    # { locales: ['en', 'ru'], defaultLocale: 'en' }
│   └── request.ts                   # getRequestConfig with messages import
├── middleware.ts                    # Locale detection, cookie, redirect
├── auth.ts                          # NextAuth config (Credentials + Google)
├── lib/
│   ├── db.ts                        # Prisma singleton
│   └── validations/                 # Zod schemas
├── prisma/
│   └── schema.prisma                # User, Booking, Trainer, ContactMessage
└── next.config.js                   # i18n domains, images, redirects
```

---

## 4. I18N ARCHITECTURE (v6.5)

### 4.1 Routing
```
/en/*     → English
/ru/*     → Russian
/         → Redirects to /en (cookie-based or Accept-Language)
```

### 4.2 Middleware Logic
- Edge middleware detects locale from cookie → Accept-Language → default
- Redirects `/` → `/{locale}`
- Rewrites `/{locale}/*` to `/*` internally
- API routes and `/admin/*` bypass locale handling

### 4.3 Translation Patterns

**Server Components (async):**
```tsx
import { getTranslations } from "next-intl/server";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pageName" });
  return <h1>{t("title")}</h1>;
}
```

**Client Components ("use client"):**
```tsx
"use client";
import { useTranslations } from "next-intl";

export function Component() {
  const t = useTranslations("pageName");
  return <button>{t("cta")}</button>;
}
```

**Dynamic Arrays via `t.raw()`:**
```tsx
const features = t.raw("tiers.starter.features") as string[];
// features = ["Race entry bib", "Airport transfer", ...]
```

### 4.4 Namespaces (Complete)

| Namespace | EN | RU | Status | Used By |
|-----------|-----|-----|--------|---------|
| metadata | ✅ | ✅ | Ready | layout.tsx |
| navigation | ✅ | ✅ | **Active** | Navigation.tsx |
| hero | ✅ | ✅ | **Active** | HeroSection v2 |
| features | ✅ | ✅ | **Active** | GlassmorphismFeatureCard |
| trainers | ✅ | ✅ | **Active** | TrainersTeaser |
| booking | ✅ | ✅ | Ready | Booking page (⚠️ not yet connected) |
| contact | ✅ | ✅ | Ready | Contact page (⚠️ partial) |
| footer | ✅ | ✅ | **Active** | Footer.tsx |
| locale | ✅ | ✅ | **Active** | LocaleSwitcher |
| aboutRace | ✅ | ✅ | **Active** | About Race page |
| prepCampPage | ✅ | ✅ | **Active** | Prep Camp page |
| prepCamp | ✅ | ✅ | Ready | PrepCampTeaser |
| raceWeek | ✅ | ✅ | **Active** | Race Week page |
| trainersPage | ✅ | ✅ | **Active** | Trainers page |
| capeTownGuide | ✅ | ✅ | **Active** | Cape Town Guide page |
| route | ✅ | ✅ | Ready | RouteVisualization |
| **pricing** | ✅ | ✅ | **Active** | **Pricing page (NEW)** |
| **blog** | ✅ | ✅ | **Active** | **Blog page (NEW)** |

---

## 5. CRITICAL FIXES APPLIED (v6.4 → v6.5.1)

### 5.1 Cape Town Guide — `Droplets` iconMap Fix
**File:** `app/[locale]/cape-town-guide/page.tsx`
**Problem:** `Droplets` imported from `lucide-react` but missing from `iconMap`
**Error:** `Element type is invalid: expected string/class/function but got: undefined`
**Fix:** Added `Droplets` to `iconMap` object

### 5.2 Pricing Page — `HeartPulse` Icon Fix
**File:** `app/[locale]/pricing/page.tsx`
**Problem:** `HeartPulse` icon does not exist in `lucide-react@^0.460.0`
**Error:** Same `undefined` component error
**Fix:** Replaced `HeartPulse` with `Heart` (verified in v0.460)

### 5.3 Pricing Page — Full i18n Translation
**File:** `app/[locale]/pricing/page.tsx` + `messages/*.json`
**Changes:**
- Converted from hardcoded data to `useTranslations("pricing")`
- Moved `tiers`, `trustBadges`, `groupCalculator` to JSON
- Features rendered via `t.raw()` array iteration
- Prices kept as constants in component (don't change per locale)

### 5.4 Blog Page — Full i18n Translation
**File:** `app/[locale]/blog/page.tsx` + `messages/*.json`
**Changes:**
- Converted from hardcoded `posts` array to Server Component with `getTranslations`
- Posts data moved to `messages/*.json` as `blog.posts` array
- Date formatting uses locale-aware `toLocaleDateString()`
- Featured post + grid dynamically rendered from JSON

---

## 6. TRANSLATION STATUS MATRIX

| Page/Component | EN | RU | Pattern | Notes |
|----------------|-----|-----|---------|-------|
| Navigation | ✅ | ✅ | Client `useTranslations` | Complete |
| Footer | ✅ | ✅ | Client `useTranslations` | Complete |
| Hero Section | ✅ | ✅ | Client `useTranslations` | Complete |
| Features Card | ⚠️ | ⚠️ | Ready in JSON, not connected | Hardcoded in component |
| Trainers Teaser | ⚠️ | ⚠️ | Ready in JSON, not connected | Hardcoded in component |
| Newsletter | ⚠️ | ⚠️ | Ready in JSON, not connected | Status unknown |
| Route Viz | ⚠️ | ⚠️ | Ready in JSON, not connected | Check checkpoints |
| **About Race** | ✅ | ✅ | Server `getTranslations` | Complete |
| **Prep Camp** | ✅ | ✅ | Server `getTranslations` | Complete |
| **Race Week** | ✅ | ✅ | Server `getTranslations` | Complete |
| **Cape Town Guide** | ✅ | ✅ | Client `useTranslations` | Complete (FIXED) |
| **Trainers List** | ✅ | ✅ | Client `useTranslations` | Complete |
| **Trainer Profile** | ✅ | ✅ | Client `useTranslations` | Complete |
| **Pricing** | ✅ | ✅ | Client `useTranslations` | Complete (FIXED) |
| **Blog** | ✅ | ✅ | Server `getTranslations` | Complete |
| Contact Form | ⚠️ | ⚠️ | Ready in JSON, not connected | Hardcoded strings |
| Booking | ❌ | ❌ | JSON ready, not connected | All UI hardcoded |
| Dashboard | ❌ | ❌ | No namespace yet | Dates, labels hardcoded |

---

## 7. REMAINING WORK (v6.6 Target)

### 7.1 High Priority (P0)
1. **Booking Page Translation**
   - File: `app/[locale]/booking/page.tsx`
   - Complexity: High (~500 lines, mixed server/client)
   - Recommendation: Split into sub-components
   - Keys needed: All step labels, placeholders, buttons, success/error messages

2. **Contact Form Translation**
   - File: `app/[locale]/contact/sections/contact-form-section.tsx`
   - Complexity: Low
   - Add `useTranslations("contact")`, replace hardcoded strings

### 7.2 Medium Priority (P1)
3. **Effects Components**
   - `glassmorphism-feature-card.tsx` → `useTranslations("features")`
   - `trainers-teaser.tsx` → `useTranslations("trainers")`

4. **Dashboard Translation**
   - Create `dashboard` namespace
   - Translate: guest/guests (pluralization), dates, labels
   - Replace `toLocaleDateString('en-GB')` with `useFormatter()`

5. **Newsletter & PrepCampTeaser**
   - Verify current state, connect to existing JSON namespaces

### 7.3 Low Priority (P2)
6. **Route Visualization** — Check checkpoint labels for hardcoded strings
7. **Validation Messages** — Translate Zod error messages in `lib/validations/`
8. **SEO Metadata** — Ensure all pages have translated `generateMetadata`

---

## 8. SECURITY & INFRASTRUCTURE (Still Pending)

| Priority | Task | Risk |
|----------|------|------|
| P0 | Rate limiting on `/api/auth/[...nextauth]` | Brute force |
| P0 | Rate limiting on `POST /api/booking` | Spam bookings |
| P0 | Zod validation on all API routes | Injection, 500 errors |
| P1 | Email notifications (Resend) | Admin alerts |
| P1 | Telegram notifications for bookings | Admin visibility |
| P1 | Server-first data fetching | Performance |
| P2 | Stripe Checkout | Payments |

---

## 9. LESSONS LEARNED

1. **IconMap Pattern Risk:** When using dynamic icon lookup (`iconMap[name]`), always verify every imported icon is registered in the map. Missing entries cause `undefined` component errors.

2. **Lucide React Version Compatibility:** Before using any icon, verify it exists in the installed version (`^0.460.0`). Use `npx lucide-react-list` or check source.

3. **Git Rebase & JSON Files:** JSON namespace files are prone to conflicts during rebase. Always verify namespaces are preserved after merge/rebase operations.

4. **t.raw() for Arrays:** next-intl v4 supports arrays via `t.raw("key")` — use this for features, posts, lists instead of indexed keys.

5. **Server vs Client Components:** Server Components use `getTranslations()` (async), Client Components use `useTranslations()` (hook). Never mix patterns in the same component.

---

## 10. CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| v6.4.0 | 2026-06-17 | i18n infrastructure, nav/footer translated |
| v6.4.1 | 2026-06-17 | TECH_SPEC created, UTF-8 fix for ru.json |
| v6.5.0 | 2026-06-18 | Cape Town Guide translated, Droplets fix |
| v6.5.1 | 2026-06-19 | Pricing translated (HeartPulse→Heart fix), Blog translated, spec updated |

---

*Document maintained by Lead Platform Architect. For continuation, next agent should reference this spec and the GitHub repository.*
