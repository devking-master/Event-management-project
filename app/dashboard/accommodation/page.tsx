"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Bed, 
  Users as UsersIcon, 
  Calendar,
  MoreVertical,
  ChevronRight,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function AccommodationDashboard() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/accommodation")
      .then(res => res.json())
      .then(data => {
        setNodes(data.accommodation || []);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-glow-emerald";
      case "Pending": return "text-amber-400 border-amber-500/20 bg-amber-500/10 shadow-glow-amber";
      case "Cancelled": return "text-rose-400 border-rose-500/20 bg-rose-500/10 shadow-glow-rose";
      default: return "text-white/40 border-white/10 bg-white/5";
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tight">Accommodation</h1>
          <p className="mt-2 text-lg text-white/40">Manage guest lodging and reservations.</p>
        </div>
        <Link href="/dashboard/accommodation/create">
          <Button variant="neon" size="lg" icon={Plus}>Add Accommodation</Button>
        </Link>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            className="w-full rounded-[1.8rem] border border-white/5 bg-white/5 p-5 pl-14 outline-none focus:border-neon-purple/50 focus:bg-white/[0.08] transition-all placeholder:text-white/20 font-medium"
            placeholder="Search guests, hotels or events..."
          />
        </div>
        <Button variant="secondary" icon={Filter}>Filter</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/5 border border-white/10" />
            ))
          ) : nodes.length === 0 ? (
            <div className="col-span-full py-32 text-center">
              <Card className="max-w-md mx-auto py-16" animate={false}>
                <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white/5 text-white/20 mx-auto">
                  <Building2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-white/40">No Accommodation Found</h3>
                <p className="mt-2 text-sm text-white/20">You haven't added any accommodation yet. Create one to get started.</p>
                <Link href="/dashboard/accommodation/create" className="mt-8">
                  <Button variant="outline">Add Accommodation</Button>
                </Link>
              </Card>
            </div>
          ) : (
            nodes.map((node: any, idx: number) => (
              <motion.div
                key={node._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="flex flex-col h-full p-0 overflow-hidden group hover:border-neon-purple/30 transition-all duration-500" animate={false}>
                  <div className="p-8 space-y-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-white/20 group-hover:bg-neon-purple/10 group-hover:text-neon-purple transition-colors">
                        <Building2 size={28} />
                      </div>
                      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${getStatusColor(node.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full bg-current`} />
                        {node.status}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-black group-hover:text-neon-purple transition truncate">{node.hotelName}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-white/30 mt-2">
                        <MapPin size={14} className="text-neon-cyan" />
                        {node.address || "Location Unspecified"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Guest Occupancy</p>
                        <div className="flex items-center gap-2">
                          <UsersIcon size={14} className="text-neon-purple" />
                          <span className="text-sm font-black">{node.guestName || "Unassigned"}</span>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Room Type</p>
                        <div className="flex items-center gap-2">
                          <Bed size={14} className="text-neon-cyan" />
                          <span className="text-sm font-black">{node.roomType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-white/30">
                      <Calendar size={14} className="text-emerald-400" />
                      {new Date(node.checkIn).toLocaleDateString()} — {new Date(node.checkOut).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="border-t border-white/5 bg-white/[0.01] p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/accommodation/${node._id}/edit`}>
                        <button className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition">
                          <MoreVertical size={16} />
                        </button>
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
                      <CheckCircle2 size={12} className={node.status === "Confirmed" ? "text-emerald-400" : ""} />
                      {node.eventId?.title?.split(' ')[0] || "Global"}
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
