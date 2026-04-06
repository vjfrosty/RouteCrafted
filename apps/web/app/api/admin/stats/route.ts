import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users, trips, placeCards, weatherAlerts, adminFlags } from "@/lib/db/schema";
import { count as drizzleCount, eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const [
    [totalUsers],
    [totalTrips],
    [totalCards],
    [totalAlerts],
    [openFlags],
  ] = await Promise.all([
    db.select({ value: drizzleCount() }).from(users),
    db.select({ value: drizzleCount() }).from(trips),
    db.select({ value: drizzleCount() }).from(placeCards),
    db.select({ value: drizzleCount() }).from(weatherAlerts),
    db
      .select({ value: drizzleCount() })
      .from(adminFlags)
      .where(eq(adminFlags.status, "open")),
  ]);

  return NextResponse.json({
    totalUsers: Number(totalUsers.value),
    totalTrips: Number(totalTrips.value),
    totalCards: Number(totalCards.value),
    totalAlerts: Number(totalAlerts.value),
    openFlags: Number(openFlags.value),
  });
}
