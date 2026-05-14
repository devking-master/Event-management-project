"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, CreditCard, Shield, Bell } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { icon: User, label: "Identity Profile", href: "/dashboard/settings/profile" },
  { icon: CreditCard, label: "Payment Systems", href: "/dashboard/settings/payment" },
  { icon: Shield, label: "Security Layer", href: "/dashboard/settings/security" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h1 className="text-5xl font-black tracking-tight">System <span className="text-neon-purple">Configurations</span></h1>
        <p className="mt-2 text-lg text-white/40">Calibrate your identity and operational preferences.</p>
      </header>

      <div className="flex flex-col gap-12 lg:flex-row">
        <aside className="w-full lg:w-80">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link key={tab.href} href={tab.href}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-4 rounded-2xl px-6 py-5 text-sm font-bold transition-all ${
                      isActive 
                        ? "bg-white/5 text-white border border-white/10 shadow-glass" 
                        : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
                    }`}
                  >
                    <tab.icon size={20} className={isActive ? "text-neon-purple" : ""} />
                    {tab.label}
                    {isActive && (
                      <motion.div 
                        layoutId="active-tab"
                        className="ml-auto h-2 w-2 rounded-full bg-neon-purple shadow-glow" 
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
