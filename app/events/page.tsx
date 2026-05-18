"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Calendar as CalendarIcon, MapPin, Search, Tag, Zap } from "lucide-react";
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
  ticketTypes?: { name: string; price: number; quantity: number }[];
  status?: string;
};

function formatDate(value?: string) {
  if (!value) return "Not set";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ExploreEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchEvents = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (category) params.append("category", category);

      // Public endpoint automatically returns only active/not-ended events.
      const res = await fetch(`/api/events?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();

      setEvents(data.events || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category]);

  return (
    <main className="min-h-screen bg-night pb-24">
      <Navbar />

      <section className="relative overflow-hidden px-5 pb-16 pt-32 sm:pt-40">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:60px_60px] opacity-10" />
        <div className="absolute left-1/2 top-0 h-[450px] w-full max-w-6xl -translate-x-1/2 rounded-full bg-neon-purple/10 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 backdrop-blur-xl">
            <Zap size={14} className="text-neon-cyan" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-white/50">
              Discover live and upcoming events
            </span>
          </div>

          <h1 className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
            Explore <span className="text-neon-purple text-glow">Events</span>
          </h1>

          <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-2xl">
            <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_auto]">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/25" size={20} />
                <input
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-14 pr-4 text-white outline-none transition focus:border-neon-purple/50"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchEvents()}
                />
              </div>

              <div className="relative">
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-white/25" size={20} />
                <select
                  className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-[#05050b] pl-14 pr-4 text-white outline-none transition focus:border-neon-cyan/50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Concert">Concert</option>
                  <option value="Tech">Tech</option>
                  <option value="Party">Party</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>

              <Button onClick={fetchEvents} variant="neon" size="lg">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <Card className="py-20 text-center" animate={false}>
            <CalendarIcon className="mx-auto mb-5 text-white/20" size={56} />
            <h3 className="text-2xl font-black text-white/70">No available events</h3>
            <p className="mt-2 text-white/40">
              Ended events are automatically removed from this public explore page.
            </p>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const lowestPrice = event.ticketTypes?.length
                ? Math.min(...event.ticketTypes.map((ticket) => Number(ticket.price) || 0))
                : 0;

              return (
                <Link key={event._id} href={`/events/${event._id}`}>
                  <Card className="h-full overflow-hidden p-0 transition hover:border-neon-purple/40" animate={false}>
                    <div className="relative h-56 overflow-hidden">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 text-white/20">
                          <CalendarIcon size={52} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
                    </div>

                    <div className="space-y-4 p-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-neon-cyan">
                          {event.category || "Event"}
                        </p>
                        <h2 className="mt-2 line-clamp-2 text-2xl font-black leading-tight">
                          {event.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
                          {event.description || "No description provided."}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm text-white/55">
                        <p className="flex items-center gap-2">
                          <CalendarIcon size={16} className="text-neon-purple" />
                          {formatDate(event.startDate)}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin size={16} className="text-neon-cyan" />
                          {event.location || "No location"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div>
                          <p className="text-xs text-white/35">From</p>
                          <p className="text-xl font-black">₦{lowestPrice.toLocaleString()}</p>
                        </div>
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
