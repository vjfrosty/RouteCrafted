import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOpenFlags } from "@/lib/db/places";

export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const flags = await getOpenFlags();
  return NextResponse.json(flags);
}
