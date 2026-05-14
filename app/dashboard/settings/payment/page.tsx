"use client";

import { CreditCard, Wallet, ShieldCheck, Plus } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function PaymentSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="space-y-8" animate={false}>
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-cyan/10 text-neon-cyan">
              <CreditCard size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black">Payment Methods</h2>
              <p className="text-sm text-white/40">Manage your connected payment methods and withdrawal accounts.</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" icon={Plus}>Link Method</Button>
        </div>

        <div className="grid gap-6">
          <div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition">
            <div className="flex items-center gap-6">
              <div className="h-14 w-20 rounded-xl bg-white/5 flex items-center justify-center font-bold italic text-white/20">VISA</div>
              <div>
                <p className="text-lg font-black text-white/80">•••• •••• •••• 4242</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/20 mt-1">Expires 12/28</p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full text-white/40">Primary</span>
          </div>

          <div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition opacity-50 grayscale">
            <div className="flex items-center gap-6">
              <div className="h-14 w-20 rounded-xl bg-white/5 flex items-center justify-center font-bold italic text-white/20">PAYSTACK</div>
              <div>
                <p className="text-lg font-black text-white/80">oluwa***@gmail.com</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/20 mt-1">Verification Required</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-neon-purple">Verify</Button>
          </div>
        </div>
      </Card>

      <Card className="bg-emerald-500/[0.02] border-emerald-500/20" animate={false}>
        <div className="flex items-start gap-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-400">Transaction Security</h3>
            <p className="mt-1 text-sm text-white/40 leading-relaxed">
              All payment data is encrypted using AES-256 standards. We never store your full card details on our local nodes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
