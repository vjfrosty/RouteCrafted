# PROGRESS.md — RouteCrafted

_Last updated: 7 April 2026 — Phase 8 complete_

---

## Current State

Phase 8 (Uploads, Email & Push) is complete and building cleanly. Users can upload avatar photos and trip cover images (stored in Cloudflare R2). Welcome emails are sent on registration via Resend. Expo push notifications fire when a weather alert is detected. Build produces 45 dynamic routes.

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
| **6 — Place Cards** | ✅ Done | AI Worth It/Skip It cards, OpenTripMap enrichment, flag/report flow |
| **7 — Admin + Polish** | ✅ Done | Admin users/flags, mobile JWT API, Expo app (5 screens), profile page |
| **8 — Uploads, Email & Push** | ✅ Done | Cloudflare R2 avatar+cover uploads, Resend welcome email, Expo push notifications |

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

## Phase 6 — Place Cards ✅

### New Files
| File | Purpose |
|---|---|
| `apps/web/lib/places/opentripmap.ts` | Optional OpenTripMap enrichment — `searchPoi()` returns category, coords, image URL; no-ops gracefully when `OPENTRIPMAP_KEY` is absent |
| `apps/web/lib/db/places.ts` | DB helpers — `getPlaceCardsByTrip`, `getAllPlaceCardsByTrip`, `getPlaceCardById`, `insertPlaceCard`, `linkItemToCard`, `flagPlaceCard`, `getOpenFlags`, `resolveFlag` |
| `apps/web/lib/ai/schemas.ts` | Added `placeCardResponseSchema` + `PlaceCardResponse` type |
| `apps/web/app/api/places/generate-cards/route.ts` | `POST` — collects activity items without a card, calls AI per item, inserts card, links `itineraryItems.placeCardId`. Max 8 cards per call (idempotent — skips items that already have a card) |
| `apps/web/app/api/places/cards/[tripId]/route.ts` | `GET` — list all non-flagged cards for a trip (ownership-checked) |
| `apps/web/app/api/places/flag/[id]/route.ts` | `POST` — flag a card as inaccurate (ownership via card → trip → userId); inserts `admin_flags` row, sets `place_cards.flagged = true` |
| `apps/web/components/places/PlaceCard.tsx` | Client card — verdict badge, worth-it/skip-it reason lists, meta chips (cost, time, best-for), inline flag form |
| `apps/web/components/places/GeneratePlaceCardsButton.tsx` | Client button — POST → loading → `router.refresh()`; hidden when no itinerary exists |

### Modified Files
- **`trips/[id]/page.tsx`** — added `getPlaceCardsByTrip()` to `Promise.all`; Place Cards section rendered above itinerary (empty-state message when no cards; 2-col grid when cards exist)

### Key Decisions
- **Idempotent generation** — `generate-cards` only processes items with `placeCardId === null`; already-carded items are skipped
- **Batch limit** — max 8 cards per click to control AI token spend; call again to generate remaining items
- **OpenTripMap optional** — if `OPENTRIPMAP_KEY` is absent the API still works; `category` defaults to `'attraction'` and `imageUrl` is null
- **No schema migrations** — `place_cards` and `admin_flags` tables were migrated in Phase 2; `itinerary_items.placeCardId` column also existed from Phase 2
- **Flag flow** — user flags trigger an `admin_flags` row + mark card `flagged = true`; flagged cards are hidden from `getPlaceCardsByTrip` (admin-only retrieval via `getAllPlaceCardsByTrip`)

---

## Phase 7 — Admin + Polish ✅

### Admin API Routes (6 new routes)
| Route | Method | Purpose |
|---|---|---|
| `/api/admin/users` | GET | Paginated user list (admin only) |
| `/api/admin/users/[id]` | PATCH | Change user role (prevents self-demotion) |
| `/api/admin/flags` | GET | List open moderation flags |
| `/api/admin/flags/[id]` | PATCH | Resolve or dismiss a flag (dismiss also unflagged the card) |
| `/api/admin/cards/[id]` | DELETE | Delete a place card (nulls item refs, cascades flags) |
| `/api/admin/stats` | GET | Platform counts: users, trips, cards, alerts, open flags |

### Mobile Auth + API Routes (6 new routes)
| Route | Method | Purpose |
|---|---|---|
| `/api/auth/mobile` | POST | Credentials → 30-day HS256 JWT (Expo SecureStore) |
| `/api/mobile/trips` | GET | Bearer-auth trip list for mobile |
| `/api/mobile/trips/[id]` | GET | Bearer-auth trip detail with days+items |
| `/api/mobile/cards/[tripId]` | GET | Bearer-auth place cards for a trip |
| `/api/mobile/card/[id]` | GET | Bearer-auth single place card (card detail screen) |
| `/api/mobile/profile` | GET | Bearer-auth user profile |
| `/api/profile` | GET + PATCH | Web session-protected profile API |

### New Auth Libs
- **`lib/auth/mobile-jwt.ts`** — `signMobileToken` / `verifyMobileToken` (jose, HS256, 30-day expiry)
- **`lib/auth/verify-bearer.ts`** — extracts + verifies Bearer token from `Authorization` header

### Admin UI
- **`/admin`** — updated dashboard: live stats row (users/trips/cards/open-flags), clickable cards for Users and Flags sections
- **`/admin/users`** — paginated user table with `<AdminUserRow>` client component; Make Admin / Demote buttons; prevents self-demotion
- **`/admin/flags`** — moderation queue with `<AdminFlagRow>` client component; Dismiss Flag, Mark Resolved, Delete Card actions

### Profile Page
- **`/profile`** — server component showing avatar initials, email, role badge; `<ProfileForm>` client component to update display name via PATCH `/api/profile`

### Expo Mobile App (`apps/mobile/`)

| File | Purpose |
|---|---|
| `app.json` | Expo config — scheme `routecrafted`, expo-router plugin |
| `tsconfig.json` | Extends expo/tsconfig.base, strict mode |
| `lib/api.ts` | `apiFetch<T>()` — reads token from SecureStore, sets `Authorization: Bearer` header |
| `lib/auth.tsx` | `AuthProvider` + `useAuth()` context — login/logout, token persistence |
| `app/_layout.tsx` | Root layout — wraps in `AuthProvider`, guards with redirect to `/login` |
| `app/(tabs)/_layout.tsx` | Tab bar: My Trips + Profile tabs |
| `app/(tabs)/index.tsx` | **Screen 1 — My Trips** — FlatList with pull-to-refresh, taps to Trip Detail |
| `app/(tabs)/profile.tsx` | **Screen 2 — Profile** — avatar initials, email, role, Sign Out button |
| `app/login.tsx` | **Screen 3 — Login** — email/password form → JWT → SecureStore → tabs |
| `app/trip/[id].tsx` | **Screen 4 — Trip Detail** — days list with weather badge, items with cost/time, taps to Card |
| `app/card/[id].tsx` | **Screen 5 — Place Card** — verdict badge, worth-it/skip-it reasons, meta chips |

### Build
- `npx next build` — ✅ 42 routes, clean compile, 0 TypeScript errors

---

## Phase 8 — Uploads, Email & Push ✅

### New Web Files
| File | Purpose |
|---|---|
| `apps/web/lib/storage/r2.ts` | Cloudflare R2 client — `uploadFile`, `deleteFile`, `validateImageFile`, `keyFromUrl` |
| `apps/web/lib/email/resend.ts` | Resend email client — `sendWelcomeEmail`, `sendWeatherAlertEmail` (lazy init) |
| `apps/web/lib/notifications/expo-push.ts` | Expo Push API client — `sendPushNotification`, `sendWeatherPush` (non-fatal) |
| `apps/web/app/api/upload/avatar/route.ts` | POST — multipart avatar upload → R2 → update `users.avatarUrl` |
| `apps/web/app/api/upload/trip-cover/route.ts` | POST — multipart trip cover upload → R2 → update `trips.coverImageUrl` |
| `apps/web/app/api/mobile/push-token/route.ts` | POST (Bearer) — store Expo push token on user record |
| `apps/web/components/auth/AvatarUpload.tsx` | Client — click-to-upload avatar with live preview |
| `apps/web/components/trips/TripCoverUpload.tsx` | Client — click-to-upload trip cover with placeholder state |

### Modified Files
| File | Change |
|---|---|
| `apps/web/lib/db/trips.ts` | Added `coverImageUrl` to `TripUpdate` type |
| `apps/web/lib/weather/check.ts` | Fire-and-forget `sendWeatherPush` after creating each alert |
| `apps/web/app/api/auth/register/route.ts` | Fire-and-forget `sendWelcomeEmail` after user insert |
| `apps/web/app/profile/page.tsx` | Replaced static avatar initials with `<AvatarUpload>` component |
| `apps/web/components/trips/TripCard.tsx` | Added `coverImageUrl` prop + cover image display with gradient overlay |
| `apps/web/app/trips/[id]/page.tsx` | Added `<TripCoverUpload>` block between header and dates |
| `apps/mobile/app/_layout.tsx` | Push registration on login — requests permissions, POSTs token to API |
| `apps/mobile/package.json` | Fixed invalid `react@18.3.2` → `18.3.1`, `react-native@0.76.9` → `0.76.7` |

### Key Decisions
- **Lazy Resend init** — `new Resend(key)` inside getter function; prevents build-time throw when `RESEND_API_KEY` is absent
- **R2 security** — MIME validation (jpeg/png/webp only), 5 MB max, sanitized key names (userId-based); credentials never reach the browser
- **Non-fatal failures** — email, push, and old-file-delete failures are all caught and `console.warn`-ed; never block core user actions
- **Old file cleanup** — both upload routes delete the previous R2 file before uploading the new one
- **`unoptimized` images** — Next.js `<Image>` uses `unoptimized` for R2 URLs to avoid domain-allowlist requirement at build time

### Build
- `npx next build` — ✅ 45 routes, clean compile, 0 TypeScript errors

---

## Capstone Score Tracker

| Criterion | Points | Status |
|---|---|---|
| GitHub Commits (≥15) | 0–15 | ~15+ commits |
| Commit Days (≥3 days) | 0–15 | 2+ days |
| Architecture | 0–5 | ✅ Turborepo monorepo |
| Backend API | 0–7 | ✅ 45 routes live (auth × 4, trips × 4, itinerary × 3, admin × 11, weather × 2, places × 3, mobile × 7, upload × 2, push-token × 1, profile × 1) |
| Database (≥4 tables) | 0–8 | ✅ 9 tables migrated |
| Auth & Security | 0–5 | ✅ Auth.js v5, bcrypt, JWT, mobile HS256 JWT, Zod, ownership checks, admin role guard |
| Web Screens (≥5) | 0–10 | ✅ 10+ (dashboard, trips/new, trips/:id, day/:dayNumber, register, login, admin, admin/ai, admin/users, admin/flags, profile) |
| Admin Panel | 0–10 | ✅ Live — AI prompts, users management, flags moderation queue, live stats |
| Mobile App (≥3 screens) | 0–9 | ✅ 5 screens (Trips, Profile, Login, Trip Detail, Place Card) |
| Deployment | 0–10 | ✅ Vercel live |
| Documentation | 0–6 | ✅ AGENTS.md, CODING_PLAN.md, PROGRESS.md |
| Weather Alerts & Auto-check | — | ✅ Phase 5 complete (Open-Meteo, auto-check, banners, dismiss) |
| Place Cards (Worth It/Skip It) | — | ✅ Phase 6 complete (AI verdicts, grid UI, flag flow) |
| R2 File Uploads (avatar + cover) | — | ✅ Phase 8 complete (multipart upload, MIME validation, old-file cleanup) |
| Resend Email (welcome) | — | ✅ Phase 8 complete (lazy client, fire-and-forget on register) |
| Expo Push Notifications | — | ✅ Phase 8 complete (weather alert push, mobile token registration) |
| **Estimated so far** | **~85** | |

---

## Phase 1 — Foundation ✅