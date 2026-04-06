import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getUserById, updateUser } from "@/lib/db/users";

const patchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const user = await getUserById(session.user.id);
  if (!user) return new NextResponse("Not Found", { status: 404 });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const updated = await updateUser(session.user.id, parsed.data);
  return NextResponse.json(updated);
}
