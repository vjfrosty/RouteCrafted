import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getAllPrompts, createPromptVersion } from "@/lib/db/ai-config";

const createSchema = z.object({
  promptKey: z.enum(["generate_itinerary", "rewrite_day", "place_card"]),
  name: z.string().min(1),
  description: z.string().default(""),
  template: z.string().min(10),
});

export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const prompts = await getAllPrompts();
  return NextResponse.json(prompts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const created = await createPromptVersion({
    ...parsed.data,
    createdBy: session.user.id,
  });

  return NextResponse.json(created, { status: 201 });
}
