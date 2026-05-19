"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowLeft, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

function LoginForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRedirectPath = (role?: string) => {
    const redirect = searchParams.get("redirect");

    if (redirect) return redirect;

    return role === "user" ? "/events" : "/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = getRedirectPath(data.user?.role);
      } else {
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
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10" />
      <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-neon-purple/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-neon-cyan/10 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition mb-6 sm:mb-10 group"
        >
          <ArrowLeft
            size={16}
            className="transition group-hover:-translate-x-1"
          />
          Back to Home
        </Link>

        <Card className="p-5 sm:p-8 lg:p-12 shadow-glow" animate={true}>
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-neon-purple shadow-glow">
              <LogIn size={32} className="text-white" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white">
              Login
            </h1>

            <p className="mt-3 text-white/40 font-medium italic">
              Attendees go to Explore Events. Organizers go to Dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
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
              <Link
                href="/signup"
                className="font-bold text-neon-purple hover:text-neon-cyan transition underline underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 opacity-20">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              Quantum Encrypted
            </span>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-night flex items-center justify-center text-white/50">
          Loading...
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}