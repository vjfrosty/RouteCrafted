"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface TripCoverUploadProps {
  tripId: string;
  currentUrl: string | null;
}

export function TripCoverUpload({ tripId, currentUrl }: TripCoverUploadProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tripId", tripId);

      const res = await fetch("/api/upload/trip-cover", {
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
      setPreview(currentUrl);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative w-full h-40 rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-blue-500/40 transition focus:outline-none"
        aria-label="Upload trip cover image"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Trip cover"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-3xl">🖼️</span>
            <span className="text-slate-400 text-sm">Add cover photo</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <span className="text-white text-sm font-medium">
            {uploading ? "Uploading…" : preview ? "Change cover" : "Upload cover"}
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

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
