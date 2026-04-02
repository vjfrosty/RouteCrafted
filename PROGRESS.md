# PROGRESS.md — RouteCrafted

_Last updated: 2 April 2026 — Phase 5 complete_

---

## Current State

Phase 5 (Weather Integration) is complete and building cleanly. Open-Meteo forecasts are checked automatically on every trip page open and on dashboard load — no manual trigger required. Weather alerts surface as dismissable banners with a one-click "Rewrite Day" action, and TripCards on the dashboard show an amber badge whenever active alerts exist.

**Live URL:** https://RouteCrafted.com (Vercel)

---

## Phase Checklist

| Phase | Status | Notes |
|---|---|---|
| **1 — Foundation** | ✅ Done | Monorepo, Next.js 16.2.2, Coming Soon page, Vercel |
| **2 — Auth + DB** | ✅ Done | Neon DB (7 tables), Auth.js v5, register/login/dashboard |
| **3 — Trip CRUD** | ✅ Done | 5 API routes, Mapbox form, TripCard, dashboard grid, trip detail |
| **4 — Itinerary AI** | ✅ Done | AI generation, day rewrite, per-day page, DB prompt management, admin panel |
| **5 — Weather** | ✅ Done | Auto-check on page open + dashboard, dismissable banners, rewrite-day integration |
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
- **UI screens** — `/register`, `/login`, `/dashboard` (placeholder, replaced in Phase 3)
- **`apps/web/package.json`** — all runtime deps explicitly declared for Vercel CI

### Build fixes applied
- Lazy DB client (`Proxy` wrapper) — prevented `neon()` throwing at build time when `DATABASE_URL` is absent
- Renamed `middleware.ts` → `proxy.ts` — Next.js 16 convention, eliminates deprecation warning
- Explicitly declared all Phase 2 deps in `apps/web/package.json` — Vercel installs from lockfile, not `node_modules`

---

## Phase 3 — Trip CRUD ✅

### Completed
- **`lib/db/trips.ts`** — 5 DB helpers with server-side ownership enforcement:
  `getTripsByUser`, `getTripById`, `createTrip`, `updateTrip`, `deleteTrip`
- **`/api/trips`** — `GET` (list user's trips) + `POST` (create; Zod validation; Nominatim geocode fallback if lat/long absent)
- **`/api/trips/[id]`** — `GET` (single), `PATCH` (partial update), `DELETE` (204); all return 404 on ownership mismatch
- **`components/trips/TripCard.tsx`** — destination/country, date range, status badge (draft/active/completed), budget/style/pacing chips; full card is a `<Link>`
- **`components/trips/TripForm.tsx`** — Mapbox `SearchBox` autocomplete; `onRetrieve` extracts name, country, lat, lon; selects for all preferences; POST → `router.push('/trips/:id')` on 201
- **`/trips/new`** — Server Component, auth guard, renders `TripForm`
- **`/trips/[id]`** — Server Component; fetches via `getTripById` (no self-fetch); trip metadata cards + Phase 4 "Generate Itinerary" placeholder
- **`/dashboard`** — upgraded from placeholder to full trip grid with `TripCard` components; empty state preserved for zero trips; always-visible "Plan a trip" button

### Security
- Mapbox token scoped to public scopes only (no secret scopes); URL-restricted to `localhost:3000` + `routecrafted.com` in Mapbox dashboard
- All trip routes enforce ownership at DB level — `getTripById(id, userId)` returns `null` if `user_id` doesn't match session
- Zod validates all `POST /api/trips` and `PATCH /api/trips/:id` request bodies at API boundary

---

## Phase 4 — Itinerary AI + Admin Prompt Management ✅

### Core AI Pipeline

- **`lib/ai/openrouter.ts`** — `generateJSON<T>(prompt, model?)` singleton using the `openai` npm package pointed at OpenRouter (`https://openrouter.ai/v1`). `model` param overrides the DB setting; lazy `Proxy` wrapper prevents build-time env-var errors.
- **`lib/ai/schemas.ts`** — Zod schemas for AI responses: `itineraryResponseSchema` (array of days + items) and `rewriteDayResponseSchema` (single day + items). All `estimatedCost` fields cast to `string` before DB insert.
- **`lib/db/itinerary.ts`** — DB helpers: `getDaysByTrip`, `getDayWithItems`, `insertDays`, `insertItems`, `deleteDayItems`, `updateDay`, `updateItem`, `deleteItem`, `getTripById` (ownership-checked).

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/itinerary/generate` | POST | Build prompt from trip metadata → call OpenRouter → bulk-insert `itinerary_days` + `itinerary_items`. 409 if days already exist. |
| `/api/itinerary/rewrite-day` | POST | Replace all items for one day via AI; accepts optional `weatherLabel` + `forecastCode` for context. |
| `/api/itinerary/items/[id]` | PATCH / DELETE | Edit or remove a single itinerary item. |

### UI Components & Pages

- **`components/itinerary/GenerateItineraryButton.tsx`** — client component; POST → spinner → `router.refresh()`
- **`components/itinerary/DayCard.tsx`** — linked card showing day number, date, theme, item count
- **`components/itinerary/RewriteDayButton.tsx`** — client component; POST → spinner → `router.refresh()`
- **`/trips/[id]`** — updated: shows "Generate Itinerary" button when no days exist; shows day list grid with item counts once generated
- **`/trips/[id]/day/[dayNumber]`** — new page; `await params` for both segments; morning / afternoon / evening time blocks; item cards with type badge, location, duration, cost; `RewriteDayButton` at top-right

---

### Additional Feature — DB-Driven Prompt Management (Admin)

#### Motivation
All AI prompts, the model name, and context-building templates for weather/reason rewrites are stored in the database. Admins can edit them and create new versions live from a browser panel — zero code deploys needed.

#### Schema Changes (migration `0001_tidy_darkhawk.sql` — applied ✅)

Two new tables added to `lib/db/schema.ts`:

| Table | Purpose | Key Columns |
|---|---|---|
| `ai_prompts` | Versioned prompt templates | `promptKey`, `version`, `isActive`, `name`, `description`, `template` (with `{{variable}}` placeholders), `createdBy` |
| `ai_settings` | Key-value config (model, context snippets) | `key` (unique), `value`, `description`, `updatedBy`, `updatedAt` |

#### Template Interpolation — `lib/ai/interpolate.ts`
Safe `{{variable}}` replacement via regex only — no `eval`, no arbitrary code. Unknown placeholders are left as-is.

#### DB Helpers + Seed — `lib/db/ai-config.ts`

- **`seedDefaults()`** — idempotent; inserts one active version for each prompt key + 3 settings on first admin visit. Called on every `/admin/ai` page load (no-op after first run).
- `getAllPrompts()`, `getActivePrompt(promptKey)`, `createPromptVersion()` (auto-deactivates all others for that key), `activatePromptVersion()` — full version lifecycle
- `getAllSettings()`, `getSetting(key)`, `upsertSetting()` — key-value management
- Exported `PROMPT_VARIABLES` + `SETTING_VARIABLES` constants — used by the UI to render variable hint chips

**Default prompt keys:**

| Key | Variables |
|---|---|
| `generate_itinerary` | `{{destination}}`, `{{country}}`, `{{startDate}}`, `{{endDate}}`, `{{totalDays}}`, `{{budgetRange}}`, `{{travelStyle}}`, `{{groupType}}`, `{{pacing}}` |
| `rewrite_day` | Same trip vars + `{{dayNumber}}`, `{{date}}`, `{{theme}}`, `{{summary}}`, `{{weatherContext}}` |

**Default settings:**

| Key | Purpose |
|---|---|
| `model` | OpenRouter model identifier (default: `deepseek/deepseek-chat`) |
| `rewrite_day_weather_context` | Template for the weather paragraph; uses `{{weatherLabel}}`, `{{forecastCode}}` |
| `rewrite_day_reason_context` | Template for the manual-rewrite paragraph; uses `{{reason}}` |

#### Admin API Routes

| Route | Method | Guard | Purpose |
|---|---|---|---|
| `/api/admin/ai/prompts` | GET | admin | List all prompt versions |
| `/api/admin/ai/prompts` | POST | admin | Create new version (auto-activates) |
| `/api/admin/ai/prompts/[id]/activate` | PATCH | admin | Activate specific version |
| `/api/admin/ai/settings` | GET | admin | List all settings |
| `/api/admin/ai/settings/[key]` | PATCH | admin | Upsert a setting value |

#### Admin UI Components

- **`components/admin/AiSettingsPanel.tsx`** — inline edit for every setting; shows description + variable chips; textarea for multi-line templates, text input for single-line values; calls PATCH → `router.refresh()`
- **`components/admin/AiPromptsPanel.tsx`** — one tab per prompt key (Generate Itinerary / Rewrite Day); per-tab: active-version highlighted, version history list, View / Activate buttons, "Create new version" form pre-populated with current active template; monospace textarea; calls POST → `router.refresh()`

#### Admin Pages

- **`/admin`** — dashboard index (server component, `session.user.role === "admin"` guard); 4 cards — AI Config live, Users / Feature Flags / Stats labelled "Phase 7"
- **`/admin/ai`** — server component; calls `seedDefaults()` then parallel `getAllPrompts()` + `getAllSettings()`; renders `AiSettingsPanel` then `AiPromptsPanel`

#### Updated AI Routes
Both `generate/route.ts` and `rewrite-day/route.ts` were updated to:
1. Fetch the active prompt template from `ai_prompts` (503 if none found)
2. Fetch the active model from `ai_settings`
3. Build the `weatherContext` string by interpolating the `rewrite_day_weather_context` / `rewrite_day_reason_context` setting templates
4. Call `interpolate(template, vars)` to fill all `{{variable}}` placeholders
5. Pass the final prompt + model to `generateJSON()`

### Build Fixes Applied
- **Zod v4 breaking change** — `ZodError.errors` renamed to `.issues`; fixed in all 6 route files
- **`estimatedCost` type** — destructured before spread in `items/[id]/route.ts` to avoid `string | number` → `string` assignment error

---

## Phase 5 — Weather Integration ✅

### New Files
| File | Purpose |
|---|---|
| `apps/web/lib/weather/open-meteo.ts` | Open-Meteo client — `getForecast()`, `classifyAlert()`, `wmoLabel()` |
| `apps/web/lib/weather/check.ts` | Shared `runWeatherCheck(tripId, userId)` — used by server components AND API route |
| `apps/web/lib/db/weather.ts` | DB helpers — `getActiveAlertsByTrip`, `getAlertCountsByUser`, `createWeatherAlert` (idempotent), `dismissAlert` |
| `apps/web/app/api/weather/check/[tripId]/route.ts` | `GET` — thin wrapper around `runWeatherCheck` |
| `apps/web/app/api/weather/dismiss/[alertId]/route.ts` | `POST` — ownership-checked alert dismissal |
| `apps/web/components/weather/WeatherAlertBanner.tsx` | Client banner — "Rewrite Day" + "Dismiss" with loading states |
| `apps/web/components/weather/RefreshWeatherButton.tsx` | Client manual re-check button |

### Modified Files
- **`TripCard.tsx`** — `alertCount?: number` prop; amber `⚠ N` badge when `alertCount > 0`
- **`trips/[id]/page.tsx`** — auto `runWeatherCheck()` on every page load via `Promise.all`; `<WeatherAlertBanner>` stack above itinerary; `<RefreshWeatherButton>` in header
- **`dashboard/page.tsx`** — `getAlertCountsByUser()` for badge counts; `Promise.allSettled` background check for upcoming trips (within 16 days)

### Key Decisions
- **No API key** — Open-Meteo is free; `next: { revalidate: 3600 }` for 1-hour edge cache
- **Auto-check on every page load** — `runWeatherCheck` imported directly by server components; no HTTP self-call
- **Idempotent alerts** — `createWeatherAlert` skips insert if a non-dismissed alert already exists for that `dayId`
- **Out-of-range handling** — past trips or > 16-day window return `stale: true`; no errors, no phantom alerts
- **No schema migrations** — `weather_alerts` table and `itinerary_days.weatherCode/weatherLabel/weatherAlerted` columns existed from Phase 2
- **Dashboard resilience** — `Promise.allSettled` so one Open-Meteo failure never breaks the page render

---

## What's Next — Phase 6 (Place Cards)

1. `POST /api/places/generate-cards` — call OpenTripMap (or Overpass) for POIs near each day's destination; insert into `place_cards` table
2. `POST /api/places/flag/:id` — user flags a place as "Worth It" or "Skip It"
3. Worth It / Skip It card UI on `/trips/[id]` — swipeable or grid cards with rating badge
4. Admin moderation queue at `/admin/places` — review flagged cards, approve or remove
5. `place_cards` table already migrated (Phase 2)

---

## Capstone Score Tracker

| Criterion | Points | Status |
|---|---|---|
| GitHub Commits (≥15) | 0–15 | ~15+ commits |
| Commit Days (≥3 days) | 0–15 | 2+ days |
| Architecture | 0–5 | ✅ Turborepo monorepo |
| Backend API | 0–7 | ✅ 17 routes live (auth × 3, trips × 4, itinerary × 3, admin × 5, weather × 2) |
| Database (≥4 tables) | 0–8 | ✅ 9 tables migrated |
| Auth & Security | 0–5 | ✅ Auth.js v5, bcrypt, JWT, Zod, ownership checks, admin role guard |
| Web Screens (≥5) | 0–10 | 7/9+ (dashboard, trips/new, trips/:id, trips/:id/day/:dayNumber, register, login, admin, admin/ai) |
| Admin Panel | 0–10 | ✅ Live — AI prompts versioning + settings management |
| Mobile App (≥3 screens) | 0–9 | ⬜ Not started |
| Deployment | 0–10 | ✅ Vercel live |
| Documentation | 0–6 | ✅ AGENTS.md, CODING_PLAN.md, PROGRESS.md |
| Weather Alerts & Auto-check | — | ✅ Phase 5 complete (Open-Meteo, auto-check, banners, dismiss) |
| **Estimated so far** | **~57** | |

---

## Phase 1 — Foundation ✅