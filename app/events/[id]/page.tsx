"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { 
  Calendar, 
  MapPin, 
  Tag, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  Wallet, 
  Activity,
  Zap,
  ShieldCheck,
  Globe
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function EventDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<any>(null);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        setEvent(data.event);
        if (data.event?.ticketTypes?.length > 0) {
          setSelectedTier(data.event.ticketTypes[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-night flex flex-col items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="h-20 w-20 rounded-full border-2 border-neon-purple/20 border-t-neon-purple shadow-glow mb-8"
      />
      <p className="text-xs font-bold uppercase tracking-[0.4em] text-white/30 animate-pulse">Loading event details...</p>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-night flex items-center justify-center text-white">
      <p className="text-2xl font-black opacity-20">Event Not Found</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-night pb-32">
      <Navbar />

      {/* Cinematic Hero */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          src={event.imageUrl || event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        
        {/* HUD Elements Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-40 left-10 h-32 w-[1px] bg-gradient-to-b from-neon-purple to-transparent opacity-40" />
          <div className="absolute top-40 left-10 w-20 h-[1px] bg-gradient-to-r from-neon-purple to-transparent opacity-40" />
          <div className="absolute bottom-40 right-10 h-32 w-[1px] bg-gradient-to-t from-neon-cyan to-transparent opacity-40" />
          <div className="absolute bottom-40 right-10 w-20 h-[1px] bg-gradient-to-l from-neon-cyan to-transparent opacity-40" />
        </div>

        <div className="absolute bottom-20 left-0 w-full px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <span className="rounded-full bg-neon-purple/20 px-6 py-2 border border-neon-purple/30 text-[10px] font-black uppercase tracking-[0.3em] text-neon-purple backdrop-blur-xl">
                {event.category}
              </span>
              <span className="rounded-full bg-white/5 px-6 py-2 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 backdrop-blur-xl">
                {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-7xl font-black md:text-9xl lg:text-[10rem] leading-[0.85] tracking-tighter"
            >
              {event.title}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 mt-24 grid gap-16 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-20">
          <section className="space-y-10">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-neon-purple/10 flex items-center justify-center text-neon-purple border border-neon-purple/20">
                <Activity size={28} />
              </div>
              <h2 className="text-4xl font-black text-white">Event Information</h2>
            </div>
            
            <Card className="p-12" animate={false}>
              <p className="text-xl leading-relaxed text-white/60 whitespace-pre-line font-medium italic border-l-4 border-neon-purple pl-8">
                {event.description || "System logs empty. No description provided for this production."}
              </p>

              <div className="mt-16 grid gap-8 sm:grid-cols-2">
                <div className="group relative rounded-[2rem] bg-white/[0.03] p-8 border border-white/5 transition-all hover:bg-white/[0.06] hover:border-white/10">
                  <MapPin className="text-neon-cyan mb-6" size={32} />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Location</p>
                  <p className="text-2xl font-black text-white">{event.location}</p>
                </div>
                <div className="group relative rounded-[2rem] bg-white/[0.03] p-8 border border-white/5 transition-all hover:bg-white/[0.06] hover:border-white/10">
                  <Calendar className="text-neon-purple mb-6" size={32} />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Date & Time</p>
                  <p className="text-2xl font-black text-white">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </Card>
          </section>

          <section className="space-y-10">
            <h2 className="text-3xl font-black flex items-center gap-4 text-white">
              <Zap className="text-neon-cyan" size={24} /> 
              What to Expect
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, text: "Secure Payment Processing", color: "text-emerald-400" },
                { icon: Zap, text: "Instant Ticket Delivery", color: "text-neon-purple" },
                { icon: Globe, text: "Access from Anywhere", color: "text-neon-cyan" },
                { icon: Users, text: "Premium Experience", color: "text-neon-pink" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-6 rounded-3xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors">
                  <feature.icon className={feature.color} size={24} />
                  <span className="font-bold text-white/80">{feature.text}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="relative">
          <div className="sticky top-32 glass rounded-[3rem] border border-white/10 bg-ink/80 p-10 shadow-glow overflow-hidden">
            {/* Background design */}
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-neon-purple/10 blur-[80px]" />
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-10 flex items-center justify-between text-white">
                Tickets
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 animate-pulse">● Live</span>
              </h3>
              
              <div className="space-y-5">
                {event.ticketTypes.map((tier: any) => (
                  <button 
                    key={tier.name}
                    onClick={() => setSelectedTier(tier)}
                    className={`group w-full relative flex items-center justify-between rounded-3xl border-2 p-6 transition-all duration-500 ${
                      selectedTier?.name === tier.name 
                      ? "border-neon-purple bg-neon-purple/10 shadow-glow" 
                      : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="text-left">
                      <p className={`text-lg font-black transition-colors ${selectedTier?.name === tier.name ? "text-neon-purple" : "text-white"}`}>
                        {tier.name}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">
                        {tier.quantity - (event.soldTickets || 0)} Available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black">₦{tier.price.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/30">Quantity</p>
                  <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-2 border border-white/10">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-bold hover:bg-white/10 transition"
                    >
                      -
                    </button>
                    <span className="text-xl font-black w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-bold hover:bg-white/10 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/30">Selected</p>
                    <p className="text-sm font-black mt-1 text-white">{quantity}x {selectedTier?.name} Ticket{quantity > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold uppercase tracking-widest text-white/30">Total Price</p>
                    <p className="text-4xl font-black text-neon-cyan">₦{(selectedTier?.price * quantity).toLocaleString() || 0}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => router.push(`/checkout/${id}?tier=${selectedTier?.name}&quantity=${quantity}`)}
                  variant="neon" 
                  size="xl" 
                  className="w-full text-2xl h-20 shadow-glow"
                  icon={ChevronRight}
                >
                  Get Tickets
                </Button>

                <div className="flex flex-col items-center gap-4 opacity-40">
                  <div className="flex items-center gap-6">
                    <ShieldCheck size={20} />
                    <Wallet size={20} />
                    <Zap size={20} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] italic text-center text-white/30">
                    Secure Payment Guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
