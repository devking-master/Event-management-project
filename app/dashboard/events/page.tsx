"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  MoreVertical, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  MapPin,
  TrendingUp,
  Activity,
  Clock,
  ChevronRight,
  Truck,
  Building2
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tight">Active <span className="text-neon-cyan">Events</span></h1>
          <p className="mt-2 text-lg text-white/40">Manage your events and monitor live ticket sales.</p>
        </div>
        <Link href="/dashboard/events/create">
          <Button variant="neon" size="lg" icon={Plus}>Create New Event</Button>
        </Link>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            className="w-full rounded-[1.8rem] border border-white/5 bg-white/5 p-5 pl-14 outline-none focus:border-neon-cyan/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-medium"
            placeholder="Search by event name or category..."
          />
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" icon={Filter}>Filters</Button>
          <div className="hidden h-14 w-[1px] bg-white/5 lg:block" />
          <div className="flex items-center gap-3 px-4">
            <Activity size={18} className="text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Network Stable</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[550px] animate-pulse rounded-[2.5rem] bg-white/5 border border-white/10" />
            ))
          ) : events.length === 0 ? (
            <div className="col-span-full py-40 text-center">
              <div className="mx-auto flex flex-col items-center max-w-sm">
                <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white/5 text-white/20">
                  <CalendarIcon size={40} />
                </div>
                <h3 className="text-2xl font-black text-white/40">No Events Found</h3>
                <p className="mt-2 text-sm text-white/20">You haven't created any events yet. Create a new event to begin.</p>
                <Link href="/dashboard/events/create" className="mt-8">
                  <Button variant="outline">Create Event</Button>
                </Link>
              </div>
            </div>
          ) : (
            events.map((event: any, idx: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={event._id}
                className="flex flex-col"
              >
                <Card className="flex flex-col h-full p-0 overflow-hidden border-white/5 hover:border-neon-cyan/30 transition-all duration-500" animate={false}>
                  {/* Image Section */}
                  <div className="relative h-56 w-full overflow-hidden shrink-0">
                    {event.imageUrl || event.image ? (
                        <Image 
                          src={event.imageUrl || event.image} 
                          alt={event.title} 
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-110" 
                        />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center font-black text-white/10">
                        <CalendarIcon size={48} className="opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-black/60 backdrop-blur-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-glow-emerald" />
                      Live
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="rounded-xl bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60 border border-white/10">
                        {event.category}
                      </span>
                      <div className="flex gap-2">
                        {event.transportationAvailable && (
                          <div className="h-8 w-8 rounded-lg bg-neon-purple/20 backdrop-blur-md border border-neon-purple/30 flex items-center justify-center text-neon-purple" title="Transportation Available">
                            <Truck size={14} />
                          </div>
                        )}
                        {event.accommodationAvailable && (
                          <div className="h-8 w-8 rounded-lg bg-neon-cyan/20 backdrop-blur-md border border-neon-cyan/30 flex items-center justify-center text-neon-cyan" title="Accommodation Available">
                            <Building2 size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col flex-1 p-8 space-y-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black group-hover:text-neon-cyan transition truncate">{event.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                          <CalendarIcon size={12} className="text-neon-purple" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                          <Clock size={12} className="text-neon-pink" />
                          {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                          <MapPin size={12} className="text-neon-cyan" />
                          {event.location || "Remote Location"}
                        </div>
                      </div>
                    </div>

                    {/* Stats HUD */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 transition-colors group-hover:bg-white/[0.04]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Tickets</p>
                        <div className="flex items-end justify-between">
                          <p className="text-lg font-black">{event.soldTickets || 0}</p>
                          <p className="text-[10px] font-bold text-white/40 mb-1">/ {event.totalTickets}</p>
                        </div>
                        <div className="mt-2 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, Math.round(((event.soldTickets || 0) / (event.totalTickets || 1)) * 100))}%` }}
                            className="h-full bg-neon-cyan shadow-glow-cyan" 
                          />
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 transition-colors group-hover:bg-white/[0.04]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Price Point</p>
                        <p className="text-lg font-black text-emerald-400">
                          ₦{event.ticketTypes?.[0]?.price?.toLocaleString() || 0}
                        </p>
                        <p className="text-[10px] font-bold text-white/40 mt-1 uppercase">Starting From</p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/events/${event._id}/edit`}>
                          <button className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white border border-white/5" title="Edit Event">
                            <Edit2 size={16} />
                          </button>
                        </Link>
                        <button className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/40 transition hover:bg-rose-500/10 hover:text-rose-500 border border-white/5" title="Delete Event">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <Link href={`/events/${event._id}`}>
                        <Button variant="ghost" size="sm" className="group">
                          View Event <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
