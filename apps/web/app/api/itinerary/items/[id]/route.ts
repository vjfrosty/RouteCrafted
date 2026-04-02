import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { updateItem, deleteItem } from "@/lib/db/itinerary";

type RouteContext = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  timeBlock: z.enum(["morning", "afternoon", "evening"]).optional(),
  type: z.enum(["activity", "meal", "transport"]).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  durationMins: z.number().int().positive().optional(),
  estimatedCost: z.number().nonnegative().optional(),
  isOptional: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: RouteContext) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await ctx.params;

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const { estimatedCost: rawCost, ...rest } = parsed.data;
  const data = {
    ...rest,
    ...(rawCost !== undefined && { estimatedCost: String(rawCost) }),
  };

  const updated = await updateItem(id, session.user.id, data);
  if (!updated) return new NextResponse("Not Found", { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await ctx.params;

  const result = await deleteItem(id, session.user.id);
  if (!result) return new NextResponse("Not Found", { status: 404 });

  return new NextResponse(null, { status: 204 });
}
