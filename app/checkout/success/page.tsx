"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { CheckCircle2, Ticket, ArrowRight, Download, Share2, Calendar, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          setOrder(data.order);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen bg-night flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="h-12 w-12 rounded-full border-2 border-neon-purple/20 border-t-neon-purple shadow-glow"
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-night pb-32">
      <Navbar />
      
      <div className="mx-auto max-w-4xl px-8 pt-40">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tight mb-4"
          >
            Transmission <span className="text-emerald-400">Successful</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/40"
          >
            Your access node has been initialized. Secure your tickets below.
          </motion.p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr]">
          <div className="space-y-8">
            <Card className="p-0 overflow-hidden" animate={false}>
              <div className="bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 p-8 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Ticket className="text-white" size={24} />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">Digital Asset Pass</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1 rounded-full shadow-glow">Verified</span>
                </div>
              </div>
              
              <div className="p-10 space-y-10">
                <div>
                  <h2 className="text-3xl font-black mb-2">{order?.eventId?.title}</h2>
                  <div className="flex flex-wrap gap-6 mt-4">
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Calendar size={16} className="text-neon-purple" />
                      {order?.eventId?.date && new Date(order.eventId.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <MapPin size={16} className="text-neon-cyan" />
                      {order?.eventId?.location}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {order?.tickets?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Access Level</p>
                        <p className="text-xl font-black text-neon-purple">{item.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Quantity</p>
                        <p className="text-xl font-black">{item.quantity} Tickets</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
                  <Button variant="secondary" icon={Download} className="flex-1">Download Pass</Button>
                  <Button variant="secondary" icon={Share2} className="flex-1">Share Access</Button>
                </div>
              </div>
            </Card>
          </div>

          <aside className="space-y-8">
            <Card className="bg-neon-purple/5 border-neon-purple/20" animate={false}>
              <h3 className="text-xl font-black mb-6">Next Operations</h3>
              <div className="space-y-4">
                <Button 
                  onClick={() => router.push("/dashboard/tickets")}
                  variant="neon" 
                  className="w-full justify-between"
                  icon={ArrowRight}
                >
                  View My Tickets
                </Button>
                <Button 
                  onClick={() => router.push("/events")}
                  variant="outline" 
                  className="w-full"
                >
                  Explore More
                </Button>
              </div>
            </Card>

            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-white/20 mb-4">Support Identification</p>
              <p className="text-[10px] font-mono text-white/40 break-all">{orderId}</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
