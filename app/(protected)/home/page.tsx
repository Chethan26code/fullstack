// app/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse text-slate-300 text-sm">
          Checking authentication...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Top navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/80 flex items-center justify-center text-xs font-bold">
              🔐
            </div>
            <div>
              <p className="text-sm font-semibold">Auth Dashboard</p>
              <p className="text-[11px] text-slate-400">
                Firebase · Next.js · Tailwind · TS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs md:block">
              <p className="text-slate-300 font-medium">
                {user.email || "User"}
              </p>
              <p className="text-[11px] text-slate-500">Signed in</p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800/90 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:px-6 md:py-10">
        {/* Left main card */}
        <div className="flex-1">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400 mb-3">
              Welcome
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
              Hey, <span className="text-indigo-400">
                {user.email?.split("@")[0]}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mb-6 max-w-xl">
              You are now authenticated with Firebase. This page is protected
              and only visible when you&apos;re signed in. Use this as a
              starting point to build your app&apos;s dashboard.
            </p>

            <div className="grid gap-4 md:grid-cols-3 text-xs text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">Signed in as</span>
                <span className="break-all">{user.email}</span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">
                  Email verified
                </span>
                <span>{user.emailVerified ? "Yes ✅" : "No ❌"}</span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">
                  UID (short)
                </span>
                <span className="truncate" title={user.uid}>
                  {user.uid}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleSignOut}
                className="rounded-xl bg-red-500/90 px-4 py-2 text-xs font-medium text-white shadow-md hover:bg-red-400 transition"
              >
                Sign out
              </button>
              <button
                onClick={() => router.push("/")}
                className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800/90 transition"
              >
                Go to public landing page
              </button>
            </div>
          </div>
        </div>

        {/* Right side mini cards */}
        <aside className="w-full md:w-72 flex flex-col gap-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <p className="font-medium text-slate-200 mb-1">Next steps</p>
            <ul className="space-y-1 text-slate-400">
              <li>• Connect Firestore / Realtime DB</li>
              <li>• Add user profile settings</li>
              <li>• Create role-based access control</li>
              <li>• Build your dashboards / pages</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <p className="font-medium text-slate-200 mb-1">Tech info</p>
            <p className="text-slate-400">
              This page uses <span className="text-indigo-400">onAuthStateChanged</span> to guard the route on the client side and uses Firebase&apos;s{" "}
              <span className="text-indigo-400">signOut()</span> for logout.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
