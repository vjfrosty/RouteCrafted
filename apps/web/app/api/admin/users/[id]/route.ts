import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { updateUserRole } from "@/lib/db/users";

type Props = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  role: z.enum(["traveler", "admin"]),
});

export async function PATCH(req: Request, { params }: Props) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const { id } = await params;

  // Prevent self-demotion
  if (id === session.user.id)
    return NextResponse.json(
      { error: "Cannot change your own role" },
      { status: 400 },
    );

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const updated = await updateUserRole(id, parsed.data.role);
  if (!updated) return new NextResponse("Not Found", { status: 404 });

  return NextResponse.json(updated);
}
