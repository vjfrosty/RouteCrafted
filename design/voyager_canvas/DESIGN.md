# Design System Strategy: The Modern Cartographer

## 1. Overview & Creative North Star
This design system moves away from the "utility-first" clutter of traditional travel apps. Our Creative North Star is **"The Modern Cartographer"**—an editorial approach that treats every trip itinerary like a premium travel journal. We balance the precision of an organized planner with the atmospheric beauty of a horizon at sunset.

To achieve a "High-End Editorial" feel, this system avoids rigid grids and standard "box-and-border" layouts. Instead, we use **Intentional Asymmetry**, **Tonal Layering**, and **Heroic Typography Scales**. The goal is to make the user feel like they are not just filling out a form, but curating an experience.

---

## 2. Colors & Surface Logic
The palette is grounded in deep, trustworthy navies (`on_secondary_fixed`) and energized by "Clear-Sky" blues (`primary`). We avoid the "flat" look of 2010s SaaS by utilizing a sophisticated material hierarchy.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Boundaries must be defined through background color shifts. 
- Use a `surface_container_low` section sitting against a `surface` background to define a sidebar or header.
- High-priority interactive areas should use `surface_container_highest` to draw the eye without the "trap" of a border.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of frosted glass:
1. **Base Layer:** `surface` (#f9f9ff)
2. **Subtle Grouping:** `surface_container_low` (#f0f3ff)
3. **Interactive Cards:** `surface_container_lowest` (#ffffff) for maximum "lift" and clarity.
4. **Active Overlays:** `surface_bright` with 80% opacity for modals.

### Signature Textures
- **The Horizon Gradient:** For main CTAs or Hero sections, use a linear gradient transitioning from `primary` (#0058be) to `primary_container` (#2170e4) at a 135-degree angle. This provides a "soulful" depth that flat hex codes cannot achieve.
- **Atmospheric Depth:** Apply a subtle `tertiary_fixed` (#ffe24c) accent to weather-related icons or high-priority "Action" chips to mimic the warmth of the sun.

---

## 3. Typography: The Editorial Voice
We use a high-contrast pairing of **Plus Jakarta Sans** for headlines and **Inter** for utility.

- **Display & Headlines:** Use `display-lg` and `headline-lg` (Plus Jakarta Sans) with tight letter-spacing (-0.02em). These should feel authoritative and cinematic. 
- **The Utility Layer:** `body-md` and `label-md` (Inter) provide the "organized" side of the brand. They must remain clean, using the `on_surface_variant` color (#424754) for secondary information to maintain a sophisticated hierarchy.
- **Intentional Scale:** Don't be afraid of the "jump." A `display-sm` headline next to a `label-sm` metadata tag creates a high-end editorial rhythm that feels like a boutique travel magazine.

---

## 4. Elevation & Depth
Depth is a functional tool, not a decoration. We use **Tonal Layering** to convey hierarchy.

- **The Layering Principle:** Place a `surface_container_lowest` card on top of a `surface_container_low` background. This creates a natural "pop" based on light physics rather than digital artifice.
- **Ambient Shadows:** For floating elements like "Plan Trip" FABs, use a 32px blur, 8px Y-offset shadow at 6% opacity using a tint of `on_surface` (#111c2d). It should feel like a soft glow, not a dark smudge.
- **The Glassmorphism Rule:** For mobile navigation bars or floating weather widgets, use the `surface` color at 70% opacity with a `backdrop-filter: blur(12px)`. This allows the "adventure" (the map or photos) to bleed through the UI, softening the interface.
- **Ghost Borders:** If accessibility requires a stroke (e.g., in high-contrast mode), use `outline_variant` (#c2c6d6) at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

### Cards (The "Ledger" Card)
Cards are the primary vehicle for trip data. 
- **Styling:** No borders. Use `surface_container_lowest` background. 
- **Corner Radius:** `xl` (1.5rem) for a friendly, premium feel. 
- **Spacing:** Use 24px internal padding (`3rem` equivalent in the spacing scale) to allow the content to breathe.

### Buttons (The "Pathfinder" Action)
- **Primary:** Gradient fill (Primary to Primary Container), `full` roundedness, and `title-sm` typography.
- **Secondary:** `surface_container_high` background with `on_secondary_container` text. No border.
- **Tertiary/Ghost:** No background. Use `primary` text with an icon.

### Chips (Weather & Transport)
- Use `secondary_container` for inactive states and `tertiary_fixed` for "Alert" or "Active" states (like a flight delay).
- Corner radius: `md` (0.75rem).

### Form Inputs (The "Trip Entry")
- **Field:** Use `surface_container_low` for the input track. 
- **Interaction:** On focus, transition the background to `surface_container_lowest` and add a 2px "Ghost Border" of `primary` at 40% opacity.
- **Labels:** Always use `label-md` in `on_surface_variant`.

### Lists & Dividers
- **Forbid Dividers:** Do not use horizontal lines. 
- **Alternative:** Use `1.5rem` of vertical whitespace or a subtle change in background color between list items.

---

## 6. Do's and Don'ts

### Do:
- **Do** use generous whitespace. High-end design feels expensive because it isn't "crowded."
- **Do** use `plusJakartaSans` for large numbers (dates, prices) to give them a "Designed" feel.
- **Do** use the `secondary` (#575a8c) color for icons to keep them legible but softer than pure black.

### Don't:
- **Don't** use a shadow and a border at the same time. Choose one (preferably tonal layering).
- **Don't** use pure black (#000000) for text. Use `on_surface` (#111c2d) to maintain the navy-inspired "Modern Cartographer" depth.
- **Don't** use a card inside another card with the same background color. Always shift the tonal tier (e.g., Low to Lowest).

---

## 7. Accessibility Note
While we prioritize "Editorial Softness," the `on_surface` to `surface` contrast ratio must always exceed 4.5:1. For critical trip data (flight numbers, departure times), always use `title-md` or `title-sm` in `on_surface` to ensure legibility during stressful travel moments.