# RouteCrafted — Design Progress Tracker

_Tracks each design change as it is implemented. Update status after each file edit._

---

## Status Legend
- ⬜ Not started
- 🔄 In progress
- ✅ Complete

---

## Phase 0 — Foundation (must complete before all other pages)

| # | Task | File(s) | Status |
|---|---|---|---|
| 0.1 | Add color token extension to tailwind config | `apps/web/tailwind.config.ts` | ⬜ |
| 0.2 | Add font family extension to tailwind config | `apps/web/tailwind.config.ts` | ⬜ |
| 0.3 | Import Google Fonts (Plus Jakarta Sans + Inter) | `apps/web/app/globals.css` | ⬜ |
| 0.4 | Add `body` base reset (bg-surface, on-surface text, Inter font) | `apps/web/app/globals.css` | ⬜ |
| 0.5 | Add `.horizon-gradient` utility class | `apps/web/app/globals.css` | ⬜ |
| 0.6 | Add Material Symbols `<link>` to document head | `apps/web/app/layout.tsx` | ⬜ |

---

## Phase 1 — Shared Shell Components

| # | Task | File(s) | Status |
|---|---|---|---|
| 1.1 | Create fixed frosted-glass top nav header | `apps/web/components/layout/Header.tsx` (new) | ⬜ |
| 1.2 | Create mobile bottom nav bar | `apps/web/components/layout/BottomNav.tsx` (new) | ⬜ |
| 1.3 | Add Header + BottomNav to root layout | `apps/web/app/layout.tsx` | ⬜ |
| 1.4 | Restyle `TripCard.tsx` (light surface, no border, cover image) | `apps/web/components/trips/TripCard.tsx` | ⬜ |
| 1.5 | Restyle `WeatherAlertBanner.tsx` (gradient card) | `apps/web/components/weather/WeatherAlertBanner.tsx` | ⬜ |
| 1.6 | Restyle all AI action buttons (horizon-gradient, rounded-full) | `GenerateItineraryButton.tsx`, `RewriteDayButton.tsx`, `GeneratePlaceCardsButton.tsx` | ⬜ |
| 1.7 | Restyle `AvatarUpload.tsx` avatar background | `apps/web/components/auth/AvatarUpload.tsx` | ⬜ |

---

## Phase 2 — Dashboard (`app/dashboard/page.tsx`)

| # | Task | File(s) | Status |
|---|---|---|---|
| 2.1 | Change page bg to bg-surface, add 12-col grid layout | `app/dashboard/page.tsx` | ⬜ |
| 2.2 | Add left sidebar (Saved Places + Preferences panels) | `app/dashboard/page.tsx` | ⬜ |
| 2.3 | Restyle main header row (My Journeys + New Trip gradient button) | `app/dashboard/page.tsx` | ⬜ |
| 2.4 | Restyle trip card grid to lg:grid-cols-2 | `app/dashboard/page.tsx` | ⬜ |
| 2.5 | Restyle empty/CTA card (dashed border, tonal bg) | `app/dashboard/page.tsx` | ⬜ |

---

## Phase 3 — Landing/Home (`app/page.tsx`)

| # | Task | File(s) | Status |
|---|---|---|---|
| 3.1 | Replace dark hero with bg-surface + 12-col asymmetric grid | `app/page.tsx` | ⬜ |
| 3.2 | Add Ledger trip planner form (right 7 cols) | `app/page.tsx` | ⬜ |
| 3.3 | Add Curator's Tip info card (left 5 cols) | `app/page.tsx` | ⬜ |
| 3.4 | Add Trending Destinations bento grid | `app/page.tsx` | ⬜ |
| 3.5 | Restyle Features section cards | `app/page.tsx` | ⬜ |
| 3.6 | Add FAB button | `app/page.tsx` | ⬜ |

---

## Phase 4 — Trip Detail (`app/trips/[id]/page.tsx`)

| # | Task | File(s) | Status |
|---|---|---|---|
| 4.1 | Change to bg-surface + 12-col two-panel layout | `app/trips/[id]/page.tsx` | ⬜ |
| 4.2 | Add day pill selector (horizontal scroll strip) | `app/trips/[id]/page.tsx` | ⬜ |
| 4.3 | Replace weather banner with gradient card | `app/trips/[id]/page.tsx` | ⬜ |
| 4.4 | Replace DayCard grid with vertical timeline | `app/trips/[id]/page.tsx` | ⬜ |
| 4.5 | Add right sidebar (Route Visual + Budget Tracker + Pro Tip) | `app/trips/[id]/page.tsx` | ⬜ |
| 4.6 | Restyle `DayCard.tsx` as day pill component | `apps/web/components/itinerary/DayCard.tsx` | ⬜ |

---

## Phase 5 — Day Detail (`app/trips/[id]/day/[dayNumber]/page.tsx`)

| # | Task | File(s) | Status |
|---|---|---|---|
| 5.1 | Change to bg-surface + two-col layout | `app/trips/[id]/day/[dayNumber]/page.tsx` | ⬜ |
| 5.2 | Restyle day header (large font-headline + rewrite button) | `app/trips/[id]/day/[dayNumber]/page.tsx` | ⬜ |
| 5.3 | Replace time-block sections with vertical timeline | `app/trips/[id]/day/[dayNumber]/page.tsx` | ⬜ |
| 5.4 | Apply item-type chip colors (meal=tertiary-fixed/30, transport=slate) | `app/trips/[id]/day/[dayNumber]/page.tsx` | ⬜ |

---

## Phase 6 — Trip Form (`app/trips/new/page.tsx` + `TripForm.tsx`)

| # | Task | File(s) | Status |
|---|---|---|---|
| 6.1 | Change page to bg-surface + asymmetric grid (editorial left + Ledger card right) | `app/trips/new/page.tsx` | ⬜ |
| 6.2 | Restyle all form inputs (no border, surface-container-low track, icon prefix) | `components/trips/TripForm.tsx` | ⬜ |
| 6.3 | Replace `<select>` for budget/style/group with pill chip button groups | `components/trips/TripForm.tsx` | ⬜ |
| 6.4 | Replace `<select>` for pacing with segmented control | `components/trips/TripForm.tsx` | ⬜ |
| 6.5 | Restyle submit button (horizon-gradient rounded-full) | `components/trips/TripForm.tsx` | ⬜ |

---

## Phase 7 — Place Card Detail (new page)

| # | Task | File(s) | Status |
|---|---|---|---|
| 7.1 | Create `app/places/[id]/page.tsx` server component | `apps/web/app/places/[id]/page.tsx` (new) | ⬜ |
| 7.2 | Add breadcrumb nav | `app/places/[id]/page.tsx` | ⬜ |
| 7.3 | Add hero section (h-[400px] image + gradient overlay + title) | `app/places/[id]/page.tsx` | ⬜ |
| 7.4 | Add Quick Facts 4-col grid | `app/places/[id]/page.tsx` | ⬜ |
| 7.5 | Add Worth-it/Skip-it 2-col editorial layout | `app/places/[id]/page.tsx` | ⬜ |
| 7.6 | Add action footer (Add to Plan + Keep exploring) | `app/places/[id]/page.tsx` | ⬜ |
| 7.7 | Add "View Details" link from `PlaceCard.tsx` compact grid | `components/places/PlaceCard.tsx` | ⬜ |
| 7.8 | Restyle `PlaceCard.tsx` compact mode | `components/places/PlaceCard.tsx` | ⬜ |

---

## Phase 8 — Profile (`app/profile/page.tsx`)

| # | Task | File(s) | Status |
|---|---|---|---|
| 8.1 | Change page to bg-surface + two-column layout | `app/profile/page.tsx` | ⬜ |
| 8.2 | Restyle avatar card (surface-container-lowest, light tonal) | `app/profile/page.tsx` | ⬜ |
| 8.3 | Restyle profile form inputs (light, matching Phase 6) | `components/auth/ProfileForm.tsx` | ⬜ |
| 8.4 | Add preferences panel (right column) | `app/profile/page.tsx` | ⬜ |

---

## Phase 9 — Button Menus & Workflow Components

| # | Task | File(s) | Status |
|---|---|---|---|
| 9.1 | `TripCardMenu.tsx` — "⋯" context menu (Edit, Duplicate, Status, Delete) | `components/trips/TripCardMenu.tsx` (new) | ⬜ |
| 9.2 | Wire `TripCardMenu` into `TripCard.tsx` as absolute top-right overlay | `components/trips/TripCard.tsx` | ⬜ |
| 9.3 | `TripStatusToggle.tsx` — segmented status control on trip detail | `components/trips/TripStatusToggle.tsx` (new) | ⬜ |
| 9.4 | Add status toggle to trip detail header | `app/trips/[id]/page.tsx` | ⬜ |
| 9.5 | `ConfirmDeleteModal.tsx` — reusable destructive confirm modal | `components/ui/ConfirmDeleteModal.tsx` (new) | ⬜ |
| 9.6 | Wire delete action: TripCardMenu → ConfirmDeleteModal → DELETE `/api/trips/{id}` | `TripCard.tsx` + `TripCardMenu.tsx` | ⬜ |
| 9.7 | Hover-reveal action strip on timeline item cards (edit + delete icons) | `app/trips/[id]/day/[dayNumber]/page.tsx` | ⬜ |
| 9.8 | Inline item edit form (save/cancel within card) | `app/trips/[id]/day/[dayNumber]/page.tsx` | ⬜ |
| 9.9 | Fix WeatherAlertBanner: add `<Link>` to affected day | `components/weather/WeatherAlertBanner.tsx` | ⬜ |
| 9.10 | `AddActivityButton.tsx` + inline "Add a stop" form on day detail | `components/itinerary/AddActivityButton.tsx` (new) | ⬜ |
| 9.11 | New POST `/api/itinerary/items` route for adding single items | `app/api/itinerary/items/route.ts` (new POST handler) | ⬜ |
| 9.12 | Split Place Cards button: "Generate" vs "Add more cards" | `components/places/GeneratePlaceCardsButton.tsx` | ⬜ |
| 9.13 | `app/trips/[id]/edit/page.tsx` — Edit trip form page | `app/trips/[id]/edit/page.tsx` (new) | ⬜ |
| 9.14 | Add `defaultValues` prop to `TripForm.tsx` | `components/trips/TripForm.tsx` | ⬜ |
| 9.15 | `TripFilterBar.tsx` — Dashboard filter chips + sort dropdown | `components/trips/TripFilterBar.tsx` (new) | ⬜ |
| 9.16 | Wire `TripFilterBar` into dashboard | `app/dashboard/page.tsx` | ⬜ |
| 9.17 | Rewrite Day 2-step flow: prompt panel with optional reason textarea | `components/itinerary/RewriteDayButton.tsx` | ⬜ |
| 9.18 | Pass `reason` field through to `/api/itinerary/rewrite-day` | `app/api/itinerary/rewrite-day/route.ts` | ⬜ |
| 9.19 | Profile: password change collapsible panel + POST `/api/profile/password` | `app/profile/page.tsx` + `app/api/profile/password/route.ts` (new) | ⬜ |
| 9.20 | Profile: "Danger zone" delete account section | `app/profile/page.tsx` | ⬜ |
| 9.21 | `ProfileMenu.tsx` — account dropdown in header (Profile / Admin / Sign out) | `components/layout/ProfileMenu.tsx` (new) | ⬜ |
| 9.22 | Wire `ProfileMenu` into `Header.tsx`, replace standalone "Sign out" button | `components/layout/Header.tsx` | ⬜ |

---

## Updated Completion Summary

| Phase | Items | Done | % |
|---|---|---|---|
| 0 — Foundation | 6 | 0 | 0% |
| 1 — Shared Shell | 7 | 0 | 0% |
| 2 — Dashboard | 5 | 0 | 0% |
| 3 — Home | 6 | 0 | 0% |
| 4 — Trip Detail | 6 | 0 | 0% |
| 5 — Day Detail | 4 | 0 | 0% |
| 6 — Trip Form | 5 | 0 | 0% |
| 7 — Place Card Detail | 8 | 0 | 0% |
| 8 — Profile | 4 | 0 | 0% |
| 9 — Button Menus & Workflows | 22 | 0 | 0% |
| **Total** | **73** | **0** | **0%** |
