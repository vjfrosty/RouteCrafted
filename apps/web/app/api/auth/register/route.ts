import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getUserByEmail } from "@/lib/db/users";
import { sendWelcomeEmail } from "@/lib/email/resend";

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: Request) {
  // Temporary disable flag — set DISABLE_SIGNUP=true in the environment to block new registrations
  if (process.env.DISABLE_SIGNUP === "true") {
    return NextResponse.json(
      { error: "Signups are temporarily disabled" },
      { status: 503 }
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.insert(users).values({ name, email, passwordHash });

  // Fire-and-forget welcome email — don't block registration on email failure
  sendWelcomeEmail(email, name).catch((err) =>
    console.warn("[resend] Welcome email failed:", err)
  );

  return NextResponse.json({ message: "Account created" }, { status: 201 });
}
