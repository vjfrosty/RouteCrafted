import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME ?? "routecrafted-uploads";
const PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateImageFile(
  contentType: string,
  sizeBytes: number
): string | null {
  if (!ALLOWED_TYPES.includes(contentType)) {
    return "Only JPEG, PNG and WebP images are accepted.";
  }
  if (sizeBytes > MAX_BYTES) {
    return "File too large — maximum 5 MB.";
  }
  return null;
}

export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      // ACL managed at bucket level (public-read bucket policy in R2 dashboard)
    })
  );

  if (PUBLIC_URL) {
    return `${PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  }
  // Fallback: R2 dev URL pattern
  return `https://${BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`;
}

export async function deleteFile(key: string): Promise<void> {
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/** Extract the R2 key from a full public URL (used before replacing old files). */
export function keyFromUrl(url: string): string {
  const u = new URL(url);
  // Strip leading slash
  return u.pathname.replace(/^\//, "");
}
