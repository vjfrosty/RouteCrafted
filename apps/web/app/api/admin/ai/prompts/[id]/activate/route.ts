import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { activatePromptVersion } from "@/lib/db/ai-config";
import { db } from "@/lib/db";
import { aiPrompts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type RouteContext = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  promptKey: z.string().min(1),
});

export async function PATCH(req: Request, ctx: RouteContext) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const { id } = await ctx.params;

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  // Verify the prompt exists and belongs to the stated key
  const [existing] = await db
    .select()
    .from(aiPrompts)
    .where(eq(aiPrompts.id, id))
    .limit(1);
  if (!existing || existing.promptKey !== parsed.data.promptKey)
    return new NextResponse("Not Found", { status: 404 });

  const updated = await activatePromptVersion(id, parsed.data.promptKey);
  return NextResponse.json(updated);
}
