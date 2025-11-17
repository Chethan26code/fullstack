// app/(protected)/layout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const navLinks = [
  { href: "/home", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/budgets", label: "Budgets" },
  { href: "/payments", label: "Payments" },
  { href: "/ai-recaps", label: "AI Recaps" },
  { href: "/ai-plans", label: "AI Plans" },
  { href: "/wellness", label: "Wellness" },
  { href: "/conflicts", label: "Conflicts" },
];

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Top bar */}
      <header className="border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-indigo-500/90 flex items-center justify-center text-lg">
              💸
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                MicroCircle Finance
              </p>
              <p className="text-[11px] text-slate-400">
                Group expenses & AI budget guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs md:block">
              <p className="font-medium text-slate-200">
                {user.email || "Member"}
              </p>
              <p className="text-[11px] text-slate-500">Signed in</p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800/90 transition"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Secondary nav */}
        <nav className="border-t border-slate-900/80 bg-slate-950/60">
          <div className="mx-auto flex max-w-6xl overflow-x-auto px-4 py-2 md:px-6 gap-2 text-[11px]">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "whitespace-nowrap rounded-full border px-3 py-1 transition",
                    active
                      ? "border-indigo-500/80 bg-indigo-500/20 text-indigo-100"
                      : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-indigo-500/40 hover:text-indigo-100",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
    
  );
}
