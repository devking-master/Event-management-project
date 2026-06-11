"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bus,
  BedDouble,
  Calendar,
  Clock,
  Download,
  Filter,
  MapPin,
  QrCode,
  Search,
  Share2,
  Ticket as TicketIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function MyTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets/my");
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const { activeTickets, expiredTickets } = useMemo(() => {
    const now = new Date();
    const active: any[] = [];
    const expired: any[] = [];

    for (const ticket of tickets) {
      const event = ticket.eventId;
      const end = event?.endDate ? new Date(event.endDate) : null;

      if (end && end < now) {
        expired.push(ticket);
      } else {
        active.push(ticket);
      }
    }

    return { activeTickets: active, expiredTickets: expired };
  }, [tickets]);

  return (
    <div className="space-y-8 pb-16 sm:pb-20">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            My <span className="text-neon-purple">Tickets</span>
          </h1>
          <p className="mt-2 text-lg text-white/40">
            Your purchased tickets and transportation and accommodation details.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <Activity size={24} className="animate-pulse text-neon-purple" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              Ticket Status
            </span>
            <span className="text-xs font-black">{activeTickets.length} Active</span>
          </div>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="min-h-[350px] w-full animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))
          ) : tickets.length === 0 ? (
            <div className="col-span-full py-28 text-center">
              <TicketIcon size={80} className="mx-auto mb-8 text-white/10" strokeWidth={1} />
              <h3 className="text-3xl font-black text-white/40">No Tickets Found</h3>
              <p className="mx-auto mt-4 max-w-md text-white/20">
                You have not purchased any tickets yet. Explore events to discover upcoming ones.
              </p>
              <Button
                variant="ghost"
                className="mt-10"
                onClick={() => (window.location.href = "/events")}
              >
                Explore Events
              </Button>
            </div>
          ) : (
            /* Active tickets section */
            (activeTickets.length > 0 ? activeTickets : []).map((ticket: any, idx: number) => {
              const event = ticket.eventId;
              const hasTransport = Boolean(ticket.transportation?.included);
              const hasAccommodation = Boolean(ticket.accommodation?.included);

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  key={ticket._id}
                >
                  <Card
                    className="group overflow-hidden border-white/10 p-0 transition-all duration-500 hover:border-neon-purple/50"
                    animate={false}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={
                          event?.imageUrl ||
                          event?.image ||
                          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                        }
                        alt={event?.title || "Event"}
                        className="h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-110 group-hover:opacity-40"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

                      <div className="absolute right-6 top-4 rounded-2xl border border-white/10 bg-black/60 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 backdrop-blur-xl">
                        Active Ticket
                      </div>
                    </div>

                    <div className="space-y-6 p-5 sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-black transition group-hover:text-neon-purple">
                            {event?.title}
                          </h3>

                          <div className="mt-3 flex flex-wrap gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                              <Calendar size={12} className="text-neon-purple" />
                              {event?.startDate
                                ? new Date(event.startDate).toLocaleDateString()
                                : "No date"}
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                              <MapPin size={12} className="text-neon-cyan" />
                              {event?.location || "No location"}
                            </div>
                          </div>
                        </div>

                        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white p-2">
                          <QrCode size={40} className="text-ink" />
                        </div>
                      </div>

                      {hasAccommodation && (
                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <BedDouble size={18} className="text-amber-300" />
                            <p className="text-sm font-black text-amber-300">
                              Accommodation Included
                            </p>
                          </div>

                          <div className="space-y-2 text-sm text-white/55">
                            <p className="flex gap-2">
                              <BedDouble size={15} className="shrink-0 text-amber-300" />
                              Hotel: {ticket.accommodation?.name || "Not specified"}
                            </p>

                            <p className="flex gap-2">
                              <MapPin size={15} className="shrink-0 text-neon-cyan" />
                              Address: {ticket.accommodation?.address || "Not specified"}
                            </p>

                            <p className="flex gap-2">
                              <Clock size={15} className="shrink-0 text-neon-purple" />
                              Check-in: {" "}
                              {ticket.accommodation?.checkIn
                                ? new Date(ticket.accommodation.checkIn).toLocaleString()
                                : "Not specified"}
                            </p>
                          </div>
                        </div>
                      )}

                      {hasTransport && (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <Bus size={18} className="text-emerald-300" />
                            <p className="text-sm font-black text-emerald-300">
                              Transportation Included
                            </p>
                          </div>

                          <div className="space-y-2 text-sm text-white/55">
                            <p className="flex gap-2">
                              <MapPin size={15} className="shrink-0 text-neon-cyan" />
                              Pickup: {ticket.transportation?.pickup || "Not specified"}
                            </p>

                            <p className="flex gap-2">
                              <Clock size={15} className="shrink-0 text-neon-purple" />
                              Departure: {" "}
                              {ticket.transportation?.departureTime
                                ? new Date(ticket.transportation.departureTime).toLocaleString()
                                : "Not specified"}
                            </p>

                            <p className="flex gap-2">
                              <Bus size={15} className="shrink-0 text-emerald-300" />
                              Vehicle: {ticket.transportation?.vehicleType || "Bus"}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/20">
                            Ticket Tier
                          </p>
                          <p className="text-xl font-black text-neon-cyan">{ticket.type}</p>
                        </div>

                        <div className="text-right">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/20">
                            Ticket Code
                          </p>
                          <p className="text-lg font-mono font-bold text-white/60">{ticket.code}</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          variant="secondary"
                          icon={Download}
                          className="flex-1"
                          size="sm"
                          onClick={() => window.open(`/ticket/${ticket._id}`, "_blank")}
                        >
                          Download Pass
                        </Button>

                        <Button variant="ghost" icon={Share2} className="flex-1" size="sm">
                          Transfer
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Ticket History Section */}
      {loading ? null : (
        <section className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight">Ticket History</h2>

          {expiredTickets.length === 0 ? (
            <p className="text-sm text-white/30">No expired tickets yet.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <AnimatePresence>
                {expiredTickets.map((ticket: any, idx: number) => {
                  const event = ticket.eventId;
                  return (
                    <motion.div
                      key={ticket._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <Card className="overflow-hidden border-white/10 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-black">{event?.title}</h3>
                            <p className="mt-1 text-sm text-white/40">
                              Ended: {event?.endDate ? new Date(event.endDate).toLocaleString() : "-"}
                            </p>
                            <p className="mt-3 text-sm font-mono text-white/60">{ticket.code}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="rounded-2xl border border-red-500/20 bg-red-600/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-300">
                              Expired
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
