"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const justRegistered = searchParams.get("registered") === "1";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {justRegistered && (
        <div className="flex items-center gap-2 bg-secondary/10 text-secondary text-sm font-label rounded-2xl px-4 py-3">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          Account created! Sign in below.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-error/10 text-error text-sm font-label rounded-2xl px-4 py-3">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider mb-2">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full bg-surface-container-low rounded-2xl px-4 py-3 text-on-surface placeholder-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full bg-surface-container-low rounded-2xl px-4 py-3 text-on-surface placeholder-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full horizon-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-headline font-bold rounded-full px-4 py-3.5 transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            Signing in…
          </>
        ) : "Sign in"}
      </button>

      <p className="text-center text-sm font-label text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-semibold">
          Create one
        </Link>
      </p>
    </form>
  );
}
