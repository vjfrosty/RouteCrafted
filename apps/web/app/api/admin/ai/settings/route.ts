import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllSettings } from "@/lib/db/ai-config";

export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const settings = await getAllSettings();
  return NextResponse.json(settings);
}
