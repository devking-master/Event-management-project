"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft,
  Bus,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Truck,
  User,
  Users,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type CardForm = {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function validateCard(form: CardForm) {
  const number = form.cardNumber.replace(/\s/g, "");
  const expiry = form.expiry.trim();
  const cvv = form.cvv.trim();

  if (!form.cardName.trim()) return "Cardholder name is required.";
  if (number.length !== 16) return "Card number must be 16 digits.";
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Expiry must be in MM/YY format.";
  if (!/^\d{3,4}$/.test(cvv)) return "CVV must be 3 or 4 digits.";

  const [monthText] = expiry.split("/");
  const month = Number(monthText);

  if (month < 1 || month > 12) return "Expiry month must be between 01 and 12.";

  return "";
}

function CheckoutContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [includeTransportation, setIncludeTransportation] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cardError, setCardError] = useState("");

  const [currentTier, setCurrentTier] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [transportQuantity, setTransportQuantity] = useState(1);

  const [cardForm, setCardForm] = useState<CardForm>({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

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
        setTransportQuantity(urlQty);
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
  const transportUnitPrice = event?.isTransportationFree ? 0 : Number(event?.transportationPrice || 0);
  const transportAmount = includeTransportation ? transportUnitPrice * transportQuantity : 0;
  const totalAmount = baseAmount + transportAmount;

  const ticketSeatsLeft = Number(selectedTier?.quantity || 0);

  const transportSeatsLeft =
    event?.transportSeatsLeft ??
    Math.max(0, Number(event?.transportSeats || 0) - Number(event?.transportBooked || 0));

  const openPaymentModal = () => {
    if (!selectedTier) {
      alert("Please select a ticket type.");
      return;
    }

    if (currentQuantity > ticketSeatsLeft) {
      alert(`Only ${ticketSeatsLeft} ticket(s) available.`);
      return;
    }

    if (includeTransportation && transportQuantity > transportSeatsLeft) {
      alert(`Only ${transportSeatsLeft} transport seat(s) available.`);
      return;
    }

    setCardError("");
    setPaymentOpen(true);
  };

  const processFakePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateCard(cardForm);
    if (error) {
      setCardError(error);
      return;
    }

    setPaying(true);
    setCardError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

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
        setCardError(data.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error(error);
      setCardError("Something went wrong while processing payment.");
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
                        <span className="ml-2 text-xs text-white/35">
                          {Math.max(0, Number(tier.quantity || 0))} left
                        </span>
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
                        onClick={() => {
                          const next = Math.max(1, currentQuantity - 1);
                          setCurrentQuantity(next);
                          if (!includeTransportation) setTransportQuantity(next);
                        }}
                        className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xl font-black text-white">{currentQuantity}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.min(ticketSeatsLeft, currentQuantity + 1);
                          setCurrentQuantity(next);
                          if (!includeTransportation) setTransportQuantity(next);
                        }}
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
                    disabled={transportSeatsLeft <= 0}
                    onChange={(e) => {
                      setIncludeTransportation(e.target.checked);
                      setTransportQuantity(currentQuantity);
                    }}
                  />
                </label>

                <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
                  <p className="flex items-center gap-2 text-sm text-white/55">
                    <Bus size={16} className="text-emerald-300" /> {event.transportType || "Bus"}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-white/55">
                    <MapPin size={16} className="text-neon-cyan" /> {event.transportPickup || "Pickup not specified"}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-white/55">
                    <Clock size={16} className="text-neon-purple" />
                    {event.transportDepartureTime
                      ? new Date(event.transportDepartureTime).toLocaleString()
                      : "Departure not set"}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-white/55">
                    <Users size={16} className="text-neon-pink" /> {transportSeatsLeft} seats left
                  </p>
                </div>

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
                          onClick={() => setTransportQuantity(Math.min(transportSeatsLeft, transportQuantity + 1))}
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
              onClick={openPaymentModal}
              disabled={!selectedTier || currentQuantity > ticketSeatsLeft || (includeTransportation && transportQuantity > transportSeatsLeft)}
            >
              Pay Now
            </Button>

            <p className="flex items-center justify-center gap-2 text-center text-xs text-white/30">
              <Lock size={13} />
              Demo payment only. Card details are not saved.
            </p>
          </Card>
        </div>
      </div>

      {paymentOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">
          <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[2rem] border border-white/10 bg-[#070712] shadow-2xl shadow-neon-purple/20 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-neon-purple/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neon-purple/70">
            <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6 sticky top-0 bg-[#070712]">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-purple/10 text-neon-purple">
                  <CreditCard size={24} />
                </div>

                <div>
                  <h3 className="text-xl font-black text-white">Card Payment</h3>
                  <p className="text-xs text-white/35">Enter card details to continue</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => !paying && setPaymentOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/45 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={processFakePayment} className="space-y-5 p-5 sm:p-6">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-neon-purple/20 via-white/[0.04] to-neon-cyan/10 p-5">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-white/45">
                    EventFlow Card
                  </span>
                  <CreditCard className="text-white/55" />
                </div>

                <p className="font-mono text-xl font-black tracking-widest text-white sm:text-2xl">
                  {cardForm.cardNumber || "4242 4242 4242 4242"}
                </p>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                      Cardholder
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-white">
                      {cardForm.cardName || "YOUR NAME"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                      Expires
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {cardForm.expiry || "12/30"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-white/45">
                  Cardholder Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                  <input
                    value={cardForm.cardName}
                    onChange={(e) => setCardForm({ ...cardForm, cardName: e.target.value })}
                    placeholder="e.g. Abass Oluwaseun"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 pl-12 text-white outline-none placeholder:text-white/20 focus:border-neon-purple/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-white/45">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                  <input
                    value={cardForm.cardNumber}
                    onChange={(e) =>
                      setCardForm({
                        ...cardForm,
                        cardNumber: formatCardNumber(e.target.value),
                      })
                    }
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 pl-12 text-white outline-none placeholder:text-white/20 focus:border-neon-purple/50"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-white/45">
                    Expiry
                  </label>
                  <input
                    value={cardForm.expiry}
                    onChange={(e) =>
                      setCardForm({
                        ...cardForm,
                        expiry: formatExpiry(e.target.value),
                      })
                    }
                    inputMode="numeric"
                    placeholder="MM/YY"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none placeholder:text-white/20 focus:border-neon-purple/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-white/45">
                    CVV
                  </label>
                  <input
                    value={cardForm.cvv}
                    onChange={(e) =>
                      setCardForm({
                        ...cardForm,
                        cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    inputMode="numeric"
                    placeholder="123"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none placeholder:text-white/20 focus:border-neon-purple/50"
                  />
                </div>
              </div>

              {cardError && (
                <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-bold text-rose-300">
                  {cardError}
                </p>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/45">Amount to pay</span>
                  <span className="text-2xl font-black text-neon-cyan">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button type="submit" variant="neon" size="lg" fullWidth loading={paying}>
                {paying ? "Processing..." : "Pay"}
              </Button>

              <p className="flex items-center justify-center gap-2 text-center text-xs text-white/30">
                <CheckCircle2 size={13} />
                Demo only: use any 16 digits, valid MM/YY, and any CVV.
              </p>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-night">
          <Loader2 className="h-10 w-10 animate-spin text-neon-purple" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
