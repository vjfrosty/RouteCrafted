import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dismissAlert } from "@/lib/db/weather";

type RouteContext = { params: Promise<{ alertId: string }> };

export async function POST(_req: Request, ctx: RouteContext) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { alertId } = await ctx.params;

  const dismissed = await dismissAlert(alertId, session.user.id);
  if (!dismissed) return new NextResponse("Not Found", { status: 404 });

  return NextResponse.json({ ok: true });
}
