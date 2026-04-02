import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { upsertSetting } from "@/lib/db/ai-config";

type RouteContext = { params: Promise<{ key: string }> };

const bodySchema = z.object({
  value: z.string().min(1),
});

export async function PATCH(req: Request, ctx: RouteContext) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const { key } = await ctx.params;

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const updated = await upsertSetting(key, parsed.data.value, session.user.id);
  return NextResponse.json(updated);
}
