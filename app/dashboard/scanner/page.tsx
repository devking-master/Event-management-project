"use client";

import { useState } from "react";
import { ScanLine, CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

export default function TicketScanner() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/tickets/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setResult({ success: res.ok, ...data });
      if (res.ok) setCode(""); // Clear for next scan
    } catch (error) {
      setResult({ success: false, message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div className="text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-purple-600/20 text-purple-400">
          <ScanLine size={40} />
        </div>
        <h1 className="text-4xl font-black">Gate Access</h1>
        <p className="mt-2 text-white/50">Scan or enter ticket codes to check in guests.</p>
      </div>

      <div className="glass rounded-[2.5rem] border border-white/10 bg-ink/50 p-10 shadow-glow">
        <form onSubmit={handleCheckIn} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-white/40 mb-4 text-center">Ticket Code</label>
            <input 
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-3xl font-black tracking-[0.2em] outline-none focus:border-purple-500 transition-all placeholder:text-white/5 uppercase"
              placeholder="EF-XXXXXX"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              autoFocus
            />
          </div>

          <button 
            disabled={loading || !code}
            className="w-full rounded-2xl bg-purple-600 py-6 font-black text-xl shadow-glow transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify Access"}
          </button>
        </form>

        {result && (
          <div className={`mt-10 animate-in fade-in slide-in-from-top-4 rounded-3xl p-8 border ${
            result.success ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
          }`}>
            <div className="flex items-center gap-6">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${
                result.success ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
              }`}>
                {result.success ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-1">
                  {result.success ? "Check-in Granted" : "Access Denied"}
                </p>
                <h3 className="text-2xl font-black">{result.message}</h3>
                {result.guest && (
                  <div className="mt-4 flex items-center gap-2 text-white/60">
                    <span className="font-bold text-white">{result.guest.name}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>{result.type} Ticket</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white/40 uppercase">Total Checked-in</p>
            <p className="text-2xl font-black">42</p>
          </div>
          <CheckCircle2 className="text-emerald-500" />
        </div>
        <div className="glass rounded-3xl border border-white/10 bg-white/5 p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white/40 uppercase">Pending Entry</p>
            <p className="text-2xl font-black">158</p>
          </div>
          <Loader2 className="text-cyan-500" />
        </div>
      </div>
    </div>
  );
}
