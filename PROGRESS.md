# PROGRESS.md — RouteCrafted

_Last updated: 2 April 2026_

---

## Current State

Monorepo scaffold is live. A "Coming Soon" landing page is deployed to Vercel.
No backend, database, or auth has been built yet.

**Live URL:** https://RouteCrafted.com (Vercel — Coming Soon page)

---

## Phase Checklist

| Phase | Status | Notes |
|---|---|---|
| **1 — Foundation** | ✅ Done | See detail below |
| **2 — Auth + DB** | ⬜ Not started | |
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
- **`packages/shared`** — `@routecrafted/types` package with all domain enums/union types from schema
- **`.gitignore`** — covers `node_modules`, `.next`, `.env.local`, `.turbo`, Expo outputs
- **Coming Soon page** (`apps/web/app/page.tsx`) — branded landing page, responsive, dark gradient, feature cards
- **Vercel deployment** — monorepo configured, `apps/web` as root directory, build passing

### Security
- Patched **CVE-2025-66478** (Next.js 15.0.0–16.0.6 middleware auth bypass) by upgrading `15.2.4` → `16.2.2`

---

## What's Next — Phase 2 (Auth + DB)

1. Provision Neon PostgreSQL database
2. Create `apps/web/.env.local` from the template in `CODING_PLAN.md §9`
3. Configure Drizzle ORM client (`apps/web/lib/db/index.ts`)
4. Write schema (`apps/web/lib/db/schema.ts`) — `users` + `trips` tables
5. Run `drizzle-kit generate` + `drizzle-kit migrate`, commit `apps/web/drizzle/`
6. Configure Auth.js with Credentials provider (`apps/web/app/api/auth/[...nextauth]/route.ts`)
7. Build `/api/auth/register` route (bcrypt password hash)
8. Build `/register` and `/login` screens

---

## Capstone Score Tracker

| Criterion | Points | Status |
|---|---|---|
| GitHub Commits (≥15) | 0–15 | ~3 commits so far |
| Commit Days (≥3 days) | 0–15 | 1 day so far |
| Architecture | 0–5 | ✅ Turborepo monorepo in place |
| Backend API | 0–7 | ⬜ Not started |
| Database (≥4 tables) | 0–8 | ⬜ Not started |
| Auth & Security | 0–5 | ⬜ Not started (CVE patched) |
| Web Screens (≥5) | 0–10 | 1/9 screens (Coming Soon) |
| Admin Panel | 0–10 | ⬜ Not started |
| Mobile App (≥3 screens) | 0–9 | ⬜ Not started |
| Deployment | 0–10 | ✅ Vercel live |
| Documentation | 0–6 | ✅ AGENTS.md, CODING_PLAN.md, PROGRESS.md |
| **Estimated so far** | **~8** | |