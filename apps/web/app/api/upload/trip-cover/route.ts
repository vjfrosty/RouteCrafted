import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadFile, validateImageFile, keyFromUrl, deleteFile } from "@/lib/storage/r2";
import { getTripById, updateTrip } from "@/lib/db/trips";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const tripId = formData.get("tripId");
  const file = formData.get("file");

  if (!tripId || typeof tripId !== "string") {
    return NextResponse.json({ error: "tripId required" }, { status: 400 });
  }
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const validationError = validateImageFile(file.type, file.size);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  // Ownership check — only the trip owner can upload a cover
  const trip = await getTripById(tripId, session.user.id);
  if (!trip) return new NextResponse("Not found", { status: 404 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `covers/${tripId}.${ext}`;

  // Delete old cover if stored in R2
  if (trip.coverImageUrl && trip.coverImageUrl.includes("r2")) {
    try {
      await deleteFile(keyFromUrl(trip.coverImageUrl));
    } catch {
      // Non-fatal
    }
  }

  const url = await uploadFile(key, buffer, file.type);
  await updateTrip(tripId, session.user.id, { coverImageUrl: url });

  return NextResponse.json({ url });
}
