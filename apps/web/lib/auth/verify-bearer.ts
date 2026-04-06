import { verifyMobileToken, type MobileTokenPayload } from "@/lib/auth/mobile-jwt";

/**
 * Extracts and verifies the Bearer token from an Authorization header.
 * Returns the decoded payload or null if missing/invalid.
 */
export async function verifyBearer(
  req: Request,
): Promise<MobileTokenPayload | null> {
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return null;
  const token = header.slice(7);
  return verifyMobileToken(token);
}
