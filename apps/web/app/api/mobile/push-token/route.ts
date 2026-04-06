import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyBearer } from "@/lib/auth/verify-bearer";
import { updateUser } from "@/lib/db/users";

const schema = z.object({
  token: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  const user = await verifyBearer(req);
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  await updateUser(user.sub, { expoPushToken: parsed.data.token });

  return NextResponse.json({ ok: true });
}
