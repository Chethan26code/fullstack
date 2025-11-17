// app/(protected)/payments/page.tsx

export default function PaymentsPage() {
  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-semibold">
          Payment Management
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          See who owes what, generate simple settlement paths, and keep every
          micro-community synced on payments without awkward follow-ups.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-[2fr,1.2fr] text-xs">
        {/* Mock settlement list */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
            Example settlements (mock)
          </p>

          <div className="space-y-2">
            {[
              { from: "Aditi", to: "Rahul", amount: 1200 },
              { from: "Karan", to: "Aditi", amount: 800 },
              { from: "Megha", to: "Karan", amount: 600 },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
              >
                <div>
                  <p className="text-xs text-slate-100">
                    {s.from} → {s.to}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Simplified path to settle shared expenses
                  </p>
                </div>
                <p className="text-sm font-semibold text-emerald-300">
                  ₹{s.amount}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
            <p className="text-[11px] text-slate-400">
              In the real app, this section would:
            </p>
            <ul className="space-y-1 text-slate-300">
              <li>• Compute net balances for each member.</li>
              <li>• Generate minimal payment paths to settle dues.</li>
              <li>• Let users mark payments as completed or partial.</li>
              <li>• Sync status back to the group automatically.</li>
            </ul>
          </div>
        </div>

        {/* Status & summary */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Group status snapshot (mock)
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-100">Total outstanding</p>
              <p className="text-[11px] text-slate-500">
                Across all active groups
              </p>
            </div>
            <p className="text-sm font-semibold text-red-300">₹3,400</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-[11px] text-slate-400 mb-1">
              How the flow will work:
            </p>
            <ul className="space-y-1.5 text-slate-300">
              <li>1. Pull balances from the expense engine.</li>
              <li>2. Compute a graph of who owes whom.</li>
              <li>3. Reduce it to minimal payment edges.</li>
              <li>4. Present clear, shareable payment instructions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
