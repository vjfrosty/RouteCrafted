import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { createTrip, getTripsByUser } from "@/lib/db/trips";

const createTripSchema = z.object({
  destination: z.string().min(1),
  country: z.string().min(1),
  lat: z.string().nullable().optional(),
  long: z.string().nullable().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  budgetRange: z.enum(["budget", "mid", "luxury"]),
  travelStyle: z.enum(["cultural", "adventure", "relaxation", "foodie"]),
  groupType: z.enum(["solo", "couple", "family", "friends"]),
  pacing: z.enum(["relaxed", "moderate", "packed"]),
});

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trips = await getTripsByUser(session.user.id);
  return NextResponse.json(trips);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const { destination, country, startDate, endDate } = parsed.data;

  // Validate date ordering
  if (new Date(startDate) >= new Date(endDate)) {
    return NextResponse.json(
      { error: "startDate must be before endDate" },
      { status: 422 },
    );
  }

  // Server-side Nominatim geocode fallback if client didn't supply coordinates
  let lat = parsed.data.lat ?? null;
  let long = parsed.data.long ?? null;

  if (!lat || !long) {
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination + ", " + country)}&format=json&limit=1`,
        { headers: { "User-Agent": "RouteCrafted/1.0" } },
      );
      const geoData = (await geoRes.json()) as { lat: string; lon: string }[];
      if (geoData[0]) {
        lat = geoData[0].lat;
        long = geoData[0].lon;
      }
    } catch {
      // Geocoding is best-effort — proceed without coordinates
    }
  }

  const trip = await createTrip({
    userId: session.user.id,
    destination,
    country,
    lat,
    long,
    startDate,
    endDate,
    budgetRange: parsed.data.budgetRange,
    travelStyle: parsed.data.travelStyle,
    groupType: parsed.data.groupType,
    pacing: parsed.data.pacing,
  });

  return NextResponse.json(trip, { status: 201 });
}
