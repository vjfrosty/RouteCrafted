import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getTripById } from "@/lib/db/trips";
import { getDaysByTrip } from "@/lib/db/itinerary";
import { db } from "@/lib/db";
import { itineraryItems } from "@/lib/db/schema";
import { eq, isNull, inArray } from "drizzle-orm";
import {
  insertPlaceCard,
  linkItemToCard,
  getAllPlaceCardsByTrip,
} from "@/lib/db/places";
import { generateJSON } from "@/lib/ai/openrouter";
import { placeCardResponseSchema, type PlaceCardResponse } from "@/lib/ai/schemas";
import { searchPoi } from "@/lib/places/opentripmap";

const bodySchema = z.object({
  tripId: z.string().uuid(),
});

const MAX_CARDS = 8;

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const { tripId } = parsed.data;

  const trip = await getTripById(tripId, session.user.id);
  if (!trip) return new NextResponse("Not Found", { status: 404 });

  // Get all days for this trip
  const days = await getDaysByTrip(tripId);
  if (days.length === 0)
    return NextResponse.json(
      { error: "Generate an itinerary first" },
      { status: 409 },
    );

  const dayIds = days.map((d) => d.id);

  // Get activity items that don't have a place card yet
  const allItems = await db
    .select()
    .from(itineraryItems)
    .where(
      inArray(itineraryItems.dayId, dayIds),
    );

  const candidates = allItems
    .filter((item) => item.type === "activity" && item.placeCardId === null)
    .slice(0, MAX_CARDS);

  if (candidates.length === 0) {
    // All items already have cards — return existing
    const existing = await getAllPlaceCardsByTrip(tripId);
    return NextResponse.json({ generated: 0, cards: existing });
  }

  const tripLat = trip.lat ? parseFloat(trip.lat) : null;
  const tripLon = trip.long ? parseFloat(trip.long) : null;

  const generated: Awaited<ReturnType<typeof insertPlaceCard>>[] = [];

  for (const item of candidates) {
    try {
      // Optional OpenTripMap enrichment
      let poi = null;
      if (tripLat !== null && tripLon !== null) {
        poi = await searchPoi(item.title, tripLat, tripLon);
      }

      const category = poi?.category ?? "attraction";

      const prompt = `You are a knowledgeable travel advisor. Evaluate this place/attraction for a traveler.

Place: ${item.title}
Category: ${category}
Location: ${item.location}, ${trip.destination}, ${trip.country}
Travel style: ${trip.travelStyle}
Group type: ${trip.groupType}
Budget: ${trip.budgetRange}

Respond with a JSON object (no markdown):
{
  "verdict": "worth_it" | "skip_it" | "depends",
  "summary": "One punchy sentence about this place",
  "worthItReasons": ["reason1", "reason2", "reason3"],
  "skipItReasons": ["reason1", "reason2"],
  "bestFor": "Short description of who should visit",
  "costLevel": "free" | "low" | "medium" | "high",
  "timeNeeded": "e.g. 1–2 hours"
}`;

      const raw = await generateJSON<PlaceCardResponse>(prompt);
      const validated = placeCardResponseSchema.parse(raw);

      const card = await insertPlaceCard({
        tripId,
        name: item.title,
        category,
        verdict: validated.verdict,
        summary: validated.summary,
        worthItReasons: validated.worthItReasons,
        skipItReasons: validated.skipItReasons,
        bestFor: validated.bestFor,
        costLevel: validated.costLevel,
        timeNeeded: validated.timeNeeded,
        lat: poi ? String(poi.lat) : null,
        long: poi ? String(poi.lon) : null,
        imageUrl: poi?.imageUrl ?? null,
      });

      await linkItemToCard(item.id, card.id);
      generated.push(card);
    } catch {
      // Skip failed individual card — don't abort the whole batch
      continue;
    }
  }

  return NextResponse.json({ generated: generated.length, cards: generated });
}
