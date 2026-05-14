"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Truck, 
  Package, 
  Users as UsersIcon, 
  ShieldCheck, 
  Clock,
  MoreVertical,
  ChevronRight,
  MapPin,
  AlertCircle
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LogisticsDashboard() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logistics")
      .then(res => res.json())
      .then(data => {
        setMissions(data.logistics || []);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-glow-emerald";
      case "In Progress": return "text-amber-400 border-amber-500/20 bg-amber-500/10 shadow-glow-amber";
      case "Pending": return "text-white/40 border-white/10 bg-white/5";
      case "Delayed": return "text-rose-400 border-rose-500/20 bg-rose-500/10 shadow-glow-rose";
      default: return "text-white/40 border-white/10 bg-white/5";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Transportation": return Truck;
      case "Equipment": return Package;
      case "Staff/Volunteers": return UsersIcon;
      case "Security": return ShieldCheck;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tight">Logistics</h1>
          <p className="mt-2 text-lg text-white/40">Manage logistics and infrastructure for your events.</p>
        </div>
        <Link href="/dashboard/logistics/create">
          <Button variant="neon" size="lg" icon={Plus}>Add Logistics</Button>
        </Link>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            className="w-full rounded-[1.8rem] border border-white/5 bg-white/5 p-5 pl-14 outline-none focus:border-neon-cyan/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-medium"
            placeholder="Search missions, items or locations..."
          />
        </div>
        <Button variant="secondary" icon={Filter}>Filter</Button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-32 animate-pulse rounded-3xl bg-white/5 border border-white/10" />
            ))
          ) : missions.length === 0 ? (
            <Card className="py-32 text-center" animate={false}>
              <div className="mx-auto flex flex-col items-center max-w-sm">
                <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white/5 text-white/20">
                  <Truck size={40} />
                </div>
                <h3 className="text-2xl font-black text-white/40">No Logistics Found</h3>
                <p className="mt-2 text-sm text-white/20">You haven't added any logistics yet. Add one to get started.</p>
                <Link href="/dashboard/logistics/create" className="mt-8">
                  <Button variant="outline">Add Logistics</Button>
                </Link>
              </div>
            </Card>
          ) : (
            missions.map((mission: any, idx: number) => {
              const Icon = getCategoryIcon(mission.category);
              return (
                <motion.div
                  key={mission._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-0 overflow-hidden group hover:border-white/10 transition-all duration-300" animate={false}>
                    <div className="flex flex-col lg:flex-row">
                      <div className="flex flex-1 items-center gap-6 p-8">
                        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-white/20 group-hover:bg-neon-cyan/10 group-hover:text-neon-cyan transition-colors">
                          <Icon size={28} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black">{mission.title}</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-2 py-0.5 rounded border border-white/5">
                              {mission.category}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-white/30">
                              <AlertCircle size={14} className="text-neon-purple" />
                              Event: {mission.eventId?.title || "Standalone"}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-white/30">
                              <MapPin size={14} />
                              {mission.location || "Location Unspecified"}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 border-t border-white/5 bg-white/[0.01] px-8 py-6 lg:border-l lg:border-t-0">
                        <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${getStatusColor(mission.status)}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${mission.status === "Delayed" ? "animate-pulse bg-rose-400" : "bg-current"}`} />
                          {mission.status}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/dashboard/logistics/${mission._id}/edit`}>
                            <button className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition">
                              <MoreVertical size={16} />
                            </button>
                          </Link>
                          <Link href={`/dashboard/logistics/${mission._id}`}>
                            <button className="grid h-10 w-10 place-items-center rounded-xl bg-neon-cyan text-white shadow-glow-cyan hover:scale-105 transition">
                              <ChevronRight size={16} />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
