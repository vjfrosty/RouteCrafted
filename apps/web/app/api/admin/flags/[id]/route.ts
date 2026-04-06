import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { resolveFlag } from "@/lib/db/places";

type Props = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  action: z.enum(["resolved", "dismissed"]),
});

export async function PATCH(req: Request, { params }: Props) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const { id } = await params;

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const updated = await resolveFlag(id, session.user.id, parsed.data.action);
  if (!updated) return new NextResponse("Not Found", { status: 404 });

  return NextResponse.json(updated);
}
