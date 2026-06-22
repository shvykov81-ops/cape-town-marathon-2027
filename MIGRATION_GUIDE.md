# MIGRATION GUIDE — Role Switching Fix
## Cape Town Marathon 2027

**Version:** 1.0.2
**Date:** 2026-06-22
**Status:** CRITICAL FIX

---

## Problem

After implementing role selection, switching roles via "Switch Role" dropdown does NOT work:
- JWT token retains old role after switch
- Middleware redirects back to old dashboard
- Admin cannot switch to Trainer without trainerProfile

---

## Root Cause

1. `switch-role` API only returned JSON — never updated JWT token
2. `RoleSwitcher` used `window.location.href` without session update
3. Admin required `trainerProfile` to act as trainer

---

## Changes

### 1. app/api/auth/switch-role/route.ts

**Added:**
- Import `unstable_update` from `@/auth`
- Call `await unstable_update({ activeRole: role })` after validation
- This triggers JWT callback with `trigger: "update"` + `session.activeRole`

**Changed:**
- Admin can switch to trainer WITHOUT trainerProfile

### 2. components/auth/role-switcher.tsx

**Changed:**
- Use `useSession().update()` instead of `window.location.href`
- Call `update({ activeRole: role })` after server validation
- Use `router.push(href)` for navigation (SPA, no full reload)

### 3. auth.ts

**Added:**
- Export `unstable_update` from NextAuth
- Admin can ALWAYS be trainer (removed trainerProfile check)

### 4. app/api/auth/check-roles/route.ts

**Changed:**
- Admin always sees "trainer" option (regardless of trainerProfile)

---

## Deployment

```bash
# 1. Copy files
cp auth.ts /path/to/project/auth.ts
cp app/api/auth/switch-role/route.ts /path/to/project/app/api/auth/switch-role/route.ts
cp app/api/auth/check-roles/route.ts /path/to/project/app/api/auth/check-roles/route.ts
cp components/auth/role-switcher.tsx /path/to/project/components/auth/role-switcher.tsx

# 2. Build
npm run build

# 3. Commit
git add auth.ts app/api/auth/switch-role/route.ts app/api/auth/check-roles/route.ts components/auth/role-switcher.tsx
git commit -m "fix: role switching with JWT update"
git push
```

---

## Testing

### Test 1: Admin with trainerProfile switches to Trainer
```
1. Login as admin with trainerProfile
2. See "Switch Role" dropdown
3. Click "Trainer Dashboard"
4. Should navigate to /trainer-dashboard
5. Middleware should allow access (new role in JWT)
```

### Test 2: Admin WITHOUT trainerProfile switches to Trainer
```
1. Login as admin without trainerProfile
2. See "Switch Role" dropdown with Trainer option
3. Click "Trainer Dashboard"
4. Should navigate to /trainer-dashboard
5. Can create trainer profile from there
```

### Test 3: Trainer switches to User
```
1. Login as trainer
2. Click "Switch Role" → "User Dashboard"
3. Should navigate to /dashboard
```

### Test 4: Single-role user
```
1. Login as regular user
2. No "Switch Role" button shown
3. Direct redirect to /dashboard
```

---

## Notes

- `unstable_update` is NextAuth v5 beta API — may change in stable release
- JWT update is synchronous — middleware sees new role immediately
- `originalRole` in session prevents privilege escalation (cannot become admin if not one)
