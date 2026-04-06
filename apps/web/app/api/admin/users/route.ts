import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getAllUsers } from "@/lib/db/users";

const pageSchema = z.coerce.number().int().positive().default(1);

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = pageSchema.parse(searchParams.get("page") ?? "1");
  const { rows, total } = await getAllUsers(page, 20);
  return NextResponse.json({ users: rows, total, page });
}
