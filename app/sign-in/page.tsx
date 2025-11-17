// app/sign-in/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home"); // redirect after login
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in");
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
      console.error(err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-white text-center mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Sign in to continue to your dashboard
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleEmailSignIn}>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70 transition"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-500">or</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-70 transition"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 533.5 544.3"
            aria-hidden="true"
          >
            <path
              d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.3h146.9c-6.4 34.9-25.8 64.4-55 84.3v69.8h88.7c51.9-47.8 81.9-118.3 81.9-198.9z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c74.1 0 136.1-24.5 181.5-66.9l-88.7-69.8c-24.6 16.5-56.1 26-92.8 26-71.4 0-132-48.2-153.8-112.9H26.2v71.3C71.4 486.4 164.6 544.3 272 544.3z"
              fill="#34A853"
            />
            <path
              d="M118.2 320.7c-5.5-16.5-8.6-34.1-8.6-52.2s3.1-35.7 8.6-52.2V145H26.2C9.5 180.1 0 219.1 0 268.5s9.5 88.4 26.2 123.5l92-71.3z"
              fill="#FBBC04"
            />
            <path
              d="M272 107.7c40.3 0 76.5 13.9 105 41.2l78.4-78.4C408 26.7 346.1 0 272 0 164.6 0 71.4 57.9 26.2 145l92 71.3C140 155.9 200.6 107.7 272 107.7z"
              fill="#EA4335"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <a
            href="/sign-up"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
