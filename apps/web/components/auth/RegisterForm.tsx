"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const signupDisabled = process.env.NEXT_PUBLIC_DISABLE_SIGNUP === "true";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (signupDisabled) {
    return (
      <div className="space-y-4">
        <div className="bg-surface-container-low rounded-2xl p-6">
          <p className="font-headline font-bold text-on-surface mb-2">Signups are temporarily disabled</p>
          <p className="text-on-surface-variant text-sm">We're not accepting new accounts right now. Please check back later or contact support.</p>
        </div>
        <p className="text-center text-sm font-label text-on-surface-variant">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/login?registered=1");
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 bg-error/10 text-error text-sm font-label rounded-2xl px-4 py-3">
          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider mb-2">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full bg-surface-container-low rounded-2xl px-4 py-3 text-on-surface placeholder-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Jane Smith"
        />
      </div>

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
          <span className="text-on-surface-variant/60 font-normal ml-1 normal-case">(min. 8 characters)</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
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
            Creating account…
          </>
        ) : "Create account"}
      </button>

      <p className="text-center text-sm font-label text-on-surface-variant">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </form>
  );
}
