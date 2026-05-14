"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { ShieldCheck, CreditCard, ArrowLeft, Loader2, Zap, Lock, Info } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function CheckoutPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [includeTransportation, setIncludeTransportation] = useState(false);
  
  // Selection states
  const [currentTier, setCurrentTier] = useState<string>("");
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [transportQuantity, setTransportQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        setEvent(data.event);
        
        // Initialize selection from URL or defaults
        const urlTier = searchParams.get("tier");
        const urlQty = Number(searchParams.get("quantity")) || 1;
        
        if (urlTier && data.event.ticketTypes.some((t: any) => t.name === urlTier)) {
          setCurrentTier(urlTier);
        } else if (data.event.ticketTypes.length > 0) {
          setCurrentTier(data.event.ticketTypes[0].name);
        }
        
        setCurrentQuantity(urlQty);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, searchParams]);

  const selectedTier = event?.ticketTypes.find((t: any) => t.name === currentTier);
  const baseAmount = (selectedTier?.price || 0) * currentQuantity;
  const transportAmount = includeTransportation ? (event?.transportationPrice || 0) * transportQuantity : 0;
  const totalAmount = baseAmount + transportAmount;

  const handlePayment = async () => {
    setPaying(true);
    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          ticketType: currentTier,
          quantity: currentQuantity,
          includeTransportation,
          transportQuantity: includeTransportation ? transportQuantity : 0,
          amount: totalAmount,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert(data.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-night flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-neon-purple" />
    </div>
  );

  return (
    <main className="min-h-screen bg-night pb-32">
      <Navbar />
      
      <div className="mx-auto max-w-4xl px-8 pt-40">
        <button onClick={() => router.back()} className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white transition mb-12 group">
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" /> Back
        </button>

        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-8">
            <Card className="p-10" animate={false}>
              <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
                <div className="h-12 w-12 rounded-2xl bg-neon-purple/10 flex items-center justify-center text-neon-purple border border-neon-purple/20">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white">Checkout</h1>
                  <p className="text-sm text-white/40">Complete your payment for {event?.title}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="h-32 w-32 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img 
                        src={event?.imageUrl || event?.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
                        alt={event?.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neon-cyan">Select Ticket Type</p>
                          <div className="flex flex-wrap gap-3">
                            {event?.ticketTypes.map((tier: any) => (
                              <button
                                key={tier.name}
                                onClick={() => setCurrentTier(tier.name)}
                                className={`px-6 py-3 rounded-2xl border-2 transition-all text-sm font-bold ${
                                  currentTier === tier.name 
                                  ? "border-neon-purple bg-neon-purple/10 text-white shadow-glow" 
                                  : "border-white/5 bg-white/5 text-white/40 hover:border-white/10"
                                }`}
                              >
                                {tier.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-widest text-white/20 mb-1">Unit Price</p>
                          <p className="text-2xl font-black text-white">₦{(selectedTier?.price || 0).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Ticket Quantity</p>
                          <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-2 border border-white/10 w-fit">
                            <button 
                              onClick={() => setCurrentQuantity(Math.max(1, currentQuantity - 1))}
                              className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-bold hover:bg-white/10 transition text-white"
                            >
                              -
                            </button>
                            <span className="text-xl font-black w-8 text-center text-white">{currentQuantity}</span>
                            <button 
                              onClick={() => setCurrentQuantity(currentQuantity + 1)}
                              className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-bold hover:bg-white/10 transition text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold uppercase tracking-widest text-white/20 mb-1">Subtotal</p>
                          <p className="text-2xl font-black text-neon-cyan">₦{baseAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {event?.transportationAvailable && (
                    <div className="pt-6 mt-6 border-t border-white/5 flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <input 
                            type="checkbox" 
                            id="transport"
                            className="h-6 w-11 appearance-none rounded-full bg-white/10 checked:bg-neon-purple transition-all relative cursor-pointer after:content-[''] after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all checked:after:left-6"
                            checked={includeTransportation}
                            onChange={e => {
                              setIncludeTransportation(e.target.checked);
                              if (e.target.checked && transportQuantity === 0) {
                                setTransportQuantity(1);
                              }
                            }}
                          />
                          <label htmlFor="transport" className="cursor-pointer">
                            <p className="text-sm font-black text-white">Add Transportation</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Transportation fee (₦{(event.transportationPrice || 0).toLocaleString()} per person)</p>
                          </label>
                        </div>
                      </div>
                      
                      {includeTransportation && (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Transportation Quantity</p>
                            <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-2 border border-white/10 w-fit">
                              <button 
                                onClick={() => setTransportQuantity(Math.max(1, transportQuantity - 1))}
                                className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-bold hover:bg-white/10 transition text-white"
                              >
                                -
                              </button>
                              <span className="text-xl font-black w-8 text-center text-white">{transportQuantity}</span>
                              <button 
                                onClick={() => setTransportQuantity(transportQuantity + 1)}
                                className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-bold hover:bg-white/10 transition text-white"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/20 mb-1">Subtotal</p>
                            <p className="text-2xl font-black text-neon-purple">₦{transportAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.02] flex flex-col items-center text-center">
                    <ShieldCheck className="text-emerald-400 mb-3" size={24} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Security</p>
                    <p className="text-sm font-bold mt-1 text-white">Secure SSL Payment</p>
                  </div>
                  <div className="p-6 rounded-3xl border border-neon-purple/10 bg-neon-purple/[0.02] flex flex-col items-center text-center">
                    <Lock className="text-neon-purple mb-3" size={24} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Privacy</p>
                    <p className="text-sm font-bold mt-1 text-white">Privacy Protected</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/[0.01] border-white/5" animate={false}>
              <div className="flex items-center gap-4 mb-6">
                <Info size={18} className="text-neon-cyan" />
                <h4 className="text-lg font-bold text-white">Instructions</h4>
              </div>
              <p className="text-sm text-white/30 leading-relaxed">
                Your payment will be processed securely. Once completed, your tickets will be available in your dashboard.
              </p>
            </Card>
          </div>

          <aside className="relative">
            <Card className="sticky top-32 space-y-10 bg-gradient-to-br from-neon-purple/10 to-transparent border-neon-purple/20" animate={false}>
              <h2 className="text-2xl font-black text-white">Order Summary</h2>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40 font-bold uppercase tracking-widest">Tickets ({currentQuantity})</span>
                  <span className="font-bold text-white">₦{baseAmount.toLocaleString()}</span>
                </div>
                {includeTransportation && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40 font-bold uppercase tracking-widest">Transportation</span>
                    <span className="font-bold text-white">₦{transportAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40 font-bold uppercase tracking-widest">Fee</span>
                  <span className="text-emerald-400 font-bold">₦0.00</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-lg font-black uppercase tracking-widest text-white">Total</span>
                  <div className="text-right">
                    <p className="text-4xl font-black text-neon-cyan">₦{totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <Button 
                  onClick={handlePayment}
                  disabled={paying}
                  variant="neon" 
                  size="xl" 
                  className="w-full text-xl h-20 shadow-glow"
                  loading={paying}
                >
                  {paying ? "Processing..." : "Pay Now"}
                </Button>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4 grayscale opacity-20">
                    <Zap size={20} />
                    <CreditCard size={20} />
                    <ShieldCheck size={20} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 text-center">
                    Secure Payment Processing
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
