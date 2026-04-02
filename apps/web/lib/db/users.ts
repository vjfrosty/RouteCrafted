import { eq } from "drizzle-orm";
import { db } from "./index";
import { users } from "./schema";

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0] ?? null;
}
