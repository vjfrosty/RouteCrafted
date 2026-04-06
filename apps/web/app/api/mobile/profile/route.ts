import { NextResponse } from "next/server";
import { verifyBearer } from "@/lib/auth/verify-bearer";
import { getUserById } from "@/lib/db/users";

export async function GET(req: Request) {
  const payload = await verifyBearer(req);
  if (!payload) return new NextResponse("Unauthorized", { status: 401 });

  const user = await getUserById(payload.sub);
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
