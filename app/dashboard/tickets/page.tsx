"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket as TicketIcon, Calendar, MapPin, Download, Share2, Search, Filter, Activity, QrCode } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
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

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-8 sm:space-y-10 lg:space-y-12 pb-16 sm:pb-20">
      <header className="flex flex-col gap-5 sm:gap-4 sm:p-5 lg:p-6 lg:gap-5 sm:p-4 sm:p-5 lg:p-6 lg:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl sm:text-2xl sm:text-2xl sm:text-3xl lg:text-4xl lg:text-5xl font-black tracking-tight break-words">My <span className="text-neon-purple">Tickets</span></h1>
          <p className="mt-2 text-lg text-white/40">Your tickets for upcoming events.</p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:border-l sm:pl-6">
          <Activity size={24} className="text-neon-purple animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Ticket Status</span>
            <span className="text-xs font-black">All Verified</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            className="w-full rounded-2xl lg:rounded-[1.8rem] border border-white/5 bg-white/5 p-4 sm:p-5 pl-12 sm:pl-14 outline-none focus:border-neon-purple/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-medium"
            placeholder="Search by event or ticket code..."
          />
        </div>
        <Button variant="secondary" icon={Filter}>Filter</Button>
      </div>

      <div className="grid gap-4 sm:p-5 lg:p-6 sm:gap-5 sm:gap-4 sm:p-5 lg:p-6 lg:gap-5 sm:p-4 sm:p-5 lg:p-6 lg:p-8 lg:gap-5 sm:p-7 lg:p-10 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="min-h-[300px] sm:min-h-[350px] w-full animate-pulse rounded-3xl lg:rounded-[3rem] bg-white/5 border border-white/10" />
            ))
          ) : tickets.length === 0 ? (
            <div className="col-span-full py-20 sm:py-28 lg:py-40 text-center">
              <TicketIcon size={80} className="mx-auto text-white/10 mb-8" strokeWidth={1} />
              <h3 className="text-2xl sm:text-3xl font-black text-white break-words/40">No Tickets Found</h3>
              <p className="mt-4 text-white/20 max-w-md mx-auto">You haven't purchased any tickets yet. Explore events to discover upcoming ones.</p>
              <Button variant="ghost" className="mt-10" onClick={() => window.location.href = "/events"}>Explore Events</Button>
            </div>
          ) : (
            tickets.map((ticket: any, idx: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={ticket._id}
              >
                <Card className="p-0 overflow-hidden group border-white/10 hover:border-neon-purple/50 transition-all duration-500" animate={false}>
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden">
                    <img 
                      src={ticket.eventId?.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
                      alt="" 
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                    <div className="absolute top-4 sm:p-5 lg:p-6 right-6 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      Verified Ticket
                    </div>
                  </div>

                  <div className="p-5 sm:p-4 sm:p-5 lg:p-6 lg:p-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-black group-hover:text-neon-purple transition">{ticket.eventId?.title}</h3>
                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                            <Calendar size={12} className="text-neon-purple" />
                            {new Date(ticket.eventId?.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
                            <MapPin size={12} className="text-neon-cyan" />
                            {ticket.eventId?.location}
                          </div>
                        </div>
                      </div>
                      <div className="h-11 w-11 sm:h-12 sm:w-12 sm:h-14 sm:w-14 sm:h-16 sm:w-16 bg-white rounded-2xl p-2 flex items-center justify-center">
                        <QrCode size={40} className="text-ink" />
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Ticket Tier</p>
                        <p className="text-xl font-black text-neon-cyan">{ticket.type}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Ticket Code</p>
                        <p className="text-lg font-mono font-bold text-white/60">{ticket.code}</p>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                      <Button 
                        variant="secondary" 
                        icon={Download} 
                        className="flex-1" 
                        size="sm"
                        onClick={() => window.open(`/ticket/${ticket._id}`, '_blank')}
                      >
                        Download Pass
                      </Button>
                      <Button variant="ghost" icon={Share2} className="flex-1" size="sm">Transfer Ticket</Button>
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
