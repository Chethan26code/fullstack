// app/(protected)/budgets/page.tsx
export default function BudgetsPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl md:text-2xl font-semibold">
          Smart Budget Planning
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Plan monthly or event-based budgets for your micro-communities and
          keep your collective spending aligned with your goals.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-[2fr,1.2fr] text-xs">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
            Example budgets (mock)
          </p>
          <div className="space-y-2">
            {[
              { name: "Monthly flat budget", spent: 42000, limit: 50000 },
              { name: "Weekend trip", spent: 18500, limit: 20000 },
              { name: "Club event", spent: 8200, limit: 10000 },
            ].map((b, i) => {
              const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
              const over = b.spent > b.limit;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-100">{b.name}</p>
                    <p
                      className={`text-[11px] ${
                        over ? "text-red-400" : "text-emerald-300"
                      }`}
                    >
                      {pct}% used
                    </p>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        over ? "bg-red-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Spent ₹{b.spent.toLocaleString()} of{" "}
                    ₹{b.limit.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
            What this section will handle
          </p>
          <ul className="space-y-1.5 text-slate-300">
            <li>• Creating budgets tied to groups & time periods.</li>
            <li>• Linking expenses to budget categories.</li>
            <li>• AI-suggested adjustments based on history.</li>
            <li>• Alerts when near or beyond limits.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
