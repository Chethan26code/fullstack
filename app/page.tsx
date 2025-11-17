// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl p-8 md:p-10">
        <div className="flex flex-col gap-6 md:gap-8">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-indigo-400 mb-3">
              MicroCircle Finance
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">
              Micro-communities,{" "}
              <span className="text-indigo-400">
                stress-free group finance.
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-xl">
              Automate group expense tracking, shared budgets, payment
              management, and let an agentic AI deliver recaps, payment guides,
              and smart plans for your community.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800/80 transition"
            >
              Create account
            </Link>
          </div>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="font-medium text-slate-200 mb-1">For groups</p>
              <p>Flatmates, travel squads, clubs, side projects.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="font-medium text-slate-200 mb-1">AI assistance</p>
              <p>Spend recaps, budget coach, payment guides.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <p className="font-medium text-slate-200 mb-1">Peace of mind</p>
              <p>No more “who owes what?” conflict drama.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
