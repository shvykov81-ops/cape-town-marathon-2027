# MIGRATION GUIDE: Role Selection Fix v1.0.0

## Problem
Admin users cannot access `/admin` after switching roles. They get redirected to homepage.
Trainer switch works, admin switch fails.

## Root Cause
1. **middleware.ts** used `jose.jwtVerify()` on NextAuth v5's encrypted session token → always fails with "Invalid Compact JWS" → role = null → admin routes denied.
2. **RoleSwitcher** used redirect URLs without locale prefix (`/admin` instead of `/ru/admin`).
3. No mechanism to communicate role to Edge middleware since NextAuth v5 tokens are encrypted.

## Solution
Introduce unencrypted `x-active-role` cookie set server-side via new API endpoint. Middleware reads this cookie directly (no decryption needed).

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `middleware.ts` | **Replace** | Reads `x-active-role` cookie instead of decrypting JWT |
| `app/api/auth/set-role-cookie/route.ts` | **NEW** | Server-side API to set/clear role cookies |
| `app/api/auth/switch-role/route.ts` | **Replace** | Returns `redirectPath` (without locale) |
| `components/auth/role-switcher.tsx` | **Replace** | Calls set-role-cookie + locale-aware navigation |
| `app/[locale]/account/page.tsx` | **Patch** | Call set-role-cookie after sign-in |

## Installation

### Step 1: Apply files
```bash
# Extract ZIP to project root
cd /path/to/cape-town-marathon-2027
# Copy files from ZIP to corresponding locations
```

### Step 2: Patch account page
In `app/[locale]/account/page.tsx`, add the `setRoleCookie` helper and call it after `signIn()`:

```typescript
// Add this helper function inside AccountPage component:
async function setRoleCookie(role: string) {
  await fetch("/api/auth/set-role-cookie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
}

// In performSignIn(), AFTER signIn() succeeds, BEFORE router.push():
await setRoleCookie(role);

// In the useEffect for authenticated redirect, add:
fetch("/api/auth/set-role-cookie", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ role }),
});
```

### Step 3: Add sign-out cleanup (optional but recommended)
In your sign-out handler, call:
```typescript
await fetch("/api/auth/set-role-cookie", { method: "DELETE" });
await signOut({ callbackUrl: "/" });
```

### Step 4: Deploy
```bash
git add .
git commit -m "fix: Role Selection — admin middleware access + locale-aware redirects"
git push
```

## Testing

### Test 1: Admin login
1. Go to `/account`
2. Login as admin user
3. Select "Administrator" role
4. **Expected:** Redirected to `/ru/admin` (or `/en/admin`), page loads

### Test 2: Admin → Trainer switch
1. In admin panel, click "Switch Role" → "Trainer Dashboard"
2. **Expected:** Redirected to `/ru/trainer-dashboard`

### Test 3: Trainer → Admin switch
1. In trainer dashboard, click "Switch Role" → "Admin Panel"
2. **Expected:** Redirected to `/ru/admin`, page loads

### Test 4: Direct URL access
1. Login as admin, switch to admin role
2. Open `/ru/admin` directly in new tab
3. **Expected:** Page loads (middleware reads cookie)

### Test 5: Unauthorized access
1. Login as regular user
2. Try to open `/ru/admin`
3. **Expected:** Redirected to `/ru`

## Security Notes
- `x-active-role` cookie is `httpOnly` + `secure` (in production) + `sameSite=lax`
- The cookie is a "hint" for middleware — actual authorization still happens in API routes via `auth()`
- If cookie is tampered, user might bypass middleware redirect but API routes will reject unauthorized requests
- Cookie is synchronized with actual NextAuth session on every role switch

## Rollback
If issues occur, restore original files from git:
```bash
git checkout HEAD -- middleware.ts app/api/auth/switch-role/route.ts components/auth/role-switcher.tsx
# Remove new file:
rm -rf app/api/auth/set-role-cookie
```
