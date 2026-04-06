"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AvatarUploadProps {
  currentUrl: string | null;
  initials: string;
}

export function AvatarUpload({ currentUrl, initials }: AvatarUploadProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(msg as string);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentUrl); // revert preview
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative group focus:outline-none"
        aria-label="Change avatar"
      >
        <div className="h-24 w-24 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center text-on-surface-variant text-2xl font-headline font-bold">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              width={80}
              height={80}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            initials
          )}
        </div>
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <span className="text-white text-xs font-medium">
            {uploading ? "…" : "Change"}
          </span>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
      {uploading && <p className="text-xs text-slate-400">Uploading…</p>}
    </div>
  );
}
