import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTripById } from "@/lib/db/trips";
import { runWeatherCheck } from "@/lib/weather/check";
import { getActiveAlertsByTrip } from "@/lib/db/weather";

type RouteContext = { params: Promise<{ tripId: string }> };

export async function GET(_req: Request, ctx: RouteContext) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { tripId } = await ctx.params;

  const trip = await getTripById(tripId, session.user.id);
  if (!trip) return new NextResponse("Not Found", { status: 404 });

  const [result, alerts] = await Promise.all([
    runWeatherCheck(tripId, session.user.id),
    getActiveAlertsByTrip(tripId),
  ]);

  return NextResponse.json({ ...result, alerts });
}
