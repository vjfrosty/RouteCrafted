import { NextResponse } from "next/server";
import { verifyBearer } from "@/lib/auth/verify-bearer";
import { getTripsByUser } from "@/lib/db/trips";

export async function GET(req: Request) {
  const payload = await verifyBearer(req);
  if (!payload) return new NextResponse("Unauthorized", { status: 401 });

  const trips = await getTripsByUser(payload.sub);
  return NextResponse.json(trips);
}
