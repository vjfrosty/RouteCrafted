# RouteCrafted — Design Change Plan

_Source: `design/voyager_canvas/DESIGN.md` (The Modern Cartographer) + 4 HTML mockups + screenshots_

---

## Overview

The current app uses a **dark `slate-900/blue-950` gradient** theme with frosted-glass `bg-white/5 border-white/10` cards across all pages. Zero custom fonts, no design system.

The target design is **"The Modern Cartographer"** — a premium editorial travel aesthetic:

| Dimension | Current | Target |
|---|---|---|
| Background | `from-slate-900 via-blue-950 to-slate-900` dark | `#f9f9ff` light surface |
| Cards | `bg-white/5 border border-white/10 rounded-2xl` | `bg-surface-container-lowest rounded-3xl` no border |
| Typography | Tailwind system font | **Plus Jakarta Sans** headlines + **Inter** body/label |
| Colors | `text-white`, `bg-blue-600`, `text-slate-400` | Design token system |
| Layout | Narrow single-column `max-w-3xl` | Asymmetric editorial grids, sidebars, bento |
| Nav | None | Fixed frosted glass header + bottom nav (mobile) |
| Borders | 1px solid everywhere | **No-Line Rule** — tonal background shifts only |
| Buttons | `bg-blue-600 rounded-lg` | Horizon gradient `rounded-full` CTAs |

---

## Design System Foundation — P0 (Global)

### `apps/web/tailwind.config.ts`
Add full color token extension:
```
colors: {
  "primary": "#0058be", "primary-container": "#2170e4", "on-primary": "#ffffff",
  "secondary": "#575a8c", "secondary-container": "#c2c5fe", "on-secondary-container": "#4d5081",
  "on-secondary-fixed": "#131645", "tertiary-fixed": "#ffe24c", "tertiary-fixed-dim": "#e2c62d",
  "on-tertiary-fixed": "#211b00", "on-tertiary-fixed-variant": "#524600",
  "surface": "#f9f9ff", "surface-container-lowest": "#ffffff",
  "surface-container-low": "#f0f3ff", "surface-container": "#e7eeff",
  "surface-container-high": "#dee8ff", "surface-container-highest": "#d8e3fb",
  "on-surface": "#111c2d", "on-surface-variant": "#424754",
  "outline": "#727785", "outline-variant": "#c2c6d6",
  "error": "#ba1a1a", "inverse-surface": "#263143"
}
fontFamily: { headline: ["Plus Jakarta Sans"], body: ["Inter"], label: ["Inter"] }
borderRadius extended: "3xl": "1.5rem", "full": "9999px"
```

### `apps/web/app/globals.css`
- Google Fonts import: Plus Jakarta Sans weights 400–800 + Inter 400–600
- `body { font-family: 'Inter'; background: #f9f9ff; color: #111c2d; }`
- `.horizon-gradient { background: linear-gradient(135deg, #0058be 0%, #2170e4 100%); }`
- Material Symbols font link in `apps/web/app/layout.tsx`

---

## Page 1 — Home/Landing (`app/page.tsx`)
**Current:** "Coming Soon" dark hero. **Target:** Explore/Plan Home (explore_plan_home/code.html)

### Changes:
**P1.1 — Nav bar** (nothing exists → add fixed frosted glass header)
- `fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl h-16 shadow-sm`
- Left: "RouteCrafted" `font-headline font-extrabold text-xl text-on-surface`
- Center: links Explore/Timeline/Budget/Saved — active in `text-primary font-semibold`
- Right: cloud + account icons `text-secondary hover:bg-slate-100 rounded-full`

**P1.2 — Hero section** (replace dark centered hero)
- `grid grid-cols-1 lg:grid-cols-12 gap-8 pt-24`
- Left 5/12: headline "Where to **next?**" (`text-5xl md:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] tracking-tight`, span italic text-primary) + subtext + Curator's Tip info card `bg-surface-container-low p-6 rounded-3xl`
- Right 7/12 — "Ledger" Card: `bg-surface-container-lowest rounded-3xl p-8 shadow-[0_8px_32px_rgba(17,28,45,0.04)]`
  - Destination input: `bg-surface-container-low px-4 py-3 rounded-2xl` no border, `location_on` icon
  - Dates: same, `calendar_today` icon
  - Budget chips: active=`bg-secondary-container`, inactive=`bg-surface-container-high`, `rounded-xl text-xs font-semibold`
  - Pacing: segmented control (`bg-surface-container-low rounded-2xl p-1`, active `bg-white shadow-sm text-primary`)
  - CTA: `w-full horizon-gradient text-white py-5 rounded-full font-headline font-bold text-lg`

**P1.3 — Trending Destinations** (replace 3-col feature grid)
- Section header: `text-primary font-bold text-sm uppercase tracking-widest` + h2 + "View All →"
- Bento grid `grid grid-cols-1 md:grid-cols-12 gap-6`:
  - Tokyo col-span-8 + Paris col-span-4 (row 1)
  - New York col-span-4 + Amalfi col-span-8 (row 2)
  - Each: `rounded-3xl overflow-hidden` photo + `bg-gradient-to-t from-black/80` overlay + `tertiary-fixed` badge + white headline

**P1.4 — Features section:** `bg-surface-container-low p-10 rounded-[2.5rem]` cards with icon in `bg-primary/10 rounded-2xl`

**P1.5 — Mobile bottom nav:** `md:hidden fixed bottom-0 bg-white/70 backdrop-blur-xl rounded-t-3xl`
- 4 tabs with icon + label; active: `bg-blue-100 text-blue-800 rounded-2xl`

**P1.6 — FAB:** `fixed bottom-24 right-6 w-16 h-16 rounded-full horizon-gradient`

---

## Page 2 — Dashboard (`app/dashboard/page.tsx`)
**Current:** Dark gradient single column. **Target:** "My Journeys" (my_trips_dashboard/code.html)

**P2.1 — Page layout:** `bg-surface` + `max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8`

**P2.2 — Left Sidebar (col-span-3, desktop):** Two `bg-surface-container-low p-6 rounded-3xl` panels:
- Saved Places: `favorite` icon, 2 place rows (`w-12 h-12 rounded-xl` thumbnail + name/loc), "View All Saved" ghost button
- Preferences: `person` icon, 3 `bg-surface-container-lowest rounded-2xl` rows with `check_circle`, "Edit Profile" secondary button

**P2.3 — Main header (col-span-9):** "My Journeys" `text-4xl font-headline font-extrabold` + `horizon-gradient` "+ New Trip" button

**P2.4 — Trip Cards:** `bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-md`
- Cover image `h-48` with Ken Burns hover scale
- Status badge `absolute top-4 left-4`: Planned=`bg-tertiary-fixed text-on-tertiary-fixed`, Draft=`bg-surface-container-high`, Completed=`bg-secondary text-on-secondary`
- Body `p-8`: name `text-2xl font-headline font-bold`, date `text-on-surface-variant text-sm` with calendar icon
- Action buttons: context-aware (`flex gap-3 mt-6`) — Quick Edit (edit icon), Regenerate (auto_awesome), View Journal (menu_book)

**P2.5 — Empty/CTA card:** `bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant` centered with `add_location_alt` icon in `bg-primary-fixed rounded-full`

---

## Page 3 — Trip Detail (`app/trips/[id]/page.tsx`)
**Current:** Dark, max-w-3xl, stacked sections. **Target:** Dynamic Itinerary (dynamic_itinerary/code.html)

**P3.1 — Layout:** `bg-surface` + `max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8`

**P3.2 — Day Selector (col-span-8):**
- Title `text-4xl font-headline font-extrabold tracking-tight text-on-surface`
- Day pills `flex gap-3 overflow-x-auto no-scrollbar pb-2` — each pill `w-20 h-24 rounded-2xl`:
  - Active: `bg-primary-container text-on-primary-container shadow-lg`
  - Weather alert: `bg-tertiary-fixed text-on-tertiary-fixed` + `thunderstorm` icon top-right
  - Default: `bg-surface-container-lowest hover:bg-surface-container-high`

**P3.3 — Weather Alert Card:** Replace amber banner
- `bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 shadow-xl text-on-primary-container`
- `warning` filled icon + bold headline + `text-blue-100` body
- `bg-tertiary-fixed text-on-tertiary-fixed rounded-full` "Adjust Plan" button
- Decorative `thunderstorm` icon `absolute -right-4 -bottom-4 text-9xl text-white/10`

**P3.4 — Timeline (replaces day card grid):**
- `relative space-y-12 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-highest`
- Each item `relative flex gap-8 group`:
  - Time indicator: `z-10 w-12 h-12 rounded-full bg-surface-container-lowest shadow-md text-primary flex-shrink-0` with time-of-day icon
  - Card: `bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex-grow group-hover:shadow-md`
    - Time label: `font-label text-sm text-secondary font-semibold uppercase tracking-wider`
    - Name: `font-headline text-2xl font-bold`
    - Category chip: `bg-secondary-container text-on-secondary-container px-3 py-1 rounded-lg text-xs font-bold`
    - Photo thumbnails + "Worth-it card" overlay label

**P3.5 — Right Sidebar (col-span-4):**
- Route Visual panel: `bg-surface-container-lowest rounded-3xl p-6` + map placeholder + distance stat
- Budget Tracker: "Spent Today" big `font-headline` number + categories breakdown + "View Full Expense Report" secondary button
- Pro Tip card: `bg-surface-container-low rounded-3xl p-5` with lightbulb icon + tip text

---

## Page 4 — Day Detail (`app/trips/[id]/day/[dayNumber]/page.tsx`)
**Current:** Dark, morning/afternoon/evening blocks. **Target:** Same timeline pattern as Page 3.

**P4.1:** `bg-surface` + same lg:col-12 two-column grid
**P4.2 — Day header:** `font-headline text-4xl font-extrabold text-on-surface` + date subtext + `horizon-gradient` Rewrite button right-aligned
**P4.3 — Timeline items:** Same `relative flex gap-8` pattern as P3.4, with meal items (`restaurant` icon, `bg-tertiary-fixed/30` meal chip) and transport (`directions_bus` icon, slate chip)

---

## Page 5 — Place Card Detail (new `app/places/[id]/page.tsx`)
**Current:** Inline grid only. **Target:** Full-page editorial (worth_it_skip_it_detail/code.html)

**P5.1 — Breadcrumb:** `text-on-surface-variant text-sm font-medium` — "City > Place Name" with `chevron_right`
**P5.2 — Hero:** `relative h-[400px] rounded-3xl overflow-hidden shadow-xl` + `bg-gradient-to-t from-on-surface/80` overlay + title `text-4xl md:text-5xl font-extrabold text-white font-headline`
**P5.3 — Quick Facts:** `grid grid-cols-2 md:grid-cols-4 gap-4` — each `bg-surface-container-low p-5 rounded-2xl` with icon + label + value
**P5.4 — Editorial 2-col:**
- Worth-it: `bg-surface-container-lowest p-8 rounded-3xl` + `thumb_up` watermark + `bg-primary/10 rounded-xl` icon badge + narrative + `check_circle` bullets (`text-tertiary-fixed-dim`)
- Skip-it: `bg-surface-container-low p-8 rounded-3xl` + `block` watermark + `bg-error/10 rounded-xl` icon + `cancel` bullets (`text-outline`)
**P5.5 — Action footer:** `horizon-gradient rounded-full` "Add to Plan" + `bg-surface-container-high rounded-full` "Keep exploring"

---

## Page 6 — Trip Form (`app/trips/new/page.tsx` + `TripForm.tsx`)
**Current:** Dark inputs. **Target:** "Ledger" Card matching home page form.

**P6.1:** Same asymmetric hero layout as P1.2
**P6.2 — Inputs:** `bg-surface-container-low px-4 py-3 rounded-2xl focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20` + icon + `bg-transparent border-none` input
**P6.3 — Chip groups:** Replace `<select>` for budget/style/group with pill button chip groups
**P6.4 — Pacing:** Segmented control (see P1.2 pattern)
**P6.5 — Submit:** `w-full horizon-gradient text-white py-5 rounded-full font-headline font-bold text-lg`

---

## Page 7 — Profile (`app/profile/page.tsx`)
**Current:** Dark narrow card. **Target:** Light surface, two-column layout.

**P7.1:** `bg-surface` + two-column (col-span-4 / col-span-8)
**P7.2 — Avatar:** `bg-surface-container-lowest rounded-3xl p-8 shadow-sm`, name `font-headline font-bold text-2xl`, role badge `bg-secondary-container text-on-secondary-container rounded-full`
**P7.3 — Form inputs:** Light inputs matching P6.2, save button `horizon-gradient rounded-full`
**P7.4 — Preferences panel (new):** `bg-surface-container-low p-6 rounded-3xl` with toggleable preference chips

---

## Shared Components

| Component | Current | Target |
|---|---|---|
| `TripCard.tsx` | `bg-white/5 border-white/10 rounded-2xl` | `bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm` |
| `WeatherAlertBanner.tsx` | `bg-amber-500/20 rounded-lg` | `bg-gradient-to-br from-primary to-primary-container rounded-3xl` |
| `PlaceCard.tsx` | Dark card inline | Two modes: compact + link to full Page 5 |
| All AI buttons | `bg-blue-600 rounded-lg` | `horizon-gradient rounded-full font-headline font-bold` |
| `AvatarUpload.tsx` | Dark preview bg | `bg-surface-container-high` tonal background |

---

## Button Menus, Workflows & Rearrangements

### BM1 — TripCard "⋯" Context Menu (NEW)
The design mockup already shows a `more_horiz` icon on the Paris/Draft card. Currently there is NO menu — the entire card is just a `<Link>`. 

**Add a `TripCardMenu` client component:**
- Trigger: `more_horiz` icon button, `absolute top-3 right-3 z-10`, `bg-surface-container rounded-full p-1 hover:bg-surface-container-high`
- Dropdown panel: `absolute right-0 top-8 bg-surface-container-lowest rounded-2xl shadow-lg py-2 w-44 z-20` — shown on click (toggle state)
- Menu items (each `flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-container-low`):
  1. `edit` icon — "Edit trip" → navigates to `/trips/{id}/edit` (new page, see BM8)
  2. `content_copy` icon — "Duplicate" → POST `/api/trips` with same data → `router.refresh()`
  3. `flag` icon — "Change status" → opens inline select/chip group (see BM2)
  4. `delete` icon — "Delete trip" → `text-error` color → opens confirmation modal (see BM3)
- **Close on outside click** via `useEffect` + `document.addEventListener('mousedown', …)`
- **Cards where shown:** All cards on Dashboard. On the trip detail page header, promote to a visible secondary button row.

### BM2 — Trip Status Toggle (NEW)
Currently the `status` field (draft/active/completed) is set at creation and never changeable via UI.

**Add inline status segmented control on trip detail page header:**
- Position: Below the trip title, left side — `flex items-center gap-2`
- Style: Segmented control pattern from design system — `bg-surface-container-low p-1 rounded-2xl` wrapper, `rounded-xl px-3 py-1 text-xs font-semibold` pills
- States: Draft (`bg-surface-container-high`), Active (`bg-primary-container text-on-primary-container`), Completed (`bg-secondary text-on-secondary`)
- Action: `PATCH /api/trips/{id}` `{ status }` → `router.refresh()` (reuse existing `updateTrip`)
- **Client component:** wrap in `TripStatusToggle.tsx`

### BM3 — Delete Confirmation Modal (NEW)
Currently there is no "delete trip" UI at all. A destructive action must never fire immediately.

**Add `ConfirmDeleteModal.tsx` client component:**
- Trigger: "Delete trip" from BM1 context menu
- Overlay: `fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center`
- Modal card: `bg-surface-container-lowest rounded-3xl p-8 max-w-sm w-full shadow-2xl`
  - `delete_forever` icon + `text-error` heading "Delete trip?"
  - Body: `text-on-surface-variant text-sm` "This will permanently delete **{trip name}** and all its days and place cards. This cannot be undone."
  - Buttons row: "Cancel" (`bg-surface-container-high rounded-full px-6 py-3`) + "Delete" (`bg-error text-white rounded-full px-6 py-3 font-headline font-bold`)
- Action: DELETE `/api/trips/{id}` → `router.push('/dashboard')`
- **Reuse for:** "Remove item" on day detail (see BM6), "Clear itinerary" (see BM7)

### BM4 — Itinerary Item Actions (NEW)
Day detail page shows items as read-only cards. The `more_horiz` (or hover reveal) pattern from the design should expose per-item actions.

**Add hover-reveal action strip on each timeline activity card:**
- Trigger: `group-hover` visibility — `opacity-0 group-hover:opacity-100 transition-opacity`
- Position: `absolute top-4 right-4 flex items-center gap-1`
- Buttons (each `w-8 h-8 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center`):
  1. `edit` icon → toggles inline edit form (title + time + notes — simple `<input>` and `<textarea>` inside the card)
  2. `delete` icon → opens `ConfirmDeleteModal` (see BM3) → DELETE `/api/itinerary/items/{id}` → `router.refresh()`
- **Inline edit form:** replaces card read-only content; "Save" (`horizon-gradient rounded-full text-sm px-4 py-2`) + "Cancel" (ghost) at bottom

### BM5 — WeatherAlertBanner: Day Navigation Link (NEW + WORKFLOW FIX)
**Current problem:** Alert banners show "Day 3: Heavy Rain" but there is no way to navigate to Day 3 from the banner — user must scroll to the day grid.

**Fix:** Wrap the day date/number inside the alert with a `<Link>`:
- `<Link href="/trips/{tripId}/day/{alert.dayNumber}">` around the day reference text
- Style: `underline decoration-dotted text-white/90 hover:text-white` (within the gradient card)
- Also add to the existing amber banner variant: a small `arrow_forward` icon after the day label

### BM6 — "Add Activity" Button per Day (NEW WORKFLOW)
Currently users can only rewrite an entire day — there is no way to add a single stop.

**Add `AddActivityButton.tsx` to day detail page:**
- Position: After the last timeline item, before the page closes — `flex justify-center mt-8`
- Style: Ghost/tertiary style — `flex items-center gap-2 text-primary font-semibold border-2 border-dashed border-primary/30 rounded-2xl px-8 py-4 hover:bg-primary/5 transition`
- Icon: `add_circle` (outlined)
- Label: "Add a stop"
- Clicking opens an **inline form panel** (not a modal) that slides in after the last item:
  - Fields: Activity name (`text-on-surface`), Time (`HH:MM`), Duration, Notes, Time block selector (morning/afternoon/evening) — styled with light design-system inputs (BM pattern from P6.2)
  - Buttons: "Add to day" (`horizon-gradient rounded-full`) + "Cancel" (ghost)
  - Action: POST `/api/itinerary/items` `{ dayId, name, time, duration, notes, timeBlock }` → `router.refresh()`

### BM7 — "Regenerate" vs "Add More" Split on Place Cards Section (WORKFLOW REARRANGEMENT)
**Current problem:** `GeneratePlaceCardsButton` generates ALL remaining cards at once (max 8), then hides. Once cards exist, the only interaction per card is the flag form. There is no "need more" or "clear + regenerate" option.

**Rearrange the Place Cards section header:**
- Remove: Single `bg-violet-600` button
- Replace with two contextual buttons side by side:
  1. **"✦ Add more cards"** (shown only when cards exist AND uncarded items remain) — same POST action, `bg-surface-container-high text-on-secondary-container rounded-full px-5 py-2 font-label font-semibold text-sm`
  2. **"Generate place cards"** (shown only when NO cards exist) — `horizon-gradient text-white rounded-full ... font-headline font-bold` (first-time generate, prominent)
- Both use same POST `/api/places/generate-cards` action

### BM8 — Edit Trip Page (NEW PAGE / MISSING WORKFLOW)
**Current problem:** After trip creation, all trip metadata (destination, dates, preferences) is read-only. No edit form exists.

**Add `/trips/{id}/edit/page.tsx`:**
- Reuse `TripForm.tsx` with pre-populated values (pass `trip` prop)
- Page header: "Edit trip" with back link `←` to trip detail
- Submit button: "Save changes" (`horizon-gradient rounded-full`) → PATCH `/api/trips/{id}` → `router.push('/trips/{id}')`
- **TripForm.tsx change needed:** add optional `defaultValues: TripInsert` prop; pre-populate all fields if provided

### BM9 — Dashboard Filter/Sort Bar (NEW)
**Current problem:** As trip count grows, no status filter or sort exists. The dashboard is one unsorted grid.

**Add a filter bar below the "My Journeys" header (above the grid):**
- Style: `flex items-center gap-3 mb-6`
- Filter chips (All / Planned / Active / Draft / Completed): same pill chip pattern — active=`bg-primary-container text-on-primary-container`, inactive=`bg-surface-container-high text-on-secondary-container`, `rounded-full px-4 py-2 text-sm font-semibold`
- Sort dropdown (right side): `bg-surface-container-low rounded-full px-4 py-2 text-sm font-label flex items-center gap-2` — "Sort: Newest ▾" with `expand_more` icon
  - Dropdown options: Newest first, Trip start date, Name A–Z
  - Style: `bg-surface-container-lowest rounded-2xl shadow-lg py-2 w-44` dropdown
- **Client component:** `TripFilterBar.tsx` — filters locally (no API call needed if all trips are loaded client-side) or adds URL search params

### BM10 — Rewrite Day: "Reason" Optional Input (WORKFLOW IMPROVEMENT)
**Current state:** `RewriteDayButton` fires AI rewrite immediately with no user context. The "reason" field (`rewrite_day_reason_context` setting) exists in the DB but the button never sends a reason.

**Rearrange the Rewrite Day button into a 2-step interaction:**
- Step 1: Button click opens an **inline prompt panel** that appears above the day timeline:
  - `bg-surface-container-low rounded-3xl p-5` panel
  - Optional `<textarea>` with placeholder "Tell the AI what to change (optional) — e.g. 'more indoor activities', 'vegetarian restaurants only'"
  - `font-label text-sm text-on-surface-variant` label "Rewrite reason (optional)"
  - Buttons: "Rewrite Day" (`horizon-gradient rounded-full font-headline font-bold`) + "Cancel" (ghost)
- Step 2: On confirm, POST to `/api/itinerary/rewrite-day` with optional `reason` field → existing flow

### BM11 — Profile: Password + Account Actions (NEW)
**Current profile page gaps:** No password change, no email update, no "Delete account".

**Add expandable sections below `ProfileForm`:**
- "Change password" section: `bg-surface-container-low p-6 rounded-3xl` collapsible panel — current password + new password + confirm new password inputs, "Update password" `horizon-gradient rounded-full` button → POST `/api/profile/password` (new route needed)
- "Danger zone" section: `bg-error/5 border border-error/20 rounded-3xl p-6` — "Delete account" button `text-error border border-error/30 rounded-full hover:bg-error hover:text-white transition`

### BM12 — Navigation Rearrangement: Global Header Links
**Current:** Dashboard has "+ Plan a trip" + "Sign out" in the top-right corner. Every other page has no nav at all.

**Rearrange navigation consistently across ALL pages (from P1.1 plan):**
- Left: "RouteCrafted" logo → `<Link href="/dashboard">`
- Center (desktop): Persistent links:
  - `Trips` → `/dashboard` (active when on dashboard or `/trips/*`)
  - `Explore` → `/` (active on home)
  - No "Timeline" or "Budget" as top-level nav items (those are feature sections, not page routes)
- Right: `cloud_queue` icon (links to weather overview when clicked) + `account_circle` icon (opens **profile dropdown** — see below)

**Profile dropdown (replaced "Sign out" button):**
- Trigger: `account_circle` icon in top-right nav
- Dropdown: `absolute right-0 top-12 bg-surface-container-lowest rounded-2xl shadow-lg py-2 w-48 z-50`
  - User name + email (display row, non-clickable, `text-xs text-on-surface-variant`)
  - `hr` → tonal divider spacer (`border-surface-container-high`)
  - `person` "Profile" → `/profile`
  - `admin_panel_settings` "Admin" → `/admin` (only shown if `session.user.role === 'admin'`)
  - `logout` "Sign out" → POST `/api/auth/signout`
- Client component: `ProfileMenu.tsx` with outside-click close

---

## Implementation Priority

| # | Item | Priority |
|---|---|---|
| 0 | Tailwind config + globals fonts + layout.tsx | P0 |
| 1 | Shared nav header component | P1 |
| 2 | `TripCard.tsx` restyle | P1 |
| 3 | Dashboard (Page 2) | P2 |
| 4 | Landing/Home (Page 1) | P2 |
| 5 | Trip Detail (Page 3) | P3 |
| 6 | Day Detail (Page 4) | P3 |
| 7 | Trip Form (Page 6) | P4 |
| 8 | Place Card Detail page (Page 5) | P4 |
| 9 | Profile (Page 7) | P5 |
| 10 | Remaining shared component polish | P5 |

---

## Token Quick Reference

```
Background:   bg-surface (#f9f9ff)
Cards:        bg-surface-container-lowest (#ffffff)
Sections:     bg-surface-container-low (#f0f3ff)
Active:       bg-surface-container-high (#dee8ff)

Primary:      #0058be → gradient to #2170e4
Secondary:    #575a8c
Alert yellow: #ffe24c (tertiary-fixed)
Error:        #ba1a1a

Text:         #111c2d (on-surface)
Text muted:   #424754 (on-surface-variant)
Text hint:    #727785 (outline)
```
