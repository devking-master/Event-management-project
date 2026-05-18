"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, CreditCard, Loader2, Truck } from "lucide-react";
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

  const [currentTier, setCurrentTier] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [transportQuantity, setTransportQuantity] = useState(1);

  useEffect(() => {
    const checkAuthAndFetchEvent = async () => {
      try {
        const me = await fetch("/api/auth/me");
        if (!me.ok) {
          router.replace(`/login?redirect=/checkout/${id}`);
          return;
        }

        const res = await fetch(`/api/events/${id}`, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok || !data.event) {
          alert(data.message || "Event not found");
          router.replace("/events");
          return;
        }

        if (data.event.status === "ended") {
          alert("This event has ended.");
          router.replace("/events");
          return;
        }

        setEvent(data.event);

        const urlTier = searchParams.get("tier");
        const urlQty = Number(searchParams.get("quantity")) || 1;

        if (urlTier && data.event.ticketTypes.some((ticket: any) => ticket.name === urlTier)) {
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

    checkAuthAndFetchEvent();
  }, [id, router, searchParams]);

  const selectedTier = event?.ticketTypes?.find((ticket: any) => ticket.name === currentTier);
  const baseAmount = (Number(selectedTier?.price) || 0) * currentQuantity;
  const transportAmount = includeTransportation ? (Number(event?.transportationPrice) || 0) * transportQuantity : 0;
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

      if (res.status === 401) {
        router.push(`/login?redirect=/checkout/${id}`);
        return;
      }

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night">
        <Loader2 className="h-10 w-10 animate-spin text-neon-purple" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-night pb-24">
      <Navbar />

      <div className="mx-auto max-w-5xl px-5 pt-32 sm:pt-40">
        <button
          onClick={() => router.back()}
          className="mb-10 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/35 transition hover:text-white"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card animate={false} className="space-y-6">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-purple/10 text-neon-purple">
                <CreditCard size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">Checkout</h1>
                <p className="text-sm text-white/40">Complete payment for {event?.title}</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row">
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={event?.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                  alt={event?.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-neon-cyan">
                    Select Ticket Type
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {event?.ticketTypes?.map((tier: any) => (
                      <button
                        type="button"
                        key={tier.name}
                        onClick={() => setCurrentTier(tier.name)}
                        className={`rounded-2xl border px-5 py-3 text-sm font-bold transition ${
                          currentTier === tier.name
                            ? "border-neon-purple bg-neon-purple/10 text-white shadow-glow"
                            : "border-white/10 bg-white/[0.04] text-white/45 hover:bg-white/[0.07]"
                        }`}
                      >
                        {tier.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-widest text-white/35">
                      Ticket Quantity
                    </p>
                    <div className="flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
                      <button
                        type="button"
                        onClick={() => setCurrentQuantity(Math.max(1, currentQuantity - 1))}
                        className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xl font-black text-white">{currentQuantity}</span>
                      <button
                        type="button"
                        onClick={() => setCurrentQuantity(currentQuantity + 1)}
                        className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs font-black uppercase tracking-widest text-white/25">Subtotal</p>
                    <p className="text-2xl font-black text-neon-cyan">₦{baseAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {event?.transportationAvailable && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <label className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Truck className="mt-1 text-emerald-300" />
                    <div>
                      <p className="font-black text-white">Add Transportation</p>
                      <p className="mt-1 text-sm text-white/45">
                        {event.transportationDetails || "Transportation is available for this event."}
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={includeTransportation}
                    onChange={(e) => setIncludeTransportation(e.target.checked)}
                  />
                </label>

                {includeTransportation && (
                  <div className="mt-5 flex items-center justify-between gap-5 border-t border-white/10 pt-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white/35">
                        Transport Quantity
                      </p>
                      <div className="mt-3 flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
                        <button
                          type="button"
                          onClick={() => setTransportQuantity(Math.max(1, transportQuantity - 1))}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xl font-black text-white">{transportQuantity}</span>
                        <button
                          type="button"
                          onClick={() => setTransportQuantity(transportQuantity + 1)}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="text-2xl font-black text-emerald-300">
                      ₦{transportAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card animate={false} className="h-fit space-y-5">
            <h2 className="text-2xl font-black">Order Summary</h2>

            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm">
              <div className="flex justify-between gap-4 text-white/55">
                <span>Ticket</span>
                <span className="font-bold text-white">₦{baseAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between gap-4 text-white/55">
                <span>Transportation</span>
                <span className="font-bold text-white">₦{transportAmount.toLocaleString()}</span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-white/55">Total</span>
                  <span className="text-3xl font-black text-neon-cyan">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button
              variant="neon"
              size="lg"
              fullWidth
              loading={paying}
              onClick={handlePayment}
              disabled={!selectedTier}
            >
              Pay Now
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
