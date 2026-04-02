# RouteCrafted

> **Smart AI-powered travel itinerary builder** — live at [RouteCrafted.com](https://RouteCrafted.com)

RouteCrafted is the Capstone Project for the **[Full Stack Apps with AI](https://softuni.bg)** course at **SoftUni**. It is a multi-platform full-stack application that uses AI to generate practical, personalised, day-by-day travel plans — and keeps them useful when conditions change.

---

## 🧭 Business Need

Planning a trip requires piecing together dozens of blogs, maps, and booking pages to build a practical day-by-day schedule. Existing AI planners can produce impressive-looking itineraries but often fail on operational realism — bad timing, closed venues, and no adaptation once the trip starts.

**RouteCrafted solves this by:**
- Generating structured day-by-day itineraries from destination, dates, budget, travel style, and group type
- Monitoring weather forecasts and offering smart rewrites when conditions change
- Providing mobile-optimised **"Worth It / Skip It"** decision cards for every attraction, restaurant, or activity

The target audience is mobile-first leisure travellers aged 25–45 who want fast, trustworthy planning without the research overhead.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| **AI Itinerary Builder** | Morning/afternoon/evening activity blocks with cost estimates and meal suggestions |
| **Weather-Aware Replanning** | Detects forecast disruptions and rewrites affected days |
| **Worth It / Skip It Cards** | AI-generated mobile decision cards with verdict, reasons, cost level, and time needed |
| **Save, Edit & Regenerate** | Edit single items, regenerate a day, or rebuild the full trip |
| **Account & Trip Management** | JWT-authenticated user accounts with traveler and admin roles |
| **Admin Panel** | User management, content moderation, and platform usage statistics |

---

## 🏗️ Technical Implementation

The application is built as a **Node.js monorepo** with two apps sharing a common TypeScript types package:
