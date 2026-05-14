"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Truck, 
  Info, 
  Calendar, 
  MapPin, 
  Rocket, 
  AlertCircle,
  Clock,
  Layers
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function CreateLogistics() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  
  const [form, setForm] = useState({
    title: "",
    category: "Transportation",
    description: "",
    status: "Pending",
    eventId: "",
    location: "",
    estimatedTime: "",
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
      const res = await fetch("/api/logistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) router.push("/dashboard/logistics");
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
          <ChevronLeft size={16} className="transition group-hover:-translate-x-1" /> Back to Hub
        </button>
        <h1 className="text-5xl font-black tracking-tight">Add <span className="text-neon-cyan">Logistics</span></h1>
        <p className="mt-2 text-lg text-white/40">Deploy a new logistics node for your production grid.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <Card className="space-y-8" animate={false}>
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-cyan/10 text-neon-cyan">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-black">Logistics Details</h2>
            </div>

            <div className="space-y-8 pt-4">
              <Input 
                label="Title"
                placeholder="e.g. Stage Equipment Transport"
                required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />

              <div className="grid gap-8 sm:grid-cols-2">
                <Select 
                  label="Logistics Sector"
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  options={[
                    { label: "Transportation", value: "Transportation" },
                    { label: "Equipment", value: "Equipment" },
                    { label: "Vendors", value: "Vendors" },
                    { label: "Security", value: "Security" },
                    { label: "Staff/Volunteers", value: "Staff/Volunteers" },
                    { label: "Food & Drinks", value: "Food & Drinks" }
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

              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-white/40">Operational Briefing</label>
                <textarea 
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none focus:border-neon-cyan/50 focus:bg-white/[0.08] transition-all resize-none placeholder:text-white/20"
                  placeholder="Detail the mission objectives and requirements..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-8" animate={false}>
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-purple/10 text-neon-purple">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-black">Deployment Details</h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 pt-4">
              <Input 
                label="Target Location"
                placeholder="Sector or Address"
                icon={MapPin}
                value={form.location}
                onChange={e => setForm({...form, location: e.target.value})}
              />
              <Input 
                label="Estimated Timeline"
                type="datetime-local"
                icon={Clock}
                value={form.estimatedTime}
                onChange={e => setForm({...form, estimatedTime: e.target.value})}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="bg-gradient-to-br from-neon-cyan/10 to-transparent border-neon-cyan/20" animate={false}>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-neon-cyan/10 text-neon-cyan">
                  <Layers size={20} />
                </div>
                <h3 className="font-black">Status</h3>
              </div>

              <div className="space-y-4">
                {["Pending", "In Progress", "Completed", "Delayed"].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setForm({...form, status})}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      form.status === status 
                        ? "bg-white/10 border-neon-cyan text-white shadow-glass" 
                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/[0.08]"
                    }`}
                  >
                    <span className="text-sm font-bold">{status}</span>
                    <div className={`h-2 w-2 rounded-full ${
                      form.status === status ? "bg-neon-cyan shadow-glow-cyan" : "bg-white/10"
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
                  Confirm Deployment
                </Button>
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/20 mt-6 italic flex items-center justify-center gap-2">
                  <AlertCircle size={10} /> Syncing with Command Center
                </p>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
