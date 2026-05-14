"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, ArrowLeft, Zap, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        window.location.href = "/login";
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-night overflow-hidden flex items-center justify-center p-5 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10" />
      <div className="absolute top-1/4 right-1/4 h-96 w-96 bg-neon-cyan/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 h-96 w-96 bg-neon-purple/10 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-xl py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition mb-10 group">
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" /> Back to Home
        </Link>

        <Card className="p-12 shadow-glow-cyan" animate={true}>
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-neon-cyan shadow-glow-cyan">
              <UserPlus size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">Create Account</h1>
            <p className="mt-3 text-white/40 font-medium italic">Join EventFlow today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4 p-1 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <button
                type="button"
                onClick={() => setForm({...form, role: "user"})}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition ${
                  form.role === "user" ? "bg-neon-cyan text-white shadow-glow-cyan" : "text-white/30 hover:text-white/60"
                }`}
              >
                Attendee
              </button>
              <button
                type="button"
                onClick={() => setForm({...form, role: "organizer"})}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition ${
                  form.role === "organizer" ? "bg-neon-purple text-white shadow-glow" : "text-white/30 hover:text-white/60"
                }`}
              >
                Organizer
              </button>
            </div>

            <Input 
              label="Full Name"
              placeholder="e.g. John Doe"
              icon={User}
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />

            <Input 
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              icon={Mail}
              required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />

            <Input 
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400 text-center uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <Button 
              type="submit" 
              variant="neon" 
              size="xl" 
              className={`w-full ${form.role === 'user' ? 'bg-neon-cyan shadow-glow-cyan hover:bg-cyan-400' : 'bg-neon-purple shadow-glow hover:bg-purple-400'}`} 
              loading={loading}
              icon={UserPlus}
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-white/30">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-neon-cyan hover:text-neon-purple transition underline underline-offset-4">
                Login
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-20">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Identity Encrypted</span>
          </div>
        </Card>
      </div>
    </main>
  );
}
