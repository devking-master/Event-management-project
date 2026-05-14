"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Building2, 
  Info, 
  Calendar, 
  MapPin, 
  Rocket, 
  Bed,
  Users as UsersIcon,
  ShieldCheck
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function CreateAccommodation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  
  const [form, setForm] = useState({
    hotelName: "",
    address: "",
    roomType: "Standard",
    checkIn: "",
    checkOut: "",
    guestName: "",
    status: "Pending",
    eventId: "",
  });

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => setEvents(data.events || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/accommodation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) router.push("/dashboard/accommodation");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition mb-6 group">
          <ChevronLeft size={16} className="transition group-hover:-translate-x-1" /> Back to Dashboard
        </button>
        <h1 className="text-5xl font-black tracking-tight">Add <span className="text-neon-purple">Accommodation</span></h1>
        <p className="mt-2 text-lg text-white/40">Initialize a new guest accommodation node in the grid.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <Card className="space-y-8" animate={false}>
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-purple/10 text-neon-purple">
                <Building2 size={24} />
              </div>
              <h2 className="text-2xl font-black">Lodging Parameters</h2>
            </div>

            <div className="space-y-8 pt-4">
              <Input 
                label="Hotel/Facility Name"
                placeholder="e.g. Grand Horizon Terminal"
                required
                value={form.hotelName}
                onChange={e => setForm({...form, hotelName: e.target.value})}
              />
              <Input 
                label="Physical Address"
                placeholder="Full location details"
                icon={MapPin}
                required
                value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
              />

              <div className="grid gap-8 sm:grid-cols-2">
                <Select 
                  label="Room Classification"
                  icon={Bed}
                  value={form.roomType}
                  onChange={e => setForm({...form, roomType: e.target.value})}
                  options={[
                    { label: "Standard Room", value: "Standard" },
                    { label: "Deluxe Room", value: "Deluxe" },
                    { label: "Executive Suite", value: "Suite" },
                    { label: "Penthouse Command", value: "Penthouse" }
                  ]}
                />
                <Select 
                  label="Linked Production"
                  value={form.eventId}
                  onChange={e => setForm({...form, eventId: e.target.value})}
                  options={[
                    { label: "Select Production", value: "" },
                    ...events.map((e: any) => ({ label: e.title, value: e._id }))
                  ]}
                />
              </div>
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
                label="Primary Occupant Name"
                placeholder="Enter guest full name"
                icon={UsersIcon}
                value={form.guestName}
                onChange={e => setForm({...form, guestName: e.target.value})}
              />

              <div className="grid gap-8 sm:grid-cols-2">
                <Input 
                  label="Check-in Timestamp"
                  type="date"
                  icon={Calendar}
                  required
                  value={form.checkIn}
                  onChange={e => setForm({...form, checkIn: e.target.value})}
                />
                <Input 
                  label="Check-out Timestamp"
                  type="date"
                  icon={Calendar}
                  required
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
                <h3 className="font-black">Accommodation Status</h3>
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
                  Confirm Reservation
                </Button>
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/20 mt-6 italic">
                  Syncing Accommodation
                </p>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
