# RouteCrafted — Integrations Guide (Free-Tier Focus)

Every integration listed here has a confirmed free or open tier sufficient for capstone development and early production use. Where a service is also the one named in the capstone requirements, that is noted explicitly.

---

## 1\. Hosting & Deployment

### Vercel (Recommended — capstone-named provider)

Vercel is the team behind Next.js and offers the tightest integration for Next.js deployments. It is one of the deployment platforms named in the capstone brief.

| Detail | Value |
| :---- | :---- |
| **Free tier** | 100 GB bandwidth/month, 6,000 build minutes/month, 100 GB-hours serverless execution |
| **Next.js support** | Native SSR, SSG, API routes, image optimization with zero config |
| **CDN** | Global edge network with automatic SSL |
| **Integration** | Connect GitHub repo; auto-deploy on push |
| **URL** | [https://vercel.com](https://vercel.com) |

**Setup:** `npm i -g vercel && vercel` from the monorepo root. Pull env vars with `vercel env pull .env.local`.

### Netlify (Alternative)

Netlify is also named in the capstone brief as an acceptable serverless platform. It is simpler to configure for teams less familiar with Vercel.

| Detail | Value |
| :---- | :---- |
| **Free tier** | 100 GB bandwidth/month, 300 build minutes/month, 125,000 serverless function requests/month |
| **Next.js support** | Handles SSR via Netlify Edge Functions |
| **URL** | [https://www.netlify.com](https://www.netlify.com) |

---

## 2\. Database

### Neon Serverless PostgreSQL (Capstone-named service)

Neon is the exact database service named in the capstone requirements. It provides serverless PostgreSQL with branching and scale-to-zero, making it practical for capstone development where the database sits idle between coding sessions.

| Detail | Value |
| :---- | :---- |
| **Free tier** | 0.5 GB storage, 100 compute-hours/month, 1 project with 10 branches, shared 1 GB RAM |
| **Scale-to-zero** | Yes — 5-minute idle timeout; cold start \~300–500 ms |
| **Versions supported** | PostgreSQL 14, 15, 16 |
| **ORM** | Used with Drizzle ORM (also capstone-required) |
| **Branching** | Instant database branches for feature development |
| **URL** | [https://neon.tech](https://neon.tech) |

**Setup:**

npm install @neondatabase/serverless drizzle-orm drizzle-kit

Set `DATABASE_URL` in `.env.local`. Use `drizzle-kit generate` and `drizzle-kit migrate` for schema changes.

**Note:** Drizzle migrations must be committed to the GitHub repo as required by the capstone.

---

## 3\. AI / LLM — Itinerary Generation & Rewriting

### Google Gemini API (Top recommendation for free tier)

Google Gemini 2.0 Flash is the best option for a capstone with free API access. It offers 1,500 requests per day on the free tier, which is more than enough for development, testing, and demo use.

| Detail | Value |
| :---- | :---- |
| **Free tier** | 1,500 requests/day, 1 million tokens/minute (Gemini 2.0 Flash) |
| **Models** | Gemini 2.0 Flash (fast), Gemini 1.5 Pro (longer context) |
| **Best for** | Itinerary generation, weather-aware rewrites, "worth it / skip it" summaries |
| **SDK** | `@google/generative-ai` npm package |
| **URL** | [https://aistudio.google.com](https://aistudio.google.com) |

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI \= new GoogleGenerativeAI(process.env.GEMINI\_API\_KEY\!);

const model \= genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const result \= await model.generateContent(prompt);

### Groq (Fast inference alternative)

Groq offers Llama 3.3 70B and Mixtral 8x7B with very fast inference and a free tier suitable for prototyping.

| Detail | Value |
| :---- | :---- |
| **Free tier** | 30 requests/minute, 14,400 requests/day |
| **Models** | Llama 3.3 70B, Mixtral 8x7B |
| **Latency** | Industry-leading token generation speed |
| **SDK** | `groq-sdk` npm package |
| **URL** | [https://console.groq.com](https://console.groq.com) |

### OpenRouter (Multi-model fallback)

OpenRouter routes to 100+ models including Claude, DeepSeek, and Llama through a single API key. Useful if you want to experiment with different models without changing your integration code.

| Detail | Value |
| :---- | :---- |
| **Free tier** | Free credits on signup; many open models available at $0 cost |
| **SDK** | OpenAI-compatible API — works with `openai` npm package |
| **URL** | [https://openrouter.ai](https://openrouter.ai) |

**Recommendation for RouteCrafted:** Use Gemini 2.0 Flash as the primary LLM. Use Groq as a fallback for fast streaming responses during demo. Keep OpenRouter as a backup switcher.

---

## 4\. Weather API

### Open-Meteo (Top recommendation — fully free, no key required)

Open-Meteo is the best choice for RouteCrafted's weather-aware replanning feature. It is open-source, requires no API key, no registration, and no credit card. It provides hourly and daily forecasts for any location worldwide.

| Detail | Value |
| :---- | :---- |
| **Free tier** | Unlimited for non-commercial use; no API key required |
| **Rate limit** | Fair use; up to 10,000 API calls/day comfortably |
| **Data** | Current conditions, hourly forecast, 7-day daily forecast |
| **Format** | JSON, no auth header needed |
| **URL** | [https://open-meteo.com](https://open-meteo.com) |

// No API key needed

const url \= \`https://api.open-meteo.com/v1/forecast?latitude=${lat}\&longitude=${lon}\&daily=weathercode,temperature\_2m\_max,precipitation\_probability\_max\&forecast\_days=7\`;

const res \= await fetch(url);

const data \= await res.json();

### OpenWeatherMap (Alternative with named landmarks)

Use if you need named city search alongside weather in one API.

| Detail | Value |
| :---- | :---- |
| **Free tier** | 60 calls/minute, 1,000,000 calls/month |
| **Data** | Current weather, 5-day/3-hour forecast, weather alerts |
| **Format** | JSON / XML |
| **URL** | [https://openweathermap.org/api](https://openweathermap.org/api) |

**Recommendation for RouteCrafted:** Use Open-Meteo for all forecast calls (no quota concerns). Use OpenWeatherMap only if you need weather search by city name alongside place data.

---

## 5\. Geocoding & Maps

### Nominatim / OpenStreetMap (Fully free, no key)

Nominatim is the geocoding service backed by OpenStreetMap. It is free, open, and has no rate-limit billing, though the public instance is limited to 1 request/second per IP. For a capstone project this is more than sufficient.

| Detail | Value |
| :---- | :---- |
| **Free tier** | Fully free, open source |
| **Rate limit** | 1 request/second on public instance |
| **Data** | Address search, reverse geocoding, place name to coordinates |
| **Format** | JSON |
| **URL** | [https://nominatim.openstreetmap.org](https://nominatim.openstreetmap.org) |

const res \= await fetch(\`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}\&format=json\&limit=1\`, {

  headers: { "User-Agent": "RouteCrafted/1.0" } // required by Nominatim TOS

});

const \[place\] \= await res.json();

### Mapbox Geocoding (Free tier with better accuracy)

Use Mapbox if you need autocomplete as users type a destination in the trip creation form.

| Detail | Value |
| :---- | :---- |
| **Free tier** | 100,000 requests/month |
| **Features** | Geocoding, reverse geocoding, autocomplete suggest |
| **SDK** | `@mapbox/search-js-react` for React |
| **URL** | [https://www.mapbox.com](https://www.mapbox.com) |

**Recommendation for RouteCrafted:** Use Nominatim for internal coordinate resolution (server-side). Use Mapbox autocomplete for the destination input on the web form (client-side). Both stay free within capstone usage.

---

## 6\. Places & Points of Interest

### OpenTripMap (Free, open database license)

OpenTripMap provides a worldwide points-of-interest database for travel applications. It is free under the Open Data Commons Open Database License (ODbL), with no restrictions on displaying results on any map, caching data, or modifying it before display.

| Detail | Value |
| :---- | :---- |
| **Free tier** | Free API key; ODbL open data license |
| **Data** | Place list by location, place details, place autosuggest, coordinates by place name |
| **Format** | JSON / GeoJSON |
| **URL** | [https://dev.opentripmap.org](https://dev.opentripmap.org) |

This is the best source for populating attraction and POI data in "worth it / skip it" cards, as it covers tourist attractions, restaurants, museums, parks, and historical sites globally.

### Geoapify Places API (Alternative with generous free tier)

| Detail | Value |
| :---- | :---- |
| **Free tier** | 3,000 credits/day |
| **Data** | POI search by category, location, and radius |
| **URL** | [https://www.geoapify.com/places-api](https://www.geoapify.com/places-api) |

---

## 7\. Object Storage — User Files

### Cloudflare R2 (Capstone-named service)

Cloudflare R2 is the object storage service named in the capstone brief. It is used to store user-uploaded files such as profile photos or trip attachments. R2 has no egress fees, which is its primary advantage over AWS S3.

| Detail | Value |
| :---- | :---- |
| **Free tier** | 10 GB storage/month, 1M Class A (write) operations/month, 10M Class B (read) operations/month, free egress |
| **Compatibility** | S3-compatible API |
| **SDK** | `@aws-sdk/client-s3` with R2 endpoint |
| **URL** | [https://www.cloudflare.com/developer-platform/r2](https://www.cloudflare.com/developer-platform/r2) |

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client \= new S3Client({

  region: "auto",

  endpoint: \`https://${process.env.R2\_ACCOUNT\_ID}.r2.cloudflarestorage.com\`,

  credentials: {

    accessKeyId: process.env.R2\_ACCESS\_KEY\_ID\!,

    secretAccessKey: process.env.R2\_SECRET\_ACCESS\_KEY\!,

  },

});

---

## 8\. Authentication

### Auth.js (formerly NextAuth.js) — Capstone-named library

Auth.js is the authentication library recommended in the capstone brief. It handles JWT tokens, session management, credential login, and OAuth providers with minimal configuration in Next.js.

| Detail | Value |
| :---- | :---- |
| **Free tier** | Fully open source, no API cost |
| **Features** | JWT auth, credential provider, OAuth (Google, GitHub), session callbacks |
| **Next.js integration** | Native App Router and Pages Router support |
| **Package** | `next-auth` |
| **URL** | [https://authjs.dev](https://authjs.dev) |

// app/api/auth/\[...nextauth\]/route.ts

import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";

export const { handlers, auth } \= NextAuth({

  providers: \[Credentials({ ... })\],

  session: { strategy: "jwt" },

});

---

## 9\. Email — Transactional

### Resend

Resend is the simplest transactional email API for Next.js. It has a clean developer API, official Next.js integration docs, and a generous free tier. Use it for account verification, password reset, and trip share notifications.

| Detail | Value |
| :---- | :---- |
| **Free tier** | 3,000 emails/month, 100 emails/day, 1 custom domain |
| **SDK** | `resend` npm package, official Next.js guide available |
| **Template support** | React Email components |
| **URL** | [https://resend.com](https://resend.com) |

import { Resend } from "resend";

const resend \= new Resend(process.env.RESEND\_API\_KEY);

await resend.emails.send({

  from: "RouteCrafted \<noreply@yourdomain.com\>",

  to: user.email,

  subject: "Your itinerary is ready",

  react: \<ItineraryEmail trip={trip} /\>,

});

---

## 10\. Push Notifications — Mobile

### Expo Push Notification Service

Expo's own push notification service is the simplest option for an Expo-based mobile app. It abstracts APNs (iOS) and FCM (Android) behind a single endpoint, is fully free, and requires no third-party account.

| Detail | Value |
| :---- | :---- |
| **Free tier** | Free, no per-notification charges |
| **Rate limit** | 600 notifications/second per project |
| **SDK** | `expo-notifications` package |
| **Use cases** | Weather-alert push, trip day reminder, itinerary update notification |
| **URL** | [https://docs.expo.dev/push-notifications/overview](https://docs.expo.dev/push-notifications/overview) |

await fetch("https://exp.host/--/api/v2/push/send", {

  method: "POST",

  headers: { "Content-Type": "application/json" },

  body: JSON.stringify({

    to: expoPushToken,

    title: "Weather alert",

    body: "Rain expected tomorrow — your plan has been updated.",

  }),

});

---

## 11\. Monorepo & Dev Tooling

### Node.js Monorepo (npm workspaces)

The capstone requires a Node.js monorepo with the Next.js app and the Expo app in the same repository. The recommended structure uses npm workspaces or Turborepo.

| Detail | Value |
| :---- | :---- |
| **Free tier** | Open source |
| **Recommended** | npm workspaces (built-in) or Turborepo for task caching |
| **URL** | [https://turborepo.com](https://turborepo.com) (free open-source version) |

### GitHub

The capstone requires a GitHub repo with commit history demonstrating ongoing work. GitHub is free for public repositories.

| Detail | Value |
| :---- | :---- |
| **Free tier** | Unlimited public repos, unlimited collaborators on public, 2,000 Actions minutes/month |
| **Required** | Yes — commit history is the primary assessment signal |
| **URL** | [https://github.com](https://github.com) |

---

## Integration Summary

| Category | Service | Free Tier | Required by Capstone |
| :---- | :---- | :---- | :---- |
| Hosting | Vercel | 100 GB bandwidth, 6,000 build min | Yes (named) |
| Database | Neon PostgreSQL | 0.5 GB, 100 compute-hours/mo | Yes (named) |
| ORM | Drizzle ORM | Open source | Yes (named) |
| AI / LLM | Google Gemini 2.0 Flash | 1,500 req/day | No — your choice |
| AI / LLM fallback | Groq (Llama 3.3 70B) | 30 req/min, 14,400 req/day | No — your choice |
| Weather | Open-Meteo | Unlimited, no key needed | No — your choice |
| Geocoding | Nominatim \+ Mapbox | Free \+ 100K req/mo | No — your choice |
| Places / POI | OpenTripMap | Free, ODbL license | No — your choice |
| Object storage | Cloudflare R2 | 10 GB, 1M write ops/mo | Yes (named) |
| Auth | Auth.js (NextAuth) | Open source | Yes (named) |
| Email | Resend | 3,000 emails/mo | No — your choice |
| Push notifications | Expo Push Service | Free, 600 notif/sec | No — your choice |
| Version control | GitHub | Free public repos | Yes (required) |

---

## Environment Variables Checklist

Create a `.env.local` file (never committed to Git) with the following:

\# Database

DATABASE\_URL=postgresql://...@neon.tech/neondb

\# Auth

NEXTAUTH\_SECRET=your-random-secret

NEXTAUTH\_URL=http://localhost:3000

\# AI

GEMINI\_API\_KEY=your-gemini-key

GROQ\_API\_KEY=your-groq-key

\# Weather (Open-Meteo has no key — omit)

\# Geocoding

MAPBOX\_TOKEN=your-mapbox-token

\# Places

OPENTRIPMAP\_KEY=your-opentripmap-key

\# Storage

R2\_ACCOUNT\_ID=your-cloudflare-account-id

R2\_ACCESS\_KEY\_ID=your-r2-key-id

R2\_SECRET\_ACCESS\_KEY=your-r2-secret

R2\_BUCKET\_NAME=RouteCrafted-uploads

\# Email

RESEND\_API\_KEY=your-resend-key

---

## AGENTS.md Integration Notes

When you write your `AGENTS.md` file (required by the capstone), include this section to guide the AI dev agent:

\#\# External Integrations

\- \*\*LLM\*\*: Google Gemini 2.0 Flash via \`@google/generative-ai\`. All AI calls go through \`/lib/ai/gemini.ts\`.

\- \*\*Weather\*\*: Open-Meteo REST API. No API key. Utility in \`/lib/weather/open-meteo.ts\`.

\- \*\*Geocoding\*\*: Nominatim for server-side coordinate resolution. Mapbox for client-side autocomplete.

\- \*\*Places\*\*: OpenTripMap for POI enrichment of itinerary items.

\- \*\*Storage\*\*: Cloudflare R2 via S3-compatible client in \`/lib/storage/r2.ts\`.

\- \*\*Auth\*\*: Auth.js with JWT strategy. Config at \`/app/api/auth/\[...nextauth\]/route.ts\`.

\- \*\*Email\*\*: Resend SDK. Email templates in \`/emails/\` using React Email components.

\- \*\*Push\*\*: Expo push notification service via HTTP in \`/lib/notifications/expo-push.ts\`.  
