import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account — RouteCrafted",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 select-none">✈️</div>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-blue-300 mt-2">Start planning smarter trips</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
