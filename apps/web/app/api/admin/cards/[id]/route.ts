import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deletePlaceCard } from "@/lib/db/places";

type Props = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Props) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== "admin")
    return new NextResponse("Forbidden", { status: 403 });

  const { id } = await params;
  const deleted = await deletePlaceCard(id);
  if (!deleted) return new NextResponse("Not Found", { status: 404 });

  return new NextResponse(null, { status: 204 });
}
