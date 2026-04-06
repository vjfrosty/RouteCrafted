import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getPlaceCardById, flagPlaceCard } from "@/lib/db/places";
import { getTripById } from "@/lib/db/trips";

type Props = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  reason: z.string().min(3).max(500),
});

export async function POST(req: Request, { params }: Props) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  // Verify the card belongs to the user's trip
  const card = await getPlaceCardById(id);
  if (!card) return new NextResponse("Not Found", { status: 404 });

  const trip = await getTripById(card.tripId, session.user.id);
  if (!trip) return new NextResponse("Forbidden", { status: 403 });

  const ok = await flagPlaceCard(id, session.user.id, parsed.data.reason);
  if (!ok) return new NextResponse("Not Found", { status: 404 });

  return NextResponse.json({ ok: true });
}
