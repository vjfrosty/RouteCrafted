import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account — RouteCrafted",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
          </div>
          <h1 className="font-headline font-extrabold text-3xl text-on-surface mb-2">Create account</h1>
          <p className="text-on-surface-variant">Start planning smarter trips</p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-card">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
