"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, Save, LogOut } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setForm({
          name: data.user.name,
          email: data.user.email,
        });
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate update logic
    setTimeout(() => setLoading(false), 1000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="space-y-8" animate={false}>
        <div className="flex items-center gap-4 border-b border-white/5 pb-8">
          <div className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-neon-purple/10 text-neon-purple">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Identity Details</h2>
            <p className="text-sm text-white/40">Update your core profile information.</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8 pt-4">
          <div className="grid gap-5 sm:gap-4 sm:p-5 lg:p-6 lg:gap-5 sm:p-4 sm:p-5 lg:p-6 lg:p-8 sm:grid-cols-2">
            <Input 
              label="Full Name"
              icon={User}
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
            <Input 
              label="Email Address"
              icon={Mail}
              disabled
              value={form.email}
              className="opacity-50 cursor-not-allowed"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button type="submit" variant="neon" icon={Save} loading={loading}>Save Modifications</Button>
            <Button type="button" variant="ghost" className="text-rose-500 hover:bg-rose-500/10" icon={LogOut} onClick={handleLogout}>
              Delete Account
            </Button>
          </div>
        </form>
      </Card>

      <Card className="border-rose-500/20 bg-rose-500/[0.02]" animate={false}>
        <div className="flex items-start gap-4 sm:p-5 lg:p-6">
          <div className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-rose-500/10 text-rose-500 flex-shrink-0">
            <Shield size={24} />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-rose-500">Security Sector</h3>
              <p className="mt-1 text-sm text-white/40">Critical account operations. Modification of these parameters requires high-level clearance.</p>
            </div>
            <Button variant="outline" className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10">Request Password Reset</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
