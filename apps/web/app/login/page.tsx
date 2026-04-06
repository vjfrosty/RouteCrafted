import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — RouteCrafted",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>flight_takeoff</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl text-on-surface mb-2">Welcome back</h1>
          <p className="text-on-surface-variant">Sign in to your RouteCrafted account</p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-card">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
