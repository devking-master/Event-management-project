"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, CreditCard, LogOut, Activity } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-8" animate={false}>
          <div className="flex items-center gap-6 mb-8">
            <div className="h-20 w-20 rounded-[2rem] bg-neon-purple/10 flex items-center justify-center text-neon-purple border border-neon-purple/20">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black">{user?.name || "Loading..."}</h2>
              <p className="text-white/40 font-medium">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-neon-cyan" />
                <span className="text-sm font-bold">Access Level</span>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-white/60">{user?.role}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-emerald-400" />
                <span className="text-sm font-bold">Account Status</span>
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Verified</span>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-rose-500/5 border-rose-500/20" animate={false}>
          <h3 className="text-xl font-black mb-4">Sign Out</h3>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Sign out of your account. You will need to log in again to access the dashboard.
          </p>
          <Button 
            variant="ghost" 
            className="w-full text-rose-500 hover:bg-rose-500/10" 
            icon={LogOut}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Card>
      </div>

      <Card className="p-8" animate={false}>
        <h3 className="text-xl font-black mb-6">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Update Profile", icon: User, href: "/dashboard/settings/profile" },
            { label: "Payment Systems", icon: CreditCard, href: "/dashboard/settings/payment" },
            { label: "Security Settings", icon: Shield, href: "/dashboard/settings/security" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => window.location.href = item.href}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all group text-left"
            >
              <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-neon-purple/20 transition-all">
                <item.icon size={20} />
              </div>
              <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

