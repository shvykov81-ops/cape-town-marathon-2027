# MIGRATION GUIDE — Role Selection & Access Control
## Cape Town Marathon 2027

**Version:** 1.0.0
**Date:** 2026-06-22

---

## Overview

This update adds:
1. **Role selection at login** — users with multiple roles choose which one to use
2. **Middleware role protection** — `/admin/*` requires admin, `/trainer-dashboard/*` requires trainer
3. **Role switching** — admin can switch between admin/trainer/user without re-login
4. **Pre-login role check** — API endpoint to discover available roles before JWT issued

---

## Files Changed

### New Files
- `components/auth/role-selector.tsx` — UI for role selection
- `components/auth/role-switcher.tsx` — Navbar dropdown to switch roles
- `app/api/auth/check-roles/route.ts` — Pre-login role discovery
- `app/api/auth/switch-role/route.ts` — Role switching during session

### Modified Files
- `middleware.ts` — Added role-based route protection
- `auth.ts` — Added `activeRole` support in credentials
- `app/account/page.tsx` — Added role selection flow

---

## Installation

### Step 1: Install dependency

```bash
npm install jose
```

`jose` is used in middleware to verify JWT tokens without NextAuth internals.


### Step 1b: Install shadcn/ui dropdown-menu (if missing)

If you get build error about `@/components/ui/dropdown-menu`, install it:

```bash
# Option A: Via shadcn CLI
npx shadcn add dropdown-menu

# Option B: Manual install
npm install @radix-ui/react-dropdown-menu
# Then copy components/ui/dropdown-menu.tsx from this archive
```

### Step 2: Update environment variables

Ensure `AUTH_SECRET` or `NEXTAUTH_SECRET` is set (required for JWT verification in middleware):

```bash
AUTH_SECRET=your-secret-here
# or
NEXTAUTH_SECRET=your-secret-here
```

### Step 3: Copy files

Extract ZIP to project root.

### Step 4: Build

```bash
npm run build
```

### Step 5: Deploy

```bash
git add .
git commit -m "feat: role selection and access control"
git push
```

---

## How It Works

### Login Flow

```
User enters email/password
         │
         ▼
POST /api/auth/check-roles
         │
         ▼
Returns available roles:
  - user (everyone)
  - trainer (if role=trainer or admin with trainerProfile)
  - admin (if role=admin)
         │
         ▼
If 1 role → login directly
If 2+ roles → show RoleSelector
         │
         ▼
User selects role
         │
         ▼
signIn("credentials", { activeRole: "trainer" })
         │
         ▼
JWT contains selected role
Session uses selected role
Redirect to appropriate dashboard
```

### Access Control

| Route | Required Role | Redirect If No Access |
|-------|--------------|----------------------|
| `/admin/*` | `admin` | `/` (homepage) |
| `/trainer-dashboard/*` | `trainer` or `admin` | `/` (homepage) |
| `/dashboard/*` | any authenticated | `/account` (login) |

### Role Switching

Admin sees "Switch Role" button in navbar:
- Admin → Trainer Dashboard
- Admin → User Dashboard
- Trainer → User Dashboard

Switching requires page refresh (session update).

---

## Testing

### Test 1: User with single role (user)
```
Login → directly to /dashboard
No role selector shown
```

### Test 2: User with trainer role
```
Login → directly to /trainer-dashboard
```

### Test 3: Admin with trainer profile
```
Login → role selector shown:
  [ ] Administrator
  [ ] Coach / Trainer  
  [ ] Runner / Traveler
Select "Coach / Trainer" → /trainer-dashboard
```

### Test 4: Access control
```
As user, try /admin → redirected to /
As trainer, try /admin → redirected to /
As admin, try /trainer-dashboard → allowed
```

### Test 5: Role switching
```
As admin on /admin
Click "Switch Role" → "Trainer Dashboard"
Redirected to /trainer-dashboard with trainer role
```

---

## Database Changes

None required. Uses existing `User.role` field.

---

## Troubleshooting

### "Cannot verify JWT in middleware"
Ensure `AUTH_SECRET` or `NEXTAUTH_SECRET` is set and matches the one used for signing.

### "Role not updated after switch"
Role switching requires page refresh. The `switch-role` API returns redirect URL, client navigates to it.

### "check-roles returns 401"
Verify email/password. This endpoint uses same bcrypt comparison as login.

---

## Next Steps

After this is working, proceed to Phase 2: Revision Workflow for published trainer profiles.
