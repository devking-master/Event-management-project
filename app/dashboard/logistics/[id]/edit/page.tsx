"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Truck,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Rocket,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function EditLogistics() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  
  const [form, setForm] = useState({
    transportationType: "Bus",
    departureLocation: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    capacity: 1,
    currentPassengers: 0,
    costPerPerson: 0,
    isFree: false,
    eventId: "",
    status: "Pending",
    notes: "",
  });

  useEffect(() => {
    Promise.all([fetchLogistics(), fetchEvents()]);
  }, [id]);

  const fetchLogistics = async () => {
    try {
      const res = await fetch(`/api/logistics/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const { logistics } = await res.json();
      
      setForm({
        transportationType: logistics.transportationType || "Bus",
        departureLocation: logistics.departureLocation || "",
        destination: logistics.destination || "",
        departureTime: logistics.departureTime || "",
        arrivalTime: logistics.arrivalTime || "",
        capacity: logistics.capacity || 1,
        currentPassengers: logistics.currentPassengers || 0,
        costPerPerson: logistics.costPerPerson || 0,
        isFree: logistics.isFree || false,
        eventId: logistics.eventId?._id || "",
        status: logistics.status || "Pending",
        notes: logistics.notes || "",
      });
    } catch (err) {
      setError("Failed to load logistics");
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
      const res = await fetch(`/api/logistics/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/dashboard/logistics");
      } else {
        setError("Failed to update logistics");
      }
    } catch (error) {
      console.error(error);
      setError("Error updating logistics");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-neon-purple animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading logistics...</p>
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
        <h1 className="text-5xl font-black tracking-tight">Edit <span className="text-neon-purple">Logistics</span></h1>
        <p className="mt-2 text-lg text-white/40">Update transportation and logistics details.</p>
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
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-cyan/10 text-neon-cyan">
                <Truck size={24} />
              </div>
              <h2 className="text-2xl font-black">Transportation Details</h2>
            </div>

            <div className="space-y-8 pt-4">
              <Select 
                label="Transportation Type"
                icon={Truck}
                value={form.transportationType}
                onChange={e => setForm({...form, transportationType: e.target.value})}
                options={[
                  { label: "Bus", value: "Bus" },
                  { label: "Coach", value: "Coach" },
                  { label: "Van", value: "Van" },
                  { label: "Car", value: "Car" },
                  { label: "Train", value: "Train" },
                  { label: "Flight", value: "Flight" },
                ]}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input 
                  label="Departure Location"
                  placeholder="Starting point"
                  icon={MapPin}
                  value={form.departureLocation}
                  onChange={e => setForm({...form, departureLocation: e.target.value})}
                />
                <Input 
                  label="Destination"
                  placeholder="End point"
                  icon={MapPin}
                  value={form.destination}
                  onChange={e => setForm({...form, destination: e.target.value})}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input 
                  label="Departure Time"
                  type="datetime-local"
                  icon={Calendar}
                  value={form.departureTime}
                  onChange={e => setForm({...form, departureTime: e.target.value})}
                />
                <Input 
                  label="Arrival Time"
                  type="datetime-local"
                  icon={Calendar}
                  value={form.arrivalTime}
                  onChange={e => setForm({...form, arrivalTime: e.target.value})}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input 
                  label="Capacity"
                  type="number"
                  min="1"
                  icon={Users}
                  value={form.capacity}
                  onChange={e => setForm({...form, capacity: parseInt(e.target.value)})}
                />
                <Input 
                  label="Current Passengers"
                  type="number"
                  min="0"
                  icon={Users}
                  value={form.currentPassengers}
                  onChange={e => setForm({...form, currentPassengers: parseInt(e.target.value)})}
                />
              </div>

              <Input 
                label="Cost Per Person"
                type="number"
                min="0"
                step="0.01"
                icon={DollarSign}
                placeholder="Leave 0 for free"
                value={form.costPerPerson}
                onChange={e => setForm({...form, costPerPerson: parseFloat(e.target.value)})}
              />

              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Additional Notes
                </label>
                <textarea 
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none focus:border-neon-purple/50 focus:bg-white/[0.08] transition-all resize-none"
                  placeholder="e.g. Special requirements, stops, etc."
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
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
        </div>

        <div className="space-y-10">
          <Card className="bg-gradient-to-br from-neon-purple/10 to-transparent border-neon-purple/20" animate={false}>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-neon-purple/10 text-neon-purple">
                  <AlertCircle size={20} />
                </div>
                <h3 className="font-black">Configuration</h3>
              </div>

              <label className="flex items-center gap-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="h-5 w-9 appearance-none rounded-full bg-white/10 checked:bg-neon-purple transition-all"
                  checked={form.isFree}
                  onChange={e => setForm({...form, isFree: e.target.checked})}
                />
                <span className="text-sm font-bold">Free Transportation</span>
              </label>

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
                  Update Logistics
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
