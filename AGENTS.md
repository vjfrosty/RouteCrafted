# AGENTS.md — RouteCrafted

_AI coding agent instructions. Read before making any changes._
_Full technical reference (schema, API catalogue, integrations, env vars): **[CODING_PLAN.md](./CODING_PLAN.md)**_

---

## 1. Project

AI-powered travel itinerary builder — day-by-day plans with weather-aware replanning and "Worth It / Skip It" place cards.
**Stack:** Next.js 15 · Expo · Drizzle ORM · Neon PostgreSQL · Auth.js · Gemini 2.0 Flash · Cloudflare R2 · Vercel

---

## 2. Commands

```bash
npx turbo dev                    # all apps
npx turbo dev --filter=web       # Next.js web + API only
npx turbo dev --filter=mobile    # Expo mobile only
npx turbo build                  # production build
npx turbo lint                   # lint all packages

# Schema changes — always run from apps/web/
cd apps/web
npx drizzle-kit generate         # generate SQL migration
npx drizzle-kit migrate          # apply to Neon DB
```

---

## 3. Monorepo Layout

```
RouteCrafted/
├── apps/
│   ├── web/          # Next.js 15 — backend API + React web client
│   └── mobile/       # Expo React Native mobile client
├── packages/
│   └── shared/       # @routecrafted/types — shared TypeScript types
├── AGENTS.md
├── CODING_PLAN.md
└── turbo.json
```

---

## 4. Key Module Paths

Never create these from scratch — these modules already exist or must be created once here:

| Purpose | Path |
|---|---|
| All Gemini AI calls | `apps/web/lib/ai/gemini.ts` |
| All weather calls | `apps/web/lib/weather/open-meteo.ts` |
| Drizzle client + schema | `apps/web/lib/db/` |
| Cloudflare R2 uploads | `apps/web/lib/storage/r2.ts` |
| Resend email sender | `apps/web/lib/email/resend.ts` |
| Expo push notifications | `apps/web/lib/notifications/expo-push.ts` |
| Shared TypeScript types | `packages/shared/src/` |
| Mobile API client | `apps/mobile/lib/api.ts` |

---

## 5. Next.js 15 App Router Rules

**5.1 Server vs Client Components**

Server Components are the default. Only add `'use client'` for interactivity, hooks, or browser APIs.

```tsx
// ✅ Correct — Client Component isolated, imported into Server Component
// components/TripActions.tsx
'use client'
export function TripActions({ tripId }: { tripId: string }) { ... }

// app/(dashboard)/trips/[id]/page.tsx  ← Server Component, no directive
import { TripActions } from '@/components/TripActions'
export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trip = await db.query.trips.findFirst({ where: eq(trips.id, id) })
  return <><TripDetail trip={trip} /><TripActions tripId={id} /></>
}

// ❌ Wrong — 'use client' on a page that fetches data server-side
'use client'
export default function TripPage() { /* can't await DB here */ }
```

**5.2 Async request APIs**

`params`, `searchParams`, `cookies()`, and `headers()` are async in Next.js 15 App Router.

```tsx
// ✅ Always await params
const { id } = await params

// ❌ Never treat params as a plain object
const { id } = params  // type error in Next.js 15
```

**5.3 Never call own Route Handlers from Server Components**

Import shared logic from `lib/` directly — avoid extra network hops.

```tsx
// ✅ Call lib directly
import { getTrip } from '@/lib/db/trips'
const trip = await getTrip(id)

// ❌ Never fetch your own API from a Server Component
const res = await fetch(`/api/trips/${id}`)
```

---

## 6. Database Rules

- **All schema changes via Drizzle migrations only** — `drizzle-kit generate` → `drizzle-kit migrate`
- **Commit** generated files in `apps/web/drizzle/` — these are required by the capstone
- **Never** write raw SQL for schema changes or modify already-applied migration files
- Schema definitions live in `apps/web/lib/db/schema.ts`

---

## 7. Authentication & Authorisation

```ts
// ✅ Protect every API route and server component
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })
  // ...
}

// ✅ Admin guard — always server-side
if (session.user.role !== 'admin') return new Response('Forbidden', { status: 403 })

// ❌ Never trust role from the client request body
const { role } = await req.json()  // attacker-controlled — never use for access control
```

---

## 8. Code Conventions

- **Folders:** `kebab-case` · **Components:** `PascalCase` · **Utils/hooks:** `camelCase`
- **TypeScript strict mode** everywhere — no `any`, no implicit `any`
- Shared types belong in `packages/shared/` only — never duplicate across `web` and `mobile`
- File uploads route through `/api/upload/*` — R2 credentials **never** reach the browser
- Mobile app: store JWT in Expo `SecureStore`, **never** `AsyncStorage`
- Mobile app accesses data **only** via the Next.js REST API (`apps/mobile/lib/api.ts`) — no direct DB access

---

## 9. Boundaries

**Always:**
- Run `drizzle-kit generate` + `drizzle-kit migrate` before any schema changes
- Guard every protected route with `auth()` from Auth.js
- Route all AI calls through `apps/web/lib/ai/gemini.ts`
- Validate and sanitize all user input at API boundaries (use `zod`)

**Ask first:**
- Dropping or renaming a DB table
- Changing the auth strategy or session shape
- Adding a new external service not listed in CODING_PLAN.md

**Never:**
- Commit `.env.local` or any file containing secrets
- Expose `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, or `GEMINI_API_KEY` to the client
- Bypass `auth()` on any admin route
- Modify an already-applied Drizzle migration file

---

## 10. See Also

→ **[CODING_PLAN.md](./CODING_PLAN.md)** — full database schema (7 tables), complete API catalogue, web + mobile screens, AI prompt shapes, integration code snippets, `.env.local` template, and capstone scoring checklist.
