"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Search, Filter, Calendar as CalendarIcon, MapPin, Tag, ArrowRight, Activity, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function ExploreEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      
      const res = await fetch(`/api/events?${params.toString()}`);
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-night pb-32">
      <Navbar />
      
      {/* Immersive Header */}
      <section className="relative px-5 pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:60px_60px] opacity-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-6xl bg-neon-purple/5 blur-[120px] rounded-full" />
        
        <div className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-6 py-2 backdrop-blur-xl"
          >
            <Zap size={14} className="text-neon-cyan animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Discover your next experience</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black md:text-8xl lg:text-9xl tracking-tighter"
          >
            Explore <span className="text-neon-purple text-glow">Events</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 mx-auto max-w-4xl"
          >
            <div className="flex flex-col gap-4 p-4 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl lg:flex-row shadow-2xl">
              <div className="flex-[2] relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-purple transition-colors" size={22} />
                <input 
                  className="w-full h-16 rounded-3xl border border-white/5 bg-white/5 pl-16 pr-6 outline-none focus:border-neon-purple/30 transition-all text-lg font-medium"
                  placeholder="Search for events..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchEvents()}
                />
              </div>
              <div className="flex-1 relative group">
                <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-cyan transition-colors" size={22} />
                <select 
                  className="w-full h-16 rounded-3xl border border-white/5 bg-white/5 pl-16 pr-10 outline-none focus:border-neon-cyan/30 transition-all appearance-none text-white/60 font-medium cursor-pointer"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Concert">Concert</option>
                  <option value="Tech">Tech</option>
                  <option value="Party">Party</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
                <Button 
                  onClick={fetchEvents}
                  variant="neon" 
                  size="lg" 
                  className="lg:h-16 px-12 text-lg shadow-glow"
                >
                  Search
                </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="px-5">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
              >
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[500px] w-full animate-pulse rounded-[3rem] bg-white/[0.03] border border-white/5" />
                ))}
              </motion.div>
            ) : events.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-32 text-center"
              >
                <Activity size={80} className="mx-auto text-white/10 mb-8" strokeWidth={1} />
                <h3 className="text-3xl font-black text-white/40">No events found</h3>
                <p className="mt-4 text-white/20 max-w-md mx-auto">Try adjusting your search or category filters.</p>
                <Button variant="ghost" className="mt-10" onClick={() => {setSearch(""); setCategory(""); fetchEvents();}}>Reset Filters</Button>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
              >
                {events.map((event: any) => (
                  <motion.div variants={item} key={event._id}>
                    <Link 
                      href={`/events/${event._id}`} 
                      className="group relative block h-[550px] overflow-hidden rounded-[3rem] border border-white/10 bg-ink transition-all hover:border-neon-purple/50 hover:shadow-glow"
                    >
                      {/* Image Layer */}
                      <div className="absolute inset-0">
                        <img 
                          src={event.imageUrl || event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
                          alt={event.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:blur-[2px] opacity-60 group-hover:opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent" />
                      </div>
                      
                      {/* Badge */}
                      <div className="absolute top-8 right-8 z-20 rounded-2xl bg-black/60 backdrop-blur-xl px-5 py-3 border border-white/10 shadow-2xl">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Starting From</p>
                        <p className="text-2xl font-black text-neon-cyan">₦{event.ticketTypes[0]?.price?.toLocaleString() || 0}</p>
                      </div>

                      {/* Content Layer */}
                      <div className="absolute inset-0 z-10 flex flex-col justify-end p-10">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-neon-purple mb-4">
                          <span>{event.category}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                          <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                        </div>
                        
                        <h3 className="text-4xl font-black leading-tight text-white group-hover:text-neon-purple transition-colors mb-6">{event.title}</h3>
                        
                        <div className="flex items-center gap-6 border-t border-white/10 pt-8 mt-4 transition-transform group-hover:translate-y-[-10px]">
                          <div className="flex items-center gap-2 text-sm font-medium text-white/50">
                            <MapPin size={16} className="text-neon-cyan" /> {event.location}
                          </div>
                          <div className="flex-1" />
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white group-hover:bg-neon-purple group-hover:border-neon-purple transition-all duration-500">
                            <ArrowRight size={20} />
                          </div>
                        </div>
                      </div>

                      {/* Hover Overlay HUD */}
                      <div className="absolute inset-0 pointer-events-none border-[12px] border-transparent transition-all duration-500 group-hover:border-white/5" />
                      <div className="absolute top-6 left-6 h-10 w-10 border-t-2 border-l-2 border-white/0 transition-all duration-500 group-hover:border-neon-purple/40" />
                      <div className="absolute bottom-6 right-6 h-10 w-10 border-b-2 border-r-2 border-white/0 transition-all duration-500 group-hover:border-neon-purple/40" />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
