// app/(protected)/expenses/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Member = string;

interface Expense {
  id: number;
  description: string;
  amount: number;
  payer: Member;
  participants: Member[];
}

export default function ExpensesPage() {
  const [membersInput, setMembersInput] = useState("You, Friend 1, Friend 2");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState<Member>("");
  const [selectedParticipants, setSelectedParticipants] = useState<Member[]>([]);
  const [nextId, setNextId] = useState(1);

  // Parse members from the comma-separated input
  const members = useMemo(() => {
    return membersInput
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
  }, [membersInput]);

  // Ensure payer + participants stay valid if members change
  useEffect(() => {
    if (members.length > 0) {
      if (!members.includes(payer)) {
        setPayer(members[0]);
      }
      setSelectedParticipants((prev) =>
        prev.filter((p) => members.includes(p)).length > 0
          ? prev.filter((p) => members.includes(p))
          : members
      );
    } else {
      setPayer("");
      setSelectedParticipants([]);
    }
  }, [members, payer]);

  const toggleParticipant = (member: Member) => {
    setSelectedParticipants((prev) =>
      prev.includes(member)
        ? prev.filter((m) => m !== member)
        : [...prev, member]
    );
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!description.trim() || isNaN(amt) || amt <= 0) return;
    if (!payer || selectedParticipants.length === 0) return;

    const newExpense: Expense = {
      id: nextId,
      description: description.trim(),
      amount: amt,
      payer,
      participants: selectedParticipants,
    };

    setExpenses((prev) => [...prev, newExpense]);
    setNextId((id) => id + 1);
    setDescription("");
    setAmount("");
  };

  const handleRemoveExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const balances = useMemo(
    () => calculateBalances(members, expenses),
    [members, expenses]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-semibold">
          Group Expense Tracking & Balances
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Add your group members and shared expenses. The calculator will split
          each bill and show how much each person needs to pay or should
          receive.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-[1.5fr,1.2fr] lg:grid-cols-[2fr,1.5fr] text-xs">
        {/* LEFT: Members + Add Expense + List */}
        <div className="space-y-4">
          {/* Members input */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Step 1 · Define members
            </p>
            <label className="text-[11px] text-slate-300">
              Enter names separated by commas (e.g.{" "}
              <span className="text-slate-100">
                You, Rahul, Aditi, Karan
              </span>
              )
            </label>
            <input
              value={membersInput}
              onChange={(e) => setMembersInput(e.target.value)}
              placeholder="You, Friend 1, Friend 2"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400">
              Current members:{" "}
              {members.length > 0 ? members.join(" · ") : "None yet"}
            </p>
          </section>

          {/* Add expense form */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Step 2 · Add an expense
            </p>

            {members.length === 0 ? (
              <p className="text-[11px] text-red-300">
                Add at least one member above before creating expenses.
              </p>
            ) : (
              <form className="space-y-3" onSubmit={handleAddExpense}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300">
                      Description
                    </label>
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Groceries, rent, movie night..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1200"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300">
                      Who paid?
                    </label>
                    <select
                      value={payer}
                      onChange={(e) => setPayer(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {members.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300">
                      Who participated?
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {members.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleParticipant(m)}
                          className={`rounded-full border px-2 py-0.5 text-[11px] ${
                            selectedParticipants.includes(m)
                              ? "border-indigo-500/80 bg-indigo-500/20 text-indigo-100"
                              : "border-slate-700 bg-slate-950/70 text-slate-300 hover:border-indigo-500/40"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Click to toggle members. Share is split equally among
                      selected participants.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-1 inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-[11px] font-medium text-white hover:bg-indigo-400 transition disabled:opacity-60"
                  disabled={
                    !description.trim() ||
                    !amount ||
                    isNaN(parseFloat(amount)) ||
                    parseFloat(amount) <= 0 ||
                    !payer ||
                    selectedParticipants.length === 0
                  }
                >
                  Add expense
                </button>
              </form>
            )}
          </section>

          {/* Expense list */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Step 3 · Current expenses
            </p>

            {expenses.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                No expenses added yet. Start by creating one above.
              </p>
            ) : (
              <div className="space-y-2">
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
                  >
                    <div>
                      <p className="text-xs text-slate-100">
                        {exp.description}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Paid by{" "}
                        <span className="text-slate-100">{exp.payer}</span> ·
                        Amount:{" "}
                        <span className="text-slate-100">
                          ₹{exp.amount.toFixed(2)}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Split between: {exp.participants.join(" · ")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveExpense(exp.id)}
                      className="text-[10px] text-slate-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: Balances summary */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Step 4 · Who owes what?
            </p>

            {members.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                Add members to see balance calculations.
              </p>
            ) : expenses.length === 0 ? (
              <p className="text-[11px] text-slate-400">
                Add at least one expense to see who owes what.
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(balances).map(([member, balance]) => {
                  const isOwed = balance > 0.01;
                  const owes = balance < -0.01;
                  const rounded = Math.abs(balance).toFixed(2);

                  return (
                    <div
                      key={member}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
                    >
                      <div>
                        <p className="text-xs text-slate-100">{member}</p>
                        <p className="text-[11px] text-slate-400">
                          {isOwed && (
                            <>
                              Should receive{" "}
                              <span className="text-emerald-300">
                                ₹{rounded}
                              </span>{" "}
                              from the group.
                            </>
                          )}
                          {owes && (
                            <>
                              Needs to pay{" "}
                              <span className="text-red-300">₹{rounded}</span>{" "}
                              to the group.
                            </>
                          )}
                          {!isOwed && !owes && (
                            <>Is settled. No pending amount.</>
                          )}
                        </p>
                      </div>
                      <p
                        className={`text-xs font-semibold ${
                          isOwed
                            ? "text-emerald-300"
                            : owes
                            ? "text-red-300"
                            : "text-slate-400"
                        }`}
                      >
                        {balance > 0
                          ? `+₹${rounded}`
                          : balance < 0
                          ? `-₹${rounded}`
                          : "₹0.00"}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-[10px] text-slate-500">
              Positive amounts mean the member is owed money. Negative amounts
              mean they owe the group.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-[11px] text-slate-400 space-y-1.5">
            <p className="text-slate-300 font-medium">
              How the math works (simplified)
            </p>
            <p>
              For each expense, the payer&apos;s{" "}
              <span className="text-slate-100">“paid”</span> increases by the
              full amount. Each participant&apos;s{" "}
              <span className="text-slate-100">“owed”</span> increases by their
              share (amount ÷ participants). Final balance = paid − owed.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function calculateBalances(
  members: Member[],
  expenses: Expense[]
): Record<Member, number> {
  const paid: Record<Member, number> = {};
  const owed: Record<Member, number> = {};

  // Initialize
  for (const m of members) {
    paid[m] = 0;
    owed[m] = 0;
  }

  for (const exp of expenses) {
    if (exp.amount <= 0 || exp.participants.length === 0) continue;

    const share = exp.amount / exp.participants.length;

    // Payer paid the entire amount
    paid[exp.payer] = (paid[exp.payer] ?? 0) + exp.amount;

    // Each participant owes a share
    for (const p of exp.participants) {
      owed[p] = (owed[p] ?? 0) + share;
    }
  }

  const balances: Record<Member, number> = {};
  for (const m of members) {
    balances[m] = (paid[m] ?? 0) - (owed[m] ?? 0);
  }
  return balances;
}
