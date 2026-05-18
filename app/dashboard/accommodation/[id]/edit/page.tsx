"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Upload,
  Calendar,
  Bed,
  UsersIcon,
  Rocket,
  ChevronLeft,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function EditAccommodation() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  
  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "Standard",
    capacity: 1,
    pricePerNight: 0,
    amenities: "",
    guestName: "",
    checkIn: "",
    checkOut: "",
    eventId: "",
    status: "Pending",
  });

  useEffect(() => {
    Promise.all([fetchAccommodation(), fetchEvents()]);
  }, [id]);

  const fetchAccommodation = async () => {
    try {
      const res = await fetch(`/api/accommodation/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const { accommodation } = await res.json();
      
      setForm({
        roomNumber: accommodation.roomNumber || "",
        roomType: accommodation.roomType || "Standard",
        capacity: accommodation.capacity || 1,
        pricePerNight: accommodation.pricePerNight || 0,
        amenities: accommodation.amenities || "",
        guestName: accommodation.guestName || "",
        checkIn: accommodation.checkIn || "",
        checkOut: accommodation.checkOut || "",
        eventId: accommodation.eventId?._id || "",
        status: accommodation.status || "Pending",
      });
    } catch (err) {
      setError("Failed to load accommodation");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const { events } = await res.json();
        setEvents(events);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/accommodation/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/dashboard/accommodation");
      } else {
        setError("Failed to update accommodation");
      }
    } catch (error) {
      console.error(error);
      setError("Error updating accommodation");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-neon-purple animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading accommodation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition mb-6 group">
          <ChevronLeft size={16} className="transition group-hover:-translate-x-1" /> Back
        </button>
        <h1 className="text-5xl font-black tracking-tight">Edit <span className="text-neon-purple">Accommodation</span></h1>
        <p className="mt-2 text-lg text-white/40">Update accommodation details.</p>
      </header>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <Card className="space-y-8" animate={false}>
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-pink/10 text-neon-pink">
                <Bed size={24} />
              </div>
              <h2 className="text-2xl font-black">Room Details</h2>
            </div>

            <div className="space-y-8 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input 
                  label="Room Number"
                  placeholder="e.g. 101"
                  value={form.roomNumber}
                  onChange={e => setForm({...form, roomNumber: e.target.value})}
                />
                <Input 
                  label="Capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={e => setForm({...form, capacity: parseInt(e.target.value)})}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Select 
                  label="Room Type"
                  icon={Bed}
                  value={form.roomType}
                  onChange={e => setForm({...form, roomType: e.target.value})}
                  options={[
                    { label: "Standard Room", value: "Standard" },
                    { label: "Deluxe Room", value: "Deluxe" },
                    { label: "Executive Suite", value: "Suite" },
                    { label: "Penthouse", value: "Penthouse" }
                  ]}
                />
                <Input 
                  label="Price Per Night"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricePerNight}
                  onChange={e => setForm({...form, pricePerNight: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Amenities
                </label>
                <textarea 
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none focus:border-neon-purple/50 focus:bg-white/[0.08] transition-all resize-none"
                  placeholder="e.g. WiFi, AC, TV, Mini bar"
                  value={form.amenities}
                  onChange={e => setForm({...form, amenities: e.target.value})}
                />
              </div>

              <Select 
                label="Event Association"
                value={form.eventId}
                onChange={e => setForm({...form, eventId: e.target.value})}
                options={[
                  { label: "Select Event", value: "" },
                  ...events.map((e: any) => ({ label: e.title, value: e._id }))
                ]}
              />
            </div>
          </Card>

          <Card className="space-y-8" animate={false}>
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-cyan/10 text-neon-cyan">
                <UsersIcon size={24} />
              </div>
              <h2 className="text-2xl font-black">Guest Assignment</h2>
            </div>

            <div className="space-y-8 pt-4">
              <Input 
                label="Guest Name"
                placeholder="Enter guest full name"
                icon={UsersIcon}
                value={form.guestName}
                onChange={e => setForm({...form, guestName: e.target.value})}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input 
                  label="Check-in Date"
                  type="date"
                  icon={Calendar}
                  value={form.checkIn}
                  onChange={e => setForm({...form, checkIn: e.target.value})}
                />
                <Input 
                  label="Check-out Date"
                  type="date"
                  icon={Calendar}
                  value={form.checkOut}
                  onChange={e => setForm({...form, checkOut: e.target.value})}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="bg-gradient-to-br from-neon-purple/10 to-transparent border-neon-purple/20" animate={false}>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-neon-purple/10 text-neon-purple">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-black">Status</h3>
              </div>

              <div className="space-y-4">
                {["Pending", "Confirmed", "Cancelled"].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setForm({...form, status})}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      form.status === status 
                        ? "bg-white/10 border-neon-purple text-white shadow-glass" 
                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/[0.08]"
                    }`}
                  >
                    <span className="text-sm font-bold">{status}</span>
                    <div className={`h-2 w-2 rounded-full ${
                      form.status === status ? "bg-neon-purple shadow-glow" : "bg-white/10"
                    }`} />
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5">
                <Button 
                  type="submit" 
                  variant="neon" 
                  size="xl" 
                  className="w-full"
                  loading={loading}
                  icon={Rocket}
                >
                  Update Accommodation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
