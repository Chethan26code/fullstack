// app/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
      } else {
        setUser(currentUser);
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300 text-sm">
        Checking authentication...
      </div>
    );
  }

  if (!user) return null;

  const username = user.email?.split("@")[0] || "there";

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Top bar inside card */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-xl bg-indigo-500/90 flex items-center justify-center text-white text-sm">
              ⚡
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Dashboard
              </p>
              <p className="text-xs text-slate-300">
                Logged in as{" "}
                <span className="text-indigo-300 font-medium">
                  {user.email || "User"}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-slate-800/90 transition"
          >
            Sign out
          </button>
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl shadow-[0_18px_80px_rgba(0,0,0,0.8)] px-6 py-7 md:px-8 md:py-8">
          <div className="flex flex-col gap-6">
            {/* Greeting */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-indigo-400 mb-2">
                Home
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-2">
                Welcome back,{" "}
                <span className="text-indigo-300">{username}</span>.
              </h1>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                You&apos;re in. This is your authenticated home screen — the
                perfect spot to wire in dashboards, tools, or your Mood Buddy
                voice experience.
              </p>
            </div>

            {/* Info + quick stats */}
            <div className="grid gap-4 md:grid-cols-3 text-xs">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1.5">
                <p className="text-[11px] text-slate-400">Signed-in email</p>
                <p className="text-slate-100 break-all text-[13px]">
                  {user.email || "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1.5">
                <p className="text-[11px] text-slate-400">Email verified</p>
                <p className="text-slate-100 text-[13px]">
                  {user.emailVerified ? "Yes ✅" : "No ❌"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1.5">
                <p className="text-[11px] text-slate-400">Auth provider</p>
                <p className="text-slate-100 text-[13px]">
                  {user.providerData?.[0]?.providerId === "google.com"
                    ? "Google"
                    : "Email & Password"}
                </p>
              </div>
            </div>

            {/* Actions / navigation */}
            <div className="grid gap-3 md:grid-cols-2 text-xs">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between">
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Main actions
                  </p>
                  <p className="text-[11px] text-slate-300 mb-3">
                    Jump into core areas of your app. These are just links now —
                    you can turn them into full features as you build.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <button
                    onClick={() => router.push("/")}
                    className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-slate-800/90 transition"
                  >
                    ⬅ Back to landing
                  </button>
                  <button
                    onClick={() => router.push("/mood-buddy")}
                    className="rounded-xl bg-indigo-500 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-indigo-400 shadow-md shadow-indigo-500/30 transition"
                  >
                    🎧 Open Mood Buddy
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Project checklist
                </p>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li>• Wire up your first protected feature route.</li>
                  <li>• Connect Firestore or Realtime DB for storage.</li>
                  <li>• Hook in Vapi & OpenAI keys for Mood Buddy.</li>
                  <li>• Deploy to Vercel with env vars set.</li>
                </ul>
              </div>
            </div>

            {/* Implementation notes */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-[11px] text-slate-400">
              <p className="mb-1 text-slate-300 font-medium">
                Under the hood
              </p>
              <p>
                This page uses{" "}
                <span className="text-indigo-300 font-medium">
                  onAuthStateChanged
                </span>{" "}
                from Firebase to guard the route and redirect unauthenticated
                users back to <code>/sign-in</code>. The{" "}
                <code>signOut</code> function clears the session and sends you
                back to the auth flow.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-600">
          You&apos;re authenticated · Build something cool from here 💻
        </p>
      </div>
    </main>
  );
}
