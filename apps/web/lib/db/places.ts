import { eq, and, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { placeCards, adminFlags, trips, itineraryItems } from "@/lib/db/schema";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlaceCardInsert = {
  tripId: string;
  name: string;
  category: string;
  verdict: string;
  summary: string;
  worthItReasons: string[];
  skipItReasons: string[];
  bestFor: string;
  costLevel: string;
  timeNeeded: string;
  lat?: string | null;
  long?: string | null;
  imageUrl?: string | null;
};

// ─── Place Cards ──────────────────────────────────────────────────────────────

export async function getPlaceCardsByTrip(tripId: string) {
  return db
    .select()
    .from(placeCards)
    .where(and(eq(placeCards.tripId, tripId), eq(placeCards.flagged, false)))
    .orderBy(asc(placeCards.createdAt));
}

export async function getAllPlaceCardsByTrip(tripId: string) {
  return db
    .select()
    .from(placeCards)
    .where(eq(placeCards.tripId, tripId))
    .orderBy(asc(placeCards.createdAt));
}

export async function getPlaceCardById(id: string) {
  const rows = await db
    .select()
    .from(placeCards)
    .where(eq(placeCards.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function insertPlaceCard(data: PlaceCardInsert) {
  const rows = await db.insert(placeCards).values(data).returning();
  return rows[0];
}

export async function linkItemToCard(itemId: string, cardId: string) {
  await db
    .update(itineraryItems)
    .set({ placeCardId: cardId })
    .where(eq(itineraryItems.id, itemId));
}

export async function flagPlaceCard(
  cardId: string,
  userId: string,
  reason: string,
): Promise<boolean> {
  // Verify card exists
  const card = await getPlaceCardById(cardId);
  if (!card) return false;

  // Create flag record
  await db.insert(adminFlags).values({
    placeCardId: cardId,
    raisedBy: userId,
    reason,
    status: "open",
  });

  // Mark card as flagged
  await db
    .update(placeCards)
    .set({ flagged: true, flagReason: reason, updatedAt: new Date() })
    .where(eq(placeCards.id, cardId));

  return true;
}

// ─── Admin Flags ──────────────────────────────────────────────────────────────

export async function getOpenFlags() {
  return db
    .select({
      flag: adminFlags,
      card: placeCards,
    })
    .from(adminFlags)
    .innerJoin(placeCards, eq(adminFlags.placeCardId, placeCards.id))
    .where(eq(adminFlags.status, "open"))
    .orderBy(asc(adminFlags.createdAt));
}

export async function resolveFlag(
  flagId: string,
  resolvedBy: string,
  action: "resolved" | "dismissed",
) {
  const rows = await db
    .update(adminFlags)
    .set({ status: action, resolvedBy, updatedAt: new Date() })
    .where(eq(adminFlags.id, flagId))
    .returning();
  return rows[0] ?? null;
}
