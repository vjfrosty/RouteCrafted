import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadFile, validateImageFile, keyFromUrl, deleteFile } from "@/lib/storage/r2";
import { updateUser, getUserByEmail } from "@/lib/db/users";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const contentType = file.type;
  const sizeBytes = file.size;

  const validationError = validateImageFile(contentType, sizeBytes);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 422 });
  }

  // Get user to find userId and any existing avatar for deletion
  const user = await getUserByEmail(session.user.email);
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const key = `avatars/${user.id}.${ext}`;

  // Delete old avatar if it's stored in R2 (not an OAuth URL)
  if (user.avatarUrl && user.avatarUrl.includes("r2")) {
    try {
      await deleteFile(keyFromUrl(user.avatarUrl));
    } catch {
      // Non-fatal — continue with upload
    }
  }

  const url = await uploadFile(key, buffer, contentType);
  await updateUser(user.id, { avatarUrl: url });

  return NextResponse.json({ url });
}
