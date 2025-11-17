// app/sign-up/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // or "/home" if you want to go straight in
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to continue with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-950/80 shadow-[0_20px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-8">
        <h1 className="text-xl font-semibold text-white text-center mb-1">
          Create an account ✨
        </h1>
        <p className="text-xs text-slate-500 text-center mb-6">
          Join and start building your app
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/20 border border-red-500/40 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleEmailSignUp}>
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
              className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
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
                className="w-full bg-transparent py-2 pr-8 text-sm text-white placeholder-slate-500 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-slate-400 hover:text-slate-200"
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

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200">
              Confirm password
            </label>
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/70 px-3 focus-within:ring-2 focus-within:ring-indigo-500">
              <input
                type={showConfirm ? "text" : "password"}
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-transparent py-2 pr-8 text-sm text-white placeholder-slate-500 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="ml-2 text-slate-400 hover:text-slate-200"
              >
                {showConfirm ? (
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
            className="mt-2 w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70 transition"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-[11px] text-slate-500">or</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-70 transition"
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
          <span>Sign up with Google</span>
        </button>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
