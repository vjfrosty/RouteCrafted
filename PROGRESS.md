# PROGRESS.md — RouteCrafted

_Last updated: 2 April 2026_

---

## Current State

Phase 2 (Auth + DB) is complete and building cleanly. Neon PostgreSQL is provisioned with all 7 tables migrated. Auth.js v5 with JWT sessions, protected routes, register/login/dashboard screens are all live. Vercel deployment is unblocked.

**Live URL:** https://RouteCrafted.com (Vercel)

---

## Phase Checklist

| Phase | Status | Notes |
|---|---|---|
| **1 — Foundation** | ✅ Done | Monorepo, Next.js 16.2.2, Coming Soon page, Vercel |
| **2 — Auth + DB** | ✅ Done | Neon DB (7 tables), Auth.js v5, register/login/dashboard |
| **3 — Trip CRUD** | ⬜ Not started | |
| **4 — Itinerary AI** | ⬜ Not started | |
| **5 — Weather** | ⬜ Not started | |
| **6 — Place Cards** | ⬜ Not started | |
| **7 — Admin + Polish** | ⬜ Not started | |

---

## Phase 1 — Foundation ✅

### Completed
- **Turborepo monorepo** — `turbo.json`, root `package.json` with npm workspaces
- **`apps/web`** — Next.js 16.2.2 App Router, TypeScript strict, Tailwind CSS v3
- **`apps/mobile`** — Placeholder `package.json` (Expo setup deferred to Phase 7)
- **`packages/shared`** — `@routecrafted/types` package with all domain type aliases
- **`.gitignore`** — covers `node_modules`, `.next`, `.env.local`, `.turbo`, Expo outputs
- **Coming Soon page** (`apps/web/app/page.tsx`) — branded landing, dark gradient, feature cards
- **Vercel deployment** — monorepo configured, `apps/web` as root, build passing

### Security
- Patched **CVE-2025-66478** (Next.js middleware auth bypass) by upgrading `15.2.4` → `16.2.2`

---

## Phase 2 — Auth + DB ✅

### Completed
- **Neon PostgreSQL** provisioned — `ep-silent-recipe-a9zetozv.gwc.azure.neon.tech`
- **All 7 tables migrated** via `drizzle-kit generate` + `drizzle-kit migrate`:
  - `users`, `trips`, `itinerary_days`, `itinerary_items`, `place_cards`, `weather_alerts`, `admin_flags`
- **Drizzle ORM** — lazy client singleton (`lib/db/index.ts`) avoids build-time env var errors
- **Auth.js v5 (next-auth@beta)** — Credentials provider, JWT session strategy, `auth()` guard
- **Route handler** — `app/api/auth/[...nextauth]/route.ts`
- **Session types extended** — `types/next-auth.d.ts` adds `id` + `role` to Session/JWT
- **`proxy.ts`** (Next.js 16 middleware convention) — protects `/dashboard`, `/trips/*`, `/profile`, `/admin`
- **`/api/auth/register`** — Zod validation, bcrypt rounds=12, 409 on duplicate email
- **`/api/auth/me`** — auth-guarded, returns current session user
- **UI screens** — `/register`, `/login`, `/dashboard` (empty state placeholder)
- **`apps/web/package.json`** — all runtime deps explicitly declared for Vercel CI

### Build fixes applied
- Lazy DB client (`Proxy` wrapper) — prevented `neon()` throwing at build time when `DATABASE_URL` is absent
- Renamed `middleware.ts` → `proxy.ts` — Next.js 16 convention, eliminates deprecation warning
- Explicitly declared all 5 Phase 2 deps in `apps/web/package.json` — Vercel installs from lockfile, not from `node_modules`

---

## What's Next — Phase 3 (Trip CRUD)

1. Install `@mapbox/search-js-react` (Mapbox address autocomplete)
2. API routes: `GET/POST /api/trips`, `GET/PATCH/DELETE /api/trips/:id`
3. Nominatim geocoding on trip creation (convert destination → lat/lng)
4. Web screens: `/dashboard` (full trip list), `/trips/new` (create form), `/trips/:id` (detail placeholder)
5. Components: `TripCard`, `CreateTripButton`, `TripForm`

---

## Capstone Score Tracker

| Criterion | Points | Status |
|---|---|---|
| GitHub Commits (≥15) | 0–15 | ~5+ commits |
| Commit Days (≥3 days) | 0–15 | 1 day so far |
| Architecture | 0–5 | ✅ Turborepo monorepo |
| Backend API | 0–7 | ✅ register + me routes (more in Phase 3+) |
| Database (≥4 tables) | 0–8 | ✅ 7 tables migrated |
| Auth & Security | 0–5 | ✅ Auth.js v5, bcrypt, JWT, Zod, CVE patched |
| Web Screens (≥5) | 0–10 | 3/9 (Coming Soon, /register, /login, /dashboard) |
| Admin Panel | 0–10 | ⬜ Not started |
| Mobile App (≥3 screens) | 0–9 | ⬜ Not started |
| Deployment | 0–10 | ✅ Vercel live |
| Documentation | 0–6 | ✅ AGENTS.md, CODING_PLAN.md, PROGRESS.md |
| **Estimated so far** | **~28** | |