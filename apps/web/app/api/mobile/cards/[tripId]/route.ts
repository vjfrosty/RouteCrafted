import { NextResponse } from "next/server";
import { verifyBearer } from "@/lib/auth/verify-bearer";
import { getTripById } from "@/lib/db/trips";
import { getPlaceCardsByTrip } from "@/lib/db/places";

type Props = { params: Promise<{ tripId: string }> };

export async function GET(req: Request, { params }: Props) {
  const payload = await verifyBearer(req);
  if (!payload) return new NextResponse("Unauthorized", { status: 401 });

  const { tripId } = await params;
  const trip = await getTripById(tripId, payload.sub);
  if (!trip) return new NextResponse("Not Found", { status: 404 });

  const cards = await getPlaceCardsByTrip(tripId);
  return NextResponse.json(cards);
}
