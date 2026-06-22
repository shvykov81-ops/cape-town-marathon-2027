# MIGRATION GUIDE — Fix 404 After Role Selection Update
## Cape Town Marathon 2027

**Version:** 1.0.1-hotfix
**Date:** 2026-06-22
**Status:** CRITICAL HOTFIX

---

## Problem

After deploying the Role Selection & Access Control update, the site returns **404 on all pages**.

### Root Cause

The new `middleware.ts` replaced the next-intl middleware with role-based protection, but:
1. **next-intl middleware was removed** — no `/` → `/en` redirect
2. **Matcher was narrowed** to only protected routes — public pages bypassed middleware entirely
3. **`localePrefix: "always"`** requires middleware to intercept ALL routes

### What Broke

| Route | Expected | Actual |
|-------|----------|--------|
| `/` | Redirect to `/en` | 404 |
| `/en` | Homepage | 404 |
| `/ru` | Homepage (RU) | 404 |
| `/trainers` | Trainers listing | 404 |

---

## Fix

Replace `middleware.ts` with the fixed version that **combines next-intl + role protection**.

### Key Changes

```diff
- import { NextResponse } from "next/server";
- import type { NextRequest } from "next/server";
- import { jwtVerify } from "jose";
- import { routing } from "./i18n/routing";
- 
- export async function middleware(request: NextRequest) { ... }
- 
- export const config = {
-   matcher: ["/admin/:path*", "/trainer-dashboard/:path*", ...]
- };

+ import { NextResponse } from "next/server";
+ import type { NextRequest } from "next/server";
+ import { jwtVerify } from "jose";
+ import createMiddleware from "next-intl/middleware";
+ import { routing } from "./i18n/routing";
+ 
+ const intlMiddleware = createMiddleware(routing);
+ 
+ export async function middleware(request: NextRequest) {
+   // 1. Handle i18n FIRST
+   const intlResponse = intlMiddleware(request);
+   if (intlResponse.status === 307 || intlResponse.status === 308) {
+     return intlResponse;
+   }
+   // 2. Then role checks...
+ }
+ 
+ export const config = {
+   matcher: ["/((?!api|_next|...).*)"]  // Same as old working version
+ };
```

---

## Deployment Steps

### Step 1: Replace middleware.ts

```bash
# Copy the fixed middleware.ts to project root
cp middleware.ts /path/to/project/middleware.ts
```

### Step 2: Verify i18n/routing.ts exists

```typescript
// i18n/routing.ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

### Step 3: Build

```bash
npm run build
```

### Step 4: Test locally

```bash
npm run dev
# Visit http://localhost:3000/ → should redirect to /en
# Visit http://localhost:3000/en → should show homepage
# Visit http://localhost:3000/ru → should show homepage (RU)
```

### Step 5: Deploy

```bash
git add middleware.ts
git commit -m "hotfix: restore next-intl middleware with role protection"
git push
```

---

## Testing Checklist

- [ ] `/` redirects to `/en`
- [ ] `/en` shows homepage
- [ ] `/ru` shows homepage (RU)
- [ ] `/trainers` shows trainers listing
- [ ] `/admin` redirects to `/account` (not logged in)
- [ ] `/trainer-dashboard` redirects to `/account` (not logged in)
- [ ] Logged-in admin can access `/admin`
- [ ] Logged-in trainer can access `/trainer-dashboard`
- [ ] Role switching still works

---

## Notes

- **next-intl middleware MUST run first** — it handles locale detection and redirects
- **Role checks run AFTER** — on the already-localized path (`/en/admin`, `/ru/admin`)
- **Matcher must include ALL routes** — next-intl needs to intercept `/` for redirect

---

*Hotfix for Role Selection v1.0.0. Original feature remains intact; only middleware execution order fixed.*
