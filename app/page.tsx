// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      
      {/* Floating blurred lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-600/20 blur-3xl rounded-full opacity-60" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl shadow-[0_18px_80px_rgba(0,0,0,0.7)] px-8 py-12 flex flex-col gap-8 animate-fadeUp">
          
          {/* Header Logo / Badge */}
          <div className="inline-flex items-center gap-2 self-center rounded-full bg-slate-900/50 px-4 py-1 border border-indigo-500/30 text-[10px] font-medium text-indigo-300 tracking-widest">
            VibeOS Starter Kit
          </div>

          {/* Headline */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-indigo-100 to-indigo-300 drop-shadow-xl">
              Build Fast. Launch Faster.
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto">
              Auth-enabled starter with Firebase + Next.js + Tailwind.
              Designed for modern AI experiences and instant launches.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition"
            >
              🚀 Get Started
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-6 py-3 text-sm font-medium text-slate-100 hover:bg-slate-800/80 transition"
            >
              Create Account
            </Link>
          </div>

          {/* Features */}
          <div className="grid gap-4 text-xs text-slate-400">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-indigo-500/40 transition">
              <p className="font-medium text-indigo-300 mb-1">⚡ Modern Stack</p>
              <p>Next.js App Router + TypeScript + Tailwind CSS</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-indigo-500/40 transition">
              <p className="font-medium text-indigo-300 mb-1">🔐 Firebase Auth</p>
              <p>Email & Password + Google Sign-In included</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-indigo-500/40 transition">
              <p className="font-medium text-indigo-300 mb-1">🧠 AI-Ready</p>
              <p>Perfect base to add voice, chat & LLM features</p>
            </div>
          </div>
        </div>

        {/* Footer small badge */}
        <p className="mt-6 text-center text-[10px] text-slate-600">
          © 2025 VibeOS — All Rights Reserved.
        </p>
      </div>

      {/* Smooth fade-up animation */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeUp {
          animation: fadeUp 0.8s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
