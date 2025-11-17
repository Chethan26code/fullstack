// app/sign-in/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      {/* 👇 minimal centered card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-[0_20px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-8">
        <h2 className="text-xl font-semibold text-white text-center mb-1">
          Welcome Back 👋
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">
          Sign in to continue to your dashboard
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/20 border border-red-500/40 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleEmailSignIn}>
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-2 px-3 text-sm text-slate-50 placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password + Eye toggle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200">
              Password
            </label>

            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 focus-within:ring-2 focus-within:ring-indigo-500">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent py-2 pr-8 text-sm text-slate-50 placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                className="ml-2 text-slate-400 hover:text-slate-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C6 20 1.73 12.94 1.73 12.94a17.1 17.1 0 0 1 4.33-5.27" />
                    <path d="M10.12 5.64A10 10 0 0 1 12 4c6 0 10.27 7.06 10.27 7.06a17 17 0 0 1-3.81 4.94" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M2.05 12a10 10 0 0 1 19.9 0s-4.05 7-9.95 7S2.05 12 2.05 12z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-indigo-400 disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-[11px] text-slate-500">or</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full rounded-xl bg-slate-900/70 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 hover:bg-slate-800"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          No account?{" "}
          <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
