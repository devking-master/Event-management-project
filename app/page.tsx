"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Star, ShieldCheck, Globe, Zap, BarChart3, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-night text-white">
      <Navbar />

      {/* Cinematic Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-5 pt-20">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        
        {/* Animated Background Glows */}
        <div className="absolute top-[20%] left-[10%] h-[400px] w-[400px] rounded-full bg-neon-purple/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-neon-cyan/10 blur-[120px] animate-pulse-slow" />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-neon-purple shadow-[0_0_8px_#a855f7]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Modern Event Management Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl font-black leading-[1.05] tracking-tight md:text-8xl lg:text-9xl"
          >
            Plan, Manage & <br />
            <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent">
              Scale Events
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-white/50 md:text-xl"
          >
            Plan, manage, and scale unforgettable events from one powerful platform. 
            Seamlessly coordinate <strong>events, tickets, guests, payments, and transportation</strong> from one unified dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            <Link href="/events">
              <Button size="xl" variant="neon" className="group">
                Explore Events <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative mt-24 w-full max-w-6xl px-5"
        >
          <div className="relative rounded-[3rem] border border-white/10 bg-ink/40 p-4 shadow-2xl backdrop-blur-3xl">
            <div className="overflow-hidden rounded-[2.2rem] border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
                alt="Dashboard Preview" 
                className="w-full opacity-40 grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* HUD Elements Overlay */}
            <div className="absolute -left-12 top-20 hidden lg:block">
              <Card className="w-64 p-6" delay={1}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neon-cyan">Real-time Revenue</p>
                <h3 className="mt-2 text-2xl font-black">₦1,240,000</h3>
                <div className="mt-3 h-1 w-full rounded-full bg-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 2, delay: 1.5 }}
                    className="h-full rounded-full bg-neon-cyan shadow-glow-cyan" 
                  />
                </div>
              </Card>
            </div>
            <div className="absolute -right-12 bottom-20 hidden lg:block">
              <Card className="w-64 p-6" delay={1.2}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neon-purple">Active Guests</p>
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="text-3xl font-black">842</h3>
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-ink bg-white/10" />
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="relative py-32 px-5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="hud-line mx-auto max-w-xs text-sm font-bold uppercase tracking-[0.4em] text-white/30">
              Platform Capabilities
            </h2>
            <h3 className="mt-8 text-4xl font-black md:text-5xl">Engineered for Excellence.</h3>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-purple/10 text-neon-purple">
                <Zap size={28} />
              </div>
              <h4 className="text-xl font-bold text-white">High Performance</h4>
              <p className="mt-4 leading-relaxed text-white/40">
                Built for high-traffic ticket launches. Fast, reliable, and always available.
              </p>
            </Card>

            <Card delay={0.1}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-cyan/10 text-neon-cyan">
                <BarChart3 size={28} />
              </div>
              <h4 className="text-xl font-bold text-white">Smart Analytics</h4>
              <p className="mt-4 leading-relaxed text-white/40">
                Get insights into guest behavior and ticket sales with real-time reports.
              </p>
            </Card>

            <Card delay={0.2}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-pink/10 text-neon-pink">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-xl font-bold text-white">Secure Payments</h4>
              <p className="mt-4 leading-relaxed text-white/40">
                Professional security for your data and payments. Trust is built into every transaction.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-white/[0.01] border-y border-white/5" />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            {[
              { label: "Tickets Sold", value: "2M+" },
              { label: "Active Events", value: "15k" },
              { label: "Countries", value: "42" },
              { label: "Reliability", value: "99.9%" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black text-white md:text-5xl">{stat.value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/30">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Redesign */}
      <footer className="border-t border-white/5 bg-ink/80 pt-20 pb-10 px-5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-32">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-600 shadow-glow">
                  <CalendarIcon size={20} className="text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Event<span className="text-neon-purple">Flow</span>
                </span>
              </Link>
              <p className="mt-6 max-w-md text-lg text-white/40">
                The world's most modern event management platform. Built for those who create unforgettable experiences.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-4">
                <h5 className="font-bold text-white">Platform</h5>
                <ul className="space-y-2 text-sm text-white/40">
                  <li><Link href="/events" className="hover:text-white transition">Explore</Link></li>
                  <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-white">Company</h5>
                <ul className="space-y-2 text-sm text-white/40">
                  <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-white">Support</h5>
                <ul className="space-y-2 text-sm text-white/40">
                  <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 text-xs font-bold uppercase tracking-widest text-white/20 sm:flex-row">
            <p>© 2026 EventFlow Technologies. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-white">Twitter</Link>
              <Link href="#" className="hover:text-white">Instagram</Link>
              <Link href="#" className="hover:text-white">Discord</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function CalendarIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
