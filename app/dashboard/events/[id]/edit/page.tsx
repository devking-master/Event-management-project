"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, ChevronLeft, Info, Layers, MapPin, Plus, Trash2, Truck, Upload, X, AlertCircle } from "lucide-react";
import { useCloudinaryUpload } from "@/lib/useCloudinaryUpload";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

type TicketTypeForm = {
  name: "Regular" | "VIP" | "VVIP";
  price: number;
  quantity: number;
};

export default function EditEvent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { upload: uploadToCloudinary, uploading: uploadingImage } = useCloudinaryUpload();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "Concert",
    imageUrl: "",
    isFree: false,
    transportationAvailable: false,
    isTransportationFree: false,
    transportationPrice: 0,
    transportationDetails: "",
    ticketTypes: [{ name: "Regular", price: 0, quantity: 0 }] as TicketTypeForm[],
  });


  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setFetching(true);
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Failed to load event.");
          return;
        }

        const event = data.event;

        setForm({
          title: event.title || "",
          description: event.description || "",
          startDate: event.startDate ? event.startDate.slice(0, 16) : "",
          endDate: event.endDate ? event.endDate.slice(0, 16) : "",
          location: event.location || "",
          category: event.category || "Concert",
          imageUrl: event.imageUrl || "",
          isFree: Boolean(event.isFree),
          transportationAvailable: Boolean(event.transportationAvailable),
          isTransportationFree: Boolean(event.isTransportationFree),
          transportationPrice: Number(event.transportationPrice) || 0,
          transportationDetails: event.transportationDetails || "",
          ticketTypes: event.ticketTypes?.length
            ? event.ticketTypes
            : [{ name: "Regular", price: 0, quantity: 0 }],
        });

        setImagePreview(event.imageUrl || "");
      } catch (error) {
        console.error(error);
        setMessage("Failed to load event.");
      } finally {
        setFetching(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addTicketType = () => {
    const used = form.ticketTypes.map((ticket) => ticket.name);
    const next = (["Regular", "VIP", "VVIP"] as const).find((item) => !used.includes(item)) || "VIP";

    setForm({
      ...form,
      ticketTypes: [...form.ticketTypes, { name: next, price: 0, quantity: 0 }],
    });
  };

  const removeTicketType = (index: number) => {
    setForm({
      ...form,
      ticketTypes: form.ticketTypes.filter((_, i) => i !== index),
    });
  };

  const updateTicketType = (index: number, field: keyof TicketTypeForm, value: string | number) => {
    const next = [...form.ticketTypes];
    next[index] = {
      ...next[index],
      [field]: field === "name" ? value : Number(value),
    } as TicketTypeForm;

    setForm({ ...form, ticketTypes: next });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!form.startDate || !form.endDate) {
      setMessage("Start date/time and end date/time are required.");
      return;
    }

    if (new Date(form.endDate) <= new Date(form.startDate)) {
      setMessage("End date/time must be after start date/time.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        const uploadedUrl = await uploadToCloudinary(imageFile, {
          onError: (error) => setMessage(error),
        });

        if (!uploadedUrl) {
          setLoading(false);
          return;
        }

        imageUrl = uploadedUrl;
      }

      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to create event.");
        return;
      }

      router.push("/dashboard/events");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while creating the event.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/50">
        Loading event...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/35 transition hover:text-white"
          >
            <ChevronLeft size={16} /> Back to Events
          </button>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Edit <span className="text-neon-purple">Event</span>
          </h1>
          <p className="mt-2 text-white/45">Update event details using one start date/time and one end date/time.</p>
        </div>
      </header>

      {message && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.55fr_0.9fr]">
        <div className="space-y-6">
          <Card className="space-y-6" animate={false}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-neon-purple/10 text-neon-purple">
                <Info size={22} />
              </div>
              <h2 className="text-2xl font-black">Event Information</h2>
            </div>

            <Input
              label="Event Title"
              placeholder="e.g. Summer Music Festival"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <div className="space-y-2">
              <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-white/45">
                Event Description
              </label>
              <textarea
                rows={6}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none transition placeholder:text-white/20 focus:border-neon-purple/50 focus:bg-white/[0.07]"
                placeholder="Tell users about your event..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Start Date & Time"
                type="datetime-local"
                icon={Calendar}
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />

              <Input
                label="End Date & Time"
                type="datetime-local"
                icon={Calendar}
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Location"
                placeholder="Venue or City"
                icon={MapPin}
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <Select
                label="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                options={[
                  { label: "Concert", value: "Concert" },
                  { label: "Tech", value: "Tech" },
                  { label: "Party", value: "Party" },
                  { label: "Workshop", value: "Workshop" },
                  { label: "Conference", value: "Conference" },
                ]}
              />
            </div>
          </Card>

          <Card className="space-y-6" animate={false}>
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-neon-cyan/10 text-neon-cyan">
                  <Layers size={22} />
                </div>
                <h2 className="text-2xl font-black">Tickets</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/50">
                  Free Event
                  <input
                    type="checkbox"
                    checked={form.isFree}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isFree: e.target.checked,
                        ticketTypes: form.ticketTypes.map((ticket) => ({
                          ...ticket,
                          price: e.target.checked ? 0 : ticket.price,
                        })),
                      })
                    }
                  />
                </label>

                {!form.isFree && form.ticketTypes.length < 3 && (
                  <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={addTicketType}>
                    Add Type
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {form.ticketTypes.map((ticket, index) => (
                <div key={index} className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
                  <Select
                    label="Type"
                    value={ticket.name}
                    onChange={(e) => updateTicketType(index, "name", e.target.value)}
                    options={[
                      { label: "Regular", value: "Regular" },
                      { label: "VIP", value: "VIP" },
                      { label: "VVIP", value: "VVIP" },
                    ]}
                  />

                  <Input
                    label="Price"
                    type="number"
                    min={0}
                    disabled={form.isFree}
                    value={ticket.price}
                    onChange={(e) => updateTicketType(index, "price", e.target.value)}
                  />

                  <Input
                    label="Quantity"
                    type="number"
                    min={0}
                    value={ticket.quantity}
                    onChange={(e) => updateTicketType(index, "quantity", e.target.value)}
                  />

                  <div className="flex items-end">
                    {form.ticketTypes.length > 1 && (
                      <Button type="button" variant="danger" icon={Trash2} onClick={() => removeTicketType(index)} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-5" animate={false}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                <Truck size={22} />
              </div>
              <h2 className="text-2xl font-black">Transportation</h2>
            </div>

            <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <span className="font-bold text-white">Transportation available?</span>
              <input
                type="checkbox"
                checked={form.transportationAvailable}
                onChange={(e) => setForm({ ...form, transportationAvailable: e.target.checked })}
              />
            </label>

            {form.transportationAvailable && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Transportation Price"
                  type="number"
                  min={0}
                  disabled={form.isTransportationFree}
                  value={form.transportationPrice}
                  onChange={(e) => setForm({ ...form, transportationPrice: Number(e.target.value) })}
                />

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-white/70">
                  <input
                    type="checkbox"
                    checked={form.isTransportationFree}
                    onChange={(e) => setForm({ ...form, isTransportationFree: e.target.checked, transportationPrice: e.target.checked ? 0 : form.transportationPrice })}
                  />
                  Transportation is free
                </label>

                <div className="sm:col-span-2 space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-white/45">
                    Transportation Details
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none transition placeholder:text-white/20 focus:border-neon-cyan/50 focus:bg-white/[0.07]"
                    placeholder="Pickup points, timing, buses, etc."
                    value={form.transportationDetails}
                    onChange={(e) => setForm({ ...form, transportationDetails: e.target.value })}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="space-y-5" animate={false}>
            <h2 className="text-2xl font-black">Event Image</h2>

            <label className="group flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/[0.03] text-center transition hover:border-neon-purple/40">
              {imagePreview ? (
                <div className="relative h-full min-h-[260px] w-full">
                  <img src={imagePreview} alt="Preview" className="h-full min-h-[260px] w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mb-4 text-neon-purple" size={42} />
                  <p className="font-black text-white">Upload Event Banner</p>
                  <p className="mt-2 max-w-xs text-sm text-white/35">
                    Image will upload to Cloudinary, then the URL will be saved in MongoDB.
                  </p>
                </>
              )}

              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </Card>

          <Button type="submit" variant="neon" size="lg" fullWidth loading={loading || uploadingImage}>
            Update Event
          </Button>
        </aside>
      </form>
    </div>
  );
}
