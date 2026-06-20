# TECHNICAL SPECIFICATION v7.2.0
## Cape Town Marathon 2027 — RUN & Travel Platform
## Trainer Self-Service Profiles & Public Listing Redesign

**Date:** 2026-06-20
**Status:** ALL PHASES DELIVERED — Production Ready
**Parent Spec:** TECHNICAL_SPECIFICATION_v6.5.1.md
**Last Updated By:** Lead Platform Architect

---

## 1. DELIVERY RULES (v7.2.0)

| Rule | Description |
|------|-------------|
| **Format** | ZIP archive with correct project folder structure |
| **Structure** | Files placed in actual project paths (`prisma/`, `lib/`, `app/`, `components/` etc.) |
| **Extraction** | User extracts ZIP into project root — files auto-land in correct folders |
| **No Manual Steps** | All code is copy-paste ready. No "create file X and paste Y" instructions |
| **Include Guide** | Each phase ZIP includes `MIGRATION_GUIDE.md` with exact terminal commands |
| **Git Ready** | After extracting + running commands, user commits and pushes to GitHub |

---

## 2. PROJECT STATUS

**ALL 6 PHASES DELIVERED AND DEPLOYED**

| Phase | Status | Date | Description |
|-------|--------|------|-------------|
| Phase 1 | ✅ DELIVERED | 2026-06-20 | Database Migration (Prisma schema, enums, audit log) |
| Phase 2 | ✅ DELIVERED | 2026-06-20 | API Layer (17 endpoints: trainer self-service + admin + public) |
| Phase 3 | ✅ DELIVERED | 2026-06-20 | Public Listing (Bento Grid, individual profile pages, SEO) |
| Phase 4 | ✅ DELIVERED | 2026-06-20 | Trainer Dashboard (5 pages: overview, profile, photos, calendar, settings) |
| Phase 5 | ✅ DELIVERED | 2026-06-20 | Admin Moderation (status filters, moderation actions, diff viewer, history) |
| Phase 6 | ✅ DELIVERED | 2026-06-20 | i18n & Polish (error boundaries, skeletons, full EN/RU translations) |

**Production URL:** https://cape-town-marathon-2027.vercel.app
**Repository:** https://github.com/shvykov81-ops/cape-town-marathon-2027

---

## 3. CURRENT STATE (v7.2.0)

### 3.1 Database
- PostgreSQL + Prisma 6.19.3
- Trainer model with workflow statuses (DRAFT, PENDING, PUBLISHED, REJECTED, SUSPENDED)
- TrainerProfileChange audit log model
- TrainerAvailability calendar model
- User-Trainer 1:1 relation
- All slugs generated and seeded

### 3.2 API Endpoints

**Trainer Self-Service (8 endpoints):**
- GET/PATCH /api/trainer/me
- POST /api/trainer/me/submit
- POST/DELETE /api/trainer/me/photos
- GET /api/trainer/me/stats
- GET/POST /api/trainer/me/availability

**Admin Moderation (6 endpoints):**
- GET /api/admin/trainers
- GET /api/admin/trainers/pending
- PATCH /api/admin/trainers/[id]/moderate
- GET /api/admin/trainers/[id]/history
- PUT /api/admin/trainers/[id]
- DELETE /api/admin/trainers/[id]

**Public (3 endpoints):**
- GET /api/trainers (with filters, sort, pagination)
- GET /api/trainers/[slug] (increments profileViews)
- GET /api/trainers/[slug]/reviews

### 3.3 Frontend Pages

**Public:**
- `/[locale]` — Home page
- `/[locale]/trainers` — Bento Grid listing with filters, stats, featured card
- `/[locale]/trainers/[slug]` — Individual trainer profile (SSR, SEO, lightbox)
- `/[locale]/booking` — Booking flow
- `/[locale]/about-race` — Race info
- `/[locale]/prep-camp` — Prep camp
- `/[locale]/cape-town-guide` — Travel guide
- `/[locale]/race-week` — Race week schedule
- `/[locale]/pricing` — Pricing tiers
- `/[locale]/contact` — Contact form
- `/[locale]/blog` — Blog listing
- `/[locale]/blog/[slug]` — Blog post
- `/[locale]/account` — User account
- `/[locale]/faq` — FAQ
- `/[locale]/terms`, `/[locale]/privacy`, `/[locale]/refund`, `/[locale]/cookies`

**Trainer Dashboard (protected, role=trainer):**
- `/[locale]/trainer-dashboard` — Overview with stats
- `/[locale]/trainer-dashboard/profile` — Profile editor
- `/[locale]/trainer-dashboard/photos` — Photo gallery manager
- `/[locale]/trainer-dashboard/calendar` — Availability calendar
- `/[locale]/trainer-dashboard/settings` — Social links

**Admin (protected, role=admin):**
- `/admin` — Admin dashboard
- `/admin/trainers` — Trainer list with moderation filters
- `/admin/trainers/[id]` — Detailed moderation page
- `/admin/bookings` — Bookings management
- `/admin/packages` — Packages management
- `/admin/package-trainers` — Package-trainer assignments
- `/admin/documents` — Documents management
- `/admin/users` — User management

### 3.4 Component Architecture

```
components/
├── trainers/
│   ├── trainer-card/
│   │   ├── trainer-card-featured.tsx
│   │   ├── trainer-card-standard.tsx
│   │   ├── trainer-card-compact.tsx
│   │   └── trainer-card-skeleton.tsx
│   ├── trainer-filters/
│   │   ├── filter-bar.tsx
│   │   └── filter-pill.tsx
│   ├── trainer-stats/
│   │   └── stats-bar.tsx
│   ├── trainer-cta/
│   │   └── coach-recruitment.tsx
│   ├── trainers-container.tsx
│   ├── trainer-profile-page.tsx
│   └── trainer-profile.tsx (deprecated, replaced by trainer-profile-page.tsx)
├── trainer-dashboard/
│   └── trainer-dashboard-nav.tsx
├── admin/
│   ├── sidebar.tsx
│   └── trainer-moderation/
│       ├── status-badge.tsx
│       ├── moderation-panel.tsx
│       ├── diff-viewer.tsx
│       ├── history-timeline.tsx
│       ├── trainer-moderation-list.tsx
│       └── trainer-moderation-detail.tsx
├── ui/
│   ├── page-skeleton.tsx (new in Phase 6)
│   └── ... (shadcn components)
```

### 3.5 i18n Structure

**21 namespaces, all with EN + RU:**
1. metadata
2. navigation
3. hero
4. features
5. trainers
6. newsletter
7. prepCamp
8. route
9. booking
10. contact
11. footer
12. locale
13. aboutRace
14. prepCampPage
15. raceWeek
16. trainersPage
17. capeTownGuide
18. pricing
19. blog
20. trainerDashboard
21. adminModeration
22. errors (new in Phase 6)

### 3.6 Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0f` |
| Card | `#111118` |
| Card Hover | `#1a1a25` |
| Accent Primary | `#ff6b35` |
| Accent Secondary | `#4a9eff` |
| Accent Tertiary | `#00d4aa` |
| Text Primary | `#ffffff` |
| Text Secondary | `#8b8b9a` |
| Text Muted | `#5a5a6a` |
| Border | `#1e1e2e` |

---

## 4. ARCHITECTURE OVERVIEW

**Pattern:** Self-Service Profile System with Admin Moderation

**Workflow States:**
```
DRAFT → PENDING → PUBLISHED ←→ SUSPENDED
  ↑       ↓         ↑
  └──── REJECTED ←──┘
```

**Key Principle:** Trainers own their content. Admins moderate, edit, or remove non-compliant profiles.

---

## 5. DATABASE SCHEMA

### 5.1 Enums

| Enum | Values |
|------|--------|
| TrainerProfileStatus | DRAFT, PENDING, PUBLISHED, REJECTED, SUSPENDED |
| TrainerProfileChangeType | CREATE, UPDATE, DELETE |

### 5.2 Models (Summary)

- **User** — extended with `trainerProfile` relation
- **Trainer** — extended with workflow fields, social links, gallery, stats
- **TrainerProfileChange** — audit log
- **TrainerAvailability** — calendar availability
- **Booking** — unchanged
- **Review** — unchanged
- **Package** — unchanged
- **PackageTrainer** — unchanged

---

## 6. SECURITY CHECKLIST

| Requirement | Status |
|-------------|--------|
| XSS Protection (DOMPurify) | ✅ Implemented |
| Role-based access (middleware) | ✅ Implemented |
| Rate limiting | ✅ Implemented |
| File upload validation | ✅ Implemented |
| CSRF protection | ✅ Next.js built-in |
| SQL injection prevention | ✅ Prisma parameterized queries |

---

## 7. PERFORMANCE CHECKLIST

| Requirement | Status |
|-------------|--------|
| Image optimization (WebP/AVIF) | ✅ Next.js Image |
| unstable_cache for trainers | ✅ 5min revalidate |
| Dynamic imports for heavy components | ✅ Implemented |
| Skeleton loaders | ✅ Phase 6 |
| Error boundaries | ✅ Phase 6 |
| Lighthouse target | ⏳ Run after deploy |

---

## 8. TESTING CHECKLIST

### Trainer Workflow
- [x] Register → apply for trainer role
- [x] Create profile in DRAFT → auto-save works
- [x] Upload photos → gallery updates
- [x] Submit for moderation → status PENDING
- [x] Cannot edit while PENDING
- [x] Admin approves → status PUBLISHED
- [x] Profile visible on public listing
- [x] Profile views increment on visit

### Admin Workflow
- [x] See PENDING trainers in admin list
- [x] Approve trainer → status PUBLISHED
- [x] Reject trainer with reason → status REJECTED
- [x] Edit published trainer → changes visible
- [x] Suspend trainer → profile hidden
- [x] View audit history → all changes logged

### Public Listing
- [x] Only PUBLISHED trainers visible
- [x] Search by name works
- [x] Filter by specialty works
- [x] Sort by rating works
- [x] Click trainer → navigate to profile page
- [x] Profile views increment on visit
- [x] Responsive on mobile/tablet/desktop

---

## 9. CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| v6.5.1 | 2026-06-19 | Parent spec: Pricing translated, Blog translated, Cape Town Guide fixed |
| v7.0.0 | 2026-06-20 | NEW: Trainer Self-Service spec created — Database, API, Frontend, Design System, i18n, Phases |
| v1.1.0 | 2026-06-20 | UPDATE: Phase 1 delivered as ZIP archive |
| v7.1.0 | 2026-06-20 | Phase 2 API Layer delivered |
| v7.1.1 | 2026-06-20 | Phase 4 Trainer Dashboard delivered |
| v7.1.2 | 2026-06-20 | Phase 5 Admin Moderation delivered |
| v7.1.3 | 2026-06-20 | Phase 3 Public Listing (profile pages) delivered |
| **v7.2.0** | **2026-06-20** | **Phase 6 i18n & Polish delivered — ALL PHASES COMPLETE** |

---

## 10. NOTES FOR FUTURE DEVELOPMENT

1. ✅ All 6 phases complete and deployed
2. ✅ i18n: EN/RU routing works, all 22 namespaces translated
3. ✅ Auth: NextAuth v5 with role-based access (user, trainer, admin)
4. ✅ DB: PostgreSQL + Prisma 6.19.3 with full workflow schema
5. ✅ Styling: Tailwind 3.4 + shadcn/ui + custom dark theme
6. ⚠️ `force-dynamic` issue in layout.tsx — should be addressed separately
7. ✅ Google Sheets sync for bookings preserved (not affected by trainer changes)
8. ⚠️ Telegram notifications: extend for trainer status changes (future enhancement)
9. ✅ Slug generation: `slugify(firstName-lastName)` with uniqueness check
10. ✅ All phases delivered as ZIP archives per delivery rules

---

*Document maintained by Lead Platform Architect. Project is production-ready.*
