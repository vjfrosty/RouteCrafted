import { NextRequest, NextResponse } from "next/server";
import { verifyBearer } from "@/lib/auth/verify-bearer";
import { getPlaceCardById } from "@/lib/db/places";
import { getTripsByUser } from "@/lib/db/trips";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyBearer(req);
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const card = await getPlaceCardById(id);
  if (!card) return new NextResponse("Not found", { status: 404 });

  // Verify the card belongs to one of the requesting user's trips
  const userTrips = await getTripsByUser(user.sub);
  const tripIds = userTrips.map((t) => t.id);
  if (!tripIds.includes(card.tripId)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.json({
    id: card.id,
    placeName: card.name,
    category: card.category,
    verdict: card.verdict,
    worthItReasons: card.worthItReasons ?? [],
    skipItReasons: card.skipItReasons ?? [],
    bestTimeToVisit: card.timeNeeded,
    estimatedCost: card.costLevel,
    summary: card.summary,
  });
}
