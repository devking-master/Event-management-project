"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Activity, Calendar, MapPin, Ticket, Truck } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type EventItem = {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  category?: string;
  imageUrl?: string;
  status?: "upcoming" | "live" | "ended";
  ticketTypes?: { name: string; price: number; quantity: number }[];
  transportationAvailable?: boolean;
  transportationDetails?: string;
};

function formatDate(value?: string) {
  if (!value) return "Not set";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
}

export default function EventDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`, { cache: "no-store" });
        const data = await res.json();

        setEvent(data.event || null);

        if (data.event?.ticketTypes?.length) {
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

  const handleCheckout = async () => {
    if (!event || !selectedTier) return;

    if (event.status === "ended") {
      alert("This event has ended.");
      return;
    }

    const me = await fetch("/api/auth/me");
    if (!me.ok) {
      router.push(`/login?redirect=/checkout/${event._id}?tier=${selectedTier.name}&quantity=${quantity}`);
      return;
    }

    router.push(`/checkout/${event._id}?tier=${selectedTier.name}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night text-white/50">
        Loading event...
      </div>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-night">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center text-white/50">
          Event not found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-night pb-24">
      <Navbar />

      <section className="relative min-h-[560px] overflow-hidden">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/20" />

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-end px-5 pb-16 pt-32">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-neon-purple/30 bg-neon-purple/15 px-4 py-2 text-xs font-black uppercase tracking-widest text-neon-purple">
                {event.category || "Event"}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/60">
                {event.status}
              </span>
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-tight sm:text-7xl lg:text-8xl">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-8 px-5 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-8">
          <Card animate={false}>
            <div className="mb-6 flex items-center gap-3">
              <Activity className="text-neon-purple" />
              <h2 className="text-2xl font-black">Event Information</h2>
            </div>
            <p className="whitespace-pre-line text-lg leading-8 text-white/60">
              {event.description || "No description provided."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Calendar className="mb-3 text-neon-purple" />
                <p className="text-xs font-black uppercase tracking-widest text-white/35">Starts</p>
                <p className="mt-1 font-bold text-white">{formatDate(event.startDate)}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Calendar className="mb-3 text-neon-cyan" />
                <p className="text-xs font-black uppercase tracking-widest text-white/35">Ends</p>
                <p className="mt-1 font-bold text-white">{formatDate(event.endDate)}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-2">
                <MapPin className="mb-3 text-neon-pink" />
                <p className="text-xs font-black uppercase tracking-widest text-white/35">Location</p>
                <p className="mt-1 font-bold text-white">{event.location || "No location"}</p>
              </div>
            </div>
          </Card>

          {event.transportationAvailable && (
            <Card animate={false}>
              <div className="mb-4 flex items-center gap-3">
                <Truck className="text-emerald-300" />
                <h2 className="text-2xl font-black">Transportation Available</h2>
              </div>
              <p className="text-white/55">
                {event.transportationDetails || "Transportation is available for this event."}
              </p>
            </Card>
          )}
        </div>

        <aside className="space-y-5">
          <Card animate={false} className="sticky top-28">
            <div className="mb-6 flex items-center gap-3">
              <Ticket className="text-neon-cyan" />
              <h2 className="text-2xl font-black">Choose Ticket</h2>
            </div>

            <div className="space-y-3">
              {event.ticketTypes?.map((tier) => (
                <button
                  key={tier.name}
                  onClick={() => setSelectedTier(tier)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedTier?.name === tier.name
                      ? "border-neon-purple bg-neon-purple/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black">{tier.name}</span>
                    <span className="font-black">₦{Number(tier.price || 0).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/35">{tier.quantity} available</p>
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <button
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="text-xl font-black">{quantity}</span>
              <button
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <Button
              className="mt-6"
              variant={event.status === "ended" ? "secondary" : "neon"}
              size="lg"
              fullWidth
              disabled={event.status === "ended"}
              onClick={handleCheckout}
            >
              {event.status === "ended" ? "Event Ended" : "Proceed to Checkout"}
            </Button>
          </Card>
        </aside>
      </section>
    </main>
  );
}
