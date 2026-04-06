import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTripById } from "@/lib/db/trips";
import { getPlaceCardsByTrip } from "@/lib/db/places";

type Props = { params: Promise<{ tripId: string }> };

export async function GET(_req: Request, { params }: Props) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { tripId } = await params;

  // Ownership check
  const trip = await getTripById(tripId, session.user.id);
  if (!trip) return new NextResponse("Not Found", { status: 404 });

  const cards = await getPlaceCardsByTrip(tripId);
  return NextResponse.json(cards);
}
