"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Calendar, 
  MapPin, 
  Tag, 
  Plus, 
  Trash2, 
  Rocket, 
  Info,
  ChevronLeft,
  Activity,
  Layers,
  Truck,
  Building2,
  X
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    category: "Concert",
    imageUrl: "",
    isFree: false,
    transportationAvailable: false,
    isTransportationFree: false,
    transportationPrice: 0,
    transportationDetails: "",
    ticketTypes: [
      { name: "Regular", price: 0, quantity: 0 }
    ],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("file", imageFile);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  const addTicketType = () => {
    setForm({
      ...form,
      ticketTypes: [...form.ticketTypes, { name: "VIP", price: 0, quantity: 0 }]
    });
  };

  const removeTicketType = (index: number) => {
    setForm({
      ...form,
      ticketTypes: form.ticketTypes.filter((_, i) => i !== index)
    });
  };

  const updateTicketType = (index: number, field: string, value: any) => {
    const newTypes = [...form.ticketTypes];
    (newTypes[index] as any)[field] = value;
    setForm({ ...form, ticketTypes: newTypes });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl }),
      });
      if (res.ok) router.push("/dashboard/events");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white transition mb-6 group">
            <ChevronLeft size={16} className="transition group-hover:-translate-x-1" /> Back to Events
          </button>
          <h1 className="text-5xl font-black tracking-tight text-white">Create <span className="text-neon-purple">Event</span></h1>
          <p className="mt-2 text-lg text-white/40">Create a new event for your audience.</p>
        </div>
        <div className="flex items-center gap-4 border-l border-white/5 pl-8">
          <Activity size={24} className="text-neon-purple animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">System Status</span>
            <span className="text-xs font-black text-white">Ready</span>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-10">
          <Card className="space-y-8" animate={false}>
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-purple/10 text-neon-purple">
                  <Info size={24} />
                </div>
                <h2 className="text-2xl font-black text-white">Event Information</h2>
              </div>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Free Event</span>
                <input 
                  type="checkbox" 
                  className="h-5 w-9 appearance-none rounded-full bg-white/10 checked:bg-neon-purple transition-all relative cursor-pointer after:content-[''] after:absolute after:top-1 after:left-1 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all checked:after:left-5"
                  checked={form.isFree}
                  onChange={e => {
                    const isFree = e.target.checked;
                    setForm({
                      ...form, 
                      isFree,
                      ticketTypes: form.ticketTypes.map(t => ({ ...t, price: isFree ? 0 : t.price }))
                    });
                  }}
                />
              </div>
            </div>

            <div className="space-y-8 pt-4">
              <Input 
                label="Event Title"
                placeholder="e.g. Summer Music Festival 2026"
                required
                className="text-xl font-bold"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />

              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Event Description
                </label>
                <textarea 
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 outline-none focus:border-neon-purple/50 focus:bg-white/[0.08] transition-all resize-none placeholder:text-white/20"
                  placeholder="Tell us about your event..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <Input 
                  label="Event Date & Time"
                  type="datetime-local"
                  icon={Calendar}
                  required
                  value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                />
                <Input 
                  label="Event Location"
                  placeholder="Venue or City"
                  icon={MapPin}
                  required
                  value={form.location}
                  onChange={e => setForm({...form, location: e.target.value})}
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Event Duration</h3>
                <div className="grid gap-8 sm:grid-cols-2">
                  <Input 
                    label="Start Date & Time"
                    type="datetime-local"
                    icon={Calendar}
                    value={form.startDate}
                    onChange={e => setForm({...form, startDate: e.target.value})}
                  />
                  <Input 
                    label="End Date & Time"
                    type="datetime-local"
                    icon={Calendar}
                    value={form.endDate}
                    onChange={e => setForm({...form, endDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-8" animate={false}>
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-cyan/10 text-neon-cyan">
                  <Layers size={24} />
                </div>
                <h2 className="text-2xl font-black text-white">Tickets & Pricing</h2>
              </div>
              {!form.isFree && (
                <Button type="button" variant="ghost" size="sm" icon={Plus} onClick={addTicketType}>
                  Add Ticket Type
                </Button>
              )}
            </div>

            <div className="space-y-6 pt-4">
              {form.ticketTypes.map((ticket, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className="grid gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5 items-end sm:grid-cols-[1.2fr_1fr_1fr_auto]"
                >
                  <Select 
                    label="Ticket Type"
                    value={ticket.name}
                    onChange={e => updateTicketType(index, 'name', e.target.value)}
                    options={[
                      { label: "Regular", value: "Regular" },
                      { label: "VIP", value: "VIP" },
                      { label: "VVIP", value: "VVIP" }
                    ]}
                  />
                  <Input 
                    label="Ticket Price (₦)"
                    type="number"
                    value={ticket.price}
                    disabled={form.isFree}
                    className={form.isFree ? "opacity-50 grayscale" : ""}
                    onChange={e => updateTicketType(index, 'price', Number(e.target.value))}
                  />
                  <Input 
                    label="Quantity"
                    type="number"
                    value={ticket.quantity}
                    onChange={e => updateTicketType(index, 'quantity', Number(e.target.value))}
                  />
                  {index > 0 && !form.isFree && (
                    <button 
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="h-14 w-14 grid place-items-center text-rose-500 hover:bg-rose-500/10 rounded-2xl transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="space-y-8" animate={false}>
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Truck size={24} />
              </div>
              <h2 className="text-2xl font-black text-white">Transportation</h2>
            </div>

            <div className="space-y-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white">Provide Transportation</h3>
                    <p className="text-xs text-white/30 uppercase tracking-widest font-bold">Offer transport for your guests</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="h-6 w-11 appearance-none rounded-full bg-white/10 checked:bg-neon-purple transition-all relative cursor-pointer after:content-[''] after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all checked:after:left-6"
                  checked={form.transportationAvailable}
                  onChange={e => setForm({...form, transportationAvailable: e.target.checked})}
                />
              </div>

              <AnimatePresence>
                {form.transportationAvailable && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    className="overflow-hidden pt-6 space-y-6 border-t border-white/5"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-white/30">Free Transportation</label>
                        <div className="flex items-center justify-between h-14 bg-white/5 rounded-2xl border border-white/5 px-4">
                          <span className="text-xs font-bold text-white/50">Complimentary for guests</span>
                          <input 
                            type="checkbox" 
                            className="h-5 w-9 appearance-none rounded-full bg-white/10 checked:bg-neon-cyan transition-all relative cursor-pointer after:content-[''] after:absolute after:top-1 after:left-1 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all checked:after:left-5"
                            checked={form.isTransportationFree}
                            onChange={e => setForm({...form, isTransportationFree: e.target.checked, transportationPrice: e.target.checked ? 0 : form.transportationPrice})}
                          />
                        </div>
                      </div>
                      <Input 
                        label="Transportation Price (₦)"
                        type="number"
                        placeholder="Price per person"
                        value={form.transportationPrice}
                        disabled={form.isTransportationFree}
                        className={form.isTransportationFree ? "opacity-50 grayscale" : ""}
                        onChange={e => setForm({...form, transportationPrice: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-white/30">Transportation Details</label>
                      <textarea 
                        className="w-full rounded-xl border border-white/10 bg-night p-4 text-sm outline-none focus:border-neon-purple/50 transition-all resize-none placeholder:text-white/20"
                        placeholder="Provide details about pickup points, times, etc..."
                        value={form.transportationDetails}
                        onChange={e => setForm({...form, transportationDetails: e.target.value})}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="space-y-6" animate={false}>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Event Image</label>
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] transition-all hover:border-neon-purple/50 group">
              {imagePreview ? (
                <div className="relative h-full w-full">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover animate-in fade-in zoom-in-95 duration-500" />
                  <button 
                    type="button" 
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-4 right-4 h-10 w-10 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="flex h-full flex-col items-center justify-center p-8 text-center cursor-pointer">
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-white/10 group-hover:bg-neon-purple/20 group-hover:text-neon-purple transition-all">
                    <Upload size={32} />
                  </div>
                  <p className="text-sm font-medium text-white/20 group-hover:text-white/40 transition">Drop image or click to select</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
              {/* HUD corner overlay */}
              <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-neon-purple/40" />
              <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-neon-purple/40" />
            </div>
            <div className="pt-4">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest text-center italic">Images are securely hosted</p>
            </div>
          </Card>

          <Card className="space-y-8 bg-gradient-to-br from-neon-purple/10 to-transparent border-neon-purple/20" animate={false}>
            <div className="space-y-6">
              <Select 
                label="Event Category"
                icon={Tag}
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                options={[
                  { label: "Concert", value: "Concert" },
                  { label: "Tech", value: "Tech" },
                  { label: "Party", value: "Party" },
                  { label: "Workshop", value: "Workshop" },
                  { label: "Exhibition", value: "Exhibition" }
                ]}
              />
            </div>

            <div className="pt-4 space-y-4">
              <Button 
                type="submit"
                variant="neon" 
                size="xl" 
                className="w-full text-white"
                loading={loading}
                icon={Plus}
              >
                Create Event
              </Button>
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/20 italic">
                Verify details before submitting
              </p>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
