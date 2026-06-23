# MIGRATION_GUIDE: Fix Admin Access & Role Switching

## Problem
Admin users cannot access `/admin` panel. Two symptoms:
1. After selecting "Admin" role → redirect to homepage
2. Direct access to `/admin` → "Page not found" or redirect to `/`

## Root Causes
1. **middleware.ts**: next-intl middleware runs AFTER role checks, so `/admin` never gets locale prefix
2. **admin/layout.tsx**: Server Component `redirect("/")` fires before cookie updates, AND redirects without locale
3. **RoleSwitcher**: `router.refresh()` creates race condition with cookie update
4. **auth.ts**: JWT callback correctly updates `token.role`, but `originalRole` must be preserved

## Files to Replace

### 1. `middleware.ts` (root)
**Changes:**
- Run `intlMiddleware` FIRST (before role checks)
- Add `getLocaleFromPathname()` helper
- All redirects include locale prefix (`/${locale}/...`)
- Return intlResponse redirects immediately (307/308)

### 2. `app/[locale]/admin/layout.tsx`
**Changes:**
- Remove `redirect("/")` — replace with "Access Denied" UI
- Actual access control happens in middleware (which reads fresh cookie)
- Shows current role for debugging

### 3. `auth.ts` (root)
**Changes:**
- Preserve `originalRole` in JWT callback during role switch
- `originalRole` never changes — allows switching back to base role

### 4. `components/navigation/RoleSwitcher.tsx` (or wherever RoleSwitcher is)
**Changes:**
- Remove `router.refresh()` — use only `window.location.href`
- Build redirect URL with locale prefix (`/${locale}/admin`)
- Add 300ms delay before reload to ensure cookie is written
- Use `originalRole` from session to determine available roles

## Testing Steps

### Test 1: Login as Admin
```bash
curl -X POST https://your-app.vercel.app/api/auth/check-roles \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourpassword"}'
```
Expected: `{"roles":[{"role":"user",...},{"role":"trainer",...},{"role":"admin",...}]}`

### Test 2: Switch to Admin Role
1. Login as admin user
2. Open RoleSwitcher dropdown
3. Click "Admin"
4. Expected: Redirect to `/en/admin` (or `/ru/admin`)
5. Page should load admin dashboard

### Test 3: Direct Access
1. Login as admin, switch to admin role
2. Navigate directly to `/admin`
3. Expected: Redirect to `/en/admin` (by next-intl), then admin panel loads

### Test 4: Non-Admin Access
1. Login as regular user
2. Try to access `/en/admin`
3. Expected: Redirect to `/en` (homepage with locale)

### Test 5: Switch Back
1. In admin panel, switch to "User" role
2. Expected: Redirect to `/en/dashboard` or `/en`

## Environment Variables
No new env vars required.

## Database Changes
No migration required.

## Post-Deploy Verification
1. Check Vercel logs for middleware execution
2. Verify cookie `authjs.session-token` contains `role: "admin"` after switch
3. Test in incognito window with fresh session
