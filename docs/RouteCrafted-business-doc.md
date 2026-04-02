# RouteCrafted — Business Functionality, Requirements, and Market Value Research

## Purpose

RouteCrafted is a smart travel itinerary builder designed as a multi-platform full-stack app for the “Full Stack Apps with AI” capstone. It fits the assignment well because the project requires a backend, a web client, and a mobile client, all connected through a client-server architecture, with authentication, database design, responsive UI, and deployment documentation. \[file:2\]

The core business idea is to help travelers create realistic day-by-day itineraries from destination, budget, travel style, and dates, then keep those plans useful when conditions change by rewriting plans for weather shifts and summarizing places into short “worth it / skip it” cards optimized for mobile reading. This positions the product around convenience, personalization, and in-trip adaptability rather than static trip planning. \[web:7\]\[web:14\]

## Capstone fit

The capstone requires a fully functional multi-platform app with a Next.js backend and web app, an Expo mobile app, PostgreSQL with Drizzle ORM, JWT-based authentication, at least 5 web screens, at least 3 mobile screens, at least 4 database tables, live deployment, and GitHub documentation. \[file:2\]

RouteCrafted maps naturally to these requirements because it can support traveler and admin roles, itinerary CRUD flows, AI-generated planning endpoints, mobile-friendly trip consumption, and operational documentation. It also creates a strong case for serious commit history and architecture documentation because the assignment explicitly scores architecture, API, database, screens, admin panel, mobile app, deployment, and documentation. \[file:2\]

## Product vision

RouteCrafted should be positioned as a travel planning assistant that turns scattered research into a structured, adjustable plan. The strongest product promise is not just “generate an itinerary,” but “keep the plan practical as weather, time, and traveler preferences change.” \[web:7\]\[web:4\]

That distinction matters because current AI trip planning demand is moving toward personalized, integrated, and real-time support, while one major weakness of raw LLM-based planning is that itineraries can be unrealistic or outdated if they are not grounded in operational constraints. \[web:14\]\[web:4\]

## Target users

Primary users are leisure travelers who want fast planning without manually comparing dozens of blogs, maps, and booking pages. A strong early segment is 25–45 year-old mobile-first travelers planning city breaks, short holidays, or multi-day vacations with budget awareness. \[web:7\]\[web:14\]

Secondary users include couples, friend groups, and families who need simple day plans and quick attraction summaries they can review on the go. The mobile card concept is especially relevant because travelers increasingly expect travel apps to provide practical, real-time utility rather than long-form research experiences. \[web:12\]\[web:15\]

## Business functionalities

### Itinerary creation

Users enter destination, travel dates, budget range, travel style, group type, and pacing preferences, and the system generates a day-by-day itinerary with activities, meal ideas, timing blocks, and backup suggestions. This is the core value proposition and should be the first end-to-end workflow implemented. \[web:7\]\[web:14\]

The generated plan should balance feasibility and flexibility by grouping nearby places, estimating visit duration, and keeping optional alternatives per day. This directly addresses the known weakness of naive AI planners that can produce impractical schedules. \[web:4\]

### Weather-aware replanning

RouteCrafted should monitor daily forecast conditions for saved itineraries and suggest revisions when rain, heat, storms, or wind make the original plan less suitable. The user should be able to accept a full rewrite for a day or swap only affected items. \[web:9\]\[web:15\]

This feature is strategically strong because weather-linked travel support is increasingly treated as a practical utility layer in travel apps, and real-time disruption handling makes the app valuable during the trip, not only before it. \[web:9\]\[web:15\]

### Worth-it / skip-it cards

For every attraction, neighborhood, restaurant, or activity, the app should generate short mobile cards with summary, why it may be worth visiting, reasons to skip, expected cost level, time needed, and best traveler fit. These cards reduce decision fatigue and make itinerary review faster on mobile. \[web:7\]\[web:14\]

This functionality also gives RouteCrafted a differentiated content format: it is not just a planner but a decision-support tool. That supports stronger mobile engagement because users can scan cards quickly in real travel contexts. \[web:12\]\[web:14\]

### Save, edit, and regenerate plans

Users should be able to save trips, edit constraints, regenerate one day or the whole trip, and compare a current version against a previous version. Versioning is useful both for UX and for trust because users can feel in control of AI output. \[web:4\]\[web:7\]

This feature also aligns well with capstone expectations around CRUD functionality, multiple app screens, and clear business logic in both web and mobile clients. \[file:2\]

### Account and trip management

Users should register, log in, manage profile preferences, and store multiple trips. They should also be able to mark favorite places, hide irrelevant suggestions, and maintain a history of itinerary revisions. \[file:2\]

For the first release, collaboration can be optional, but the data model should allow future shared-trip functionality such as inviting companions or exporting a plan. Designing with future extensibility supports cleaner capstone architecture and documentation. \[file:2\]

### Admin operations

An admin area should manage destination content quality, flagged summaries, prompt templates, featured destinations, and user support cases. This is important not only for product operations but also because the capstone explicitly scores users, roles, and an admin panel or equivalent privileged area. \[file:2\]

Admin workflows should also allow review of AI output quality, especially for “worth it / skip it” summaries, to reduce misleading or low-quality recommendations. \[web:4\]

## Recommended MVP scope

For the capstone, the MVP should focus on one complete vertical slice: account system, trip creation form, itinerary generation, itinerary detail by day, weather-triggered rewrite suggestion, place summary cards, and admin moderation. This scope is broad enough to meet the project rubric while remaining realistic. \[file:2\]

A good MVP rule is to prefer depth over breadth: build fewer integrations, but make itinerary generation, editing, and mobile consumption reliable. That gives a stronger demo than trying to add booking, chat, maps, and payments all at once. \[file:2\]\[web:4\]

## Business requirements

### Functional requirements

- The system must allow user registration, login, logout, and role-based access for traveler and admin users. \[file:2\]  
- The system must let a traveler create a trip by entering destination, dates, budget, and travel style. \[web:7\]\[file:2\]  
- The system must generate a structured day-by-day itinerary for the trip. \[web:7\]  
- The system must allow editing and regeneration for a single day or the entire itinerary. \[web:4\]  
- The system must store trips, itinerary items, and summary cards in PostgreSQL. \[file:2\]  
- The system must show at least 5 web screens and at least 3 mobile screens to satisfy capstone requirements. \[file:2\]  
- The system should detect forecast changes and produce weather-aware alternatives for affected itinerary items. \[web:9\]\[web:15\]  
- The system should generate short “worth it / skip it” cards for places included in the trip. \[web:14\]  
- The system should provide an admin panel for user, content, and moderation tasks. \[file:2\]  
- The system should support responsive design for web and compact card-first consumption on mobile. \[file:2\]\[web:12\]

### Non-functional requirements

- The application should be deployed live on the Internet and be accessible for demo testing. \[file:2\]  
- The architecture should follow the assignment stack: Next.js backend and web app, Expo mobile app, Neon PostgreSQL, and Drizzle ORM. \[file:2\]  
- The app should use JWT-based authentication and server-side access control. \[file:2\]  
- The database design should include at least 4 related tables and use migrations committed to GitHub. \[file:2\]  
- The project should include clear GitHub documentation covering project description, architecture, database schema, setup, and key folders. \[file:2\]  
- The team should maintain at least 15 commits across at least 3 different days because this is explicitly graded. \[file:2\]

## Suggested business rules

- A trip must have one owner and may have many itinerary days. \[file:2\]  
- An itinerary day may contain multiple itinerary items, ordered by time block or ranking. \[file:2\]  
- A weather rewrite should preserve unchanged parts of the plan unless the user requests a full regenerate. \[web:9\]  
- Summary cards should always include a balanced positive and negative view, not only promotional text, to support better decision quality. \[web:14\]  
- Admin users can review or disable low-confidence destination content or flagged summaries. \[file:2\]\[web:4\]

## Value proposition

RouteCrafted saves planning time, reduces trip friction, and improves confidence in daily decisions. The strongest business value is that it combines pre-trip planning with in-trip adjustment, which makes it more useful than one-time itinerary generators. \[web:7\]\[web:15\]

Its “worth it / skip it” cards add an opinionated decision layer that can help users choose faster on mobile, especially when they are already in the destination and do not want to read long guides. That supports a practical, mobile-first product identity. \[web:12\]\[web:14\]

## Market context

External market sources consistently describe travel planner apps as a growing category driven by smartphone use, personalization, and AI-powered recommendations, although market-size estimates differ by publisher. One report estimated the global travel planner app market at about USD 500.8 million in 2024 with a projected 12.34% CAGR, while another projected broader travel planner app growth toward USD 7 billion by 2033\. \[web:8\]\[web:14\]

Even if exact market sizing varies, the directional signal is consistent: travelers increasingly expect integrated planning, real-time updates, and personalized support. That trend supports the relevance of an itinerary product that also handles weather changes and fast recommendation summaries. \[web:8\]\[web:14\]

## Competitor pattern analysis

The market already contains AI trip planning products and travel assistants centered on itinerary generation, personalization, and recommendations. Examples in available sources include GuideGeek, Wonderplan, Layla, Trip Planner AI, and Booking.com’s AI Trip Planner. \[web:7\]\[web:10\]\[web:4\]

This means RouteCrafted should not compete on “AI itinerary generation” alone. Its sharper angle should be reliable day structure, weather-aware rewrites, and mobile-friendly worth-it decision cards, because differentiation is more credible when it solves known traveler pain points in execution, not just inspiration. \[web:4\]\[web:15\]

## Market opportunities

### Opportunity 1: Practicality over novelty

A recurring risk in AI trip planning is impractical output, such as bad timing, closed venues, or unrealistic movement between locations. A product that visibly improves operational realism can build trust faster than one that only produces flashy drafts. \[web:4\]

### Opportunity 2: During-trip engagement

Many planning tools lose relevance once the trip starts. Weather-aware rewriting creates a reason to return daily, increasing retention and making the app useful in the moment of travel disruption. \[web:9\]\[web:15\]

### Opportunity 3: Mobile-first decisions

Long travel content is hard to use in transit. Short “worth it / skip it” cards can make RouteCrafted especially attractive on mobile, where quick scanning matters more than deep reading. \[web:12\]\[web:14\]

## Risks and constraints

RouteCrafted will depend on third-party services for weather, maps, and possibly place data, which introduces API cost, rate-limit, and availability risk. Market reporting on travel planner apps also notes privacy concerns and dependence on external integrations as important challenges. \[web:8\]

Another major product risk is hallucinated or stale recommendations. The available industry discussion around AI trip planners highlights that unsupported LLM-only planning can fail on logistical accuracy, so the product should be framed as “AI-assisted planning with structured validation,” not as an infallible travel expert. \[web:4\]

## Business success metrics

For the MVP, useful business metrics would be:

- Trip creation completion rate, from start form to saved itinerary. \[web:7\]  
- Regeneration acceptance rate, showing whether users trust itinerary rewrites. \[web:4\]  
- Weather rewrite usage rate, measuring value during the trip. \[web:9\]\[web:15\]  
- Card engagement rate, such as opens, saves, or skips on “worth it / skip it” summaries. \[web:12\]  
- 7-day retention for users with an upcoming trip, indicating whether planning remains active over time. \[web:14\]

## Capstone-friendly feature mapping

| Capstone area | RouteCrafted implementation |
| :---- | :---- |
| Backend API | Authentication, trip CRUD, itinerary generation, weather rewrite, cards API. \[file:2\] |
| Database | Users, trips, itinerary\_days, itinerary\_items, place\_cards, admin\_flags; at least 4 tables required. \[file:2\] |
| Web screens | Landing/dashboard, register/login, create trip, itinerary view, place cards, admin panel. \[file:2\] |
| Mobile screens | My trips, day plan, place card detail, profile. \[file:2\] |
| Auth and roles | Traveler and admin with JWT and protected routes. \[file:2\] |
| Documentation | Project description, architecture, DB schema, setup guide, folder guide, AGENTS.md. \[file:2\] |

## Recommended first document set

For your capstone preparation, create these Markdown documents first:

- docs/business-functionalities.md — product overview, target users, user flows, feature descriptions.  
- docs/business-requirements.md — functional requirements, non-functional requirements, business rules, scope.  
- docs/market-value-research.md — market trends, competitors, opportunities, risks, and value proposition.  
- README.md — concise project summary, stack, setup, and links. \[file:2\]

## Final recommendation

RouteCrafted is a strong capstone idea because it naturally satisfies the course requirements while also giving you a product story that is easy to explain in demo form: plan a trip, adapt when weather changes, and make quick mobile decisions. To maximize both business clarity and capstone score, keep the MVP centered on itinerary generation, weather-aware replanning, summary cards, account roles, and clear documentation. \[file:2\]\[web:7\]\[web:15\]  
