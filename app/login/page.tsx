"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowLeft, Zap, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        window.location.href = "/events";
      } else {
        const data = await res.json();
        setError(data.message || "Invalid credentials");
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
      <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-neon-purple/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-neon-cyan/10 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition mb-6 sm:mb-10 group">
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" /> Back to Home
        </Link>

        <Card className="p-5 sm:p-5 sm:p-4 sm:p-5 lg:p-6 lg:p-8 lg:p-12 shadow-glow" animate={true}>
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 grid h-11 w-11 sm:h-12 sm:w-12 sm:h-14 sm:w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl bg-neon-purple shadow-glow">
              <LogIn size={32} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight break-words text-white">Login</h1>
            <p className="mt-3 text-white/40 font-medium italic">Please enter your details to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input 
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              icon={Mail}
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <Input 
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
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
              className="w-full" 
              loading={loading}
              icon={LogIn}
            >
              Login
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-white/30">
              New here?{" "}
              <Link href="/signup" className="font-bold text-neon-purple hover:text-neon-cyan transition underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 sm:p-5 lg:p-6 opacity-20">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Quantum Encrypted</span>
          </div>
        </Card>
      </div>
    </main>
  );
}
