"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft, Info, Layers, MapPin, Plus, Trash2, Truck, BedDouble, Upload, X, AlertCircle } from "lucide-react";
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

export default function CreateEvent() {
  const router = useRouter();
  const { upload: uploadToCloudinary, uploading: uploadingImage } = useCloudinaryUpload();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
    transportPickup: "",
    transportDepartureTime: "",
    transportSeats: 0,
    transportType: "Bus",
    accommodationAvailable: false,
    isAccommodationFree: false,
    accommodationPrice: 0,
    accommodationName: "",
    accommodationAddress: "",
    accommodationCheckIn: "",
    accommodationCheckOut: "",
    accommodationRooms: 0,
    accommodationDetails: "",
    ticketTypes: [{ name: "Regular", price: 0, quantity: 0 }] as TicketTypeForm[],
  });

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

    if (form.transportationAvailable) {
      if (!form.transportPickup.trim()) {
        setMessage("Transportation pickup location is required.");
        return;
      }

      if (!form.transportDepartureTime) {
        setMessage("Transportation departure time is required.");
        return;
      }

      if (Number(form.transportSeats) <= 0) {
        setMessage("Transportation seats must be greater than 0.");
        return;
      }
    }

    if (form.accommodationAvailable) {
      if (!form.accommodationName.trim()) {
        setMessage("Accommodation name is required.");
        return;
      }

      if (!form.accommodationAddress.trim()) {
        setMessage("Accommodation address is required.");
        return;
      }

      if (!form.accommodationCheckIn || !form.accommodationCheckOut) {
        setMessage("Accommodation check-in and check-out dates are required.");
        return;
      }

      if (new Date(form.accommodationCheckOut) <= new Date(form.accommodationCheckIn)) {
        setMessage("Accommodation check-out must be after check-in.");
        return;
      }

      if (Number(form.accommodationRooms) <= 0) {
        setMessage("Accommodation rooms must be greater than 0.");
        return;
      }
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

      const res = await fetch("/api/events", {
        method: "POST",
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

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-20">
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
            Create <span className="text-neon-purple">Event</span>
          </h1>
          <p className="mt-2 text-white/45">Fill the important details first. Add extras only when needed.</p>
        </div>
      </header>

      {message && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
        <div className="space-y-4">
          <Card className="space-y-4" animate={false}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neon-purple/10 text-neon-purple">
                <Info size={22} />
              </div>
              <h2 className="text-xl font-black sm:text-2xl">Event Information</h2>
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
                rows={3}
                className="w-full min-h-28 rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-neon-purple/50 focus:bg-white/[0.06]"
                placeholder="Tell users about your event..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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

            <div className="grid gap-4 md:grid-cols-2">
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

          <Card className="space-y-4" animate={false}>
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neon-cyan/10 text-neon-cyan">
                  <Layers size={22} />
                </div>
                <h2 className="text-xl font-black sm:text-2xl">Tickets</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/50">
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
                <div key={index} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 md:grid-cols-2 xl:grid-cols-[1fr_0.8fr_0.8fr_auto]">
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

          <Card className="space-y-4" animate={false}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300">
                <Truck size={22} />
              </div>
              <h2 className="text-xl font-black sm:text-2xl">Transportation</h2>
            </div>

            <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5">
              <span className="font-bold text-white">Transportation available?</span>
              <input
                type="checkbox"
                checked={form.transportationAvailable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    transportationAvailable: e.target.checked,
                  })
                }
              />
            </label>

            {form.transportationAvailable && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Pickup Location"
                    placeholder="e.g. Front gate, campus park, city mall"
                    value={form.transportPickup}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        transportPickup: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Departure Time"
                    type="datetime-local"
                    value={form.transportDepartureTime}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        transportDepartureTime: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Available Transport Seats"
                    type="number"
                    min={0}
                    value={form.transportSeats}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        transportSeats: Number(e.target.value),
                      })
                    }
                  />

                  <Select
                    label="Vehicle Type"
                    value={form.transportType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        transportType: e.target.value,
                      })
                    }
                    options={[
                      { label: "Bus", value: "Bus" },
                      { label: "Van", value: "Van" },
                      { label: "Shuttle", value: "Shuttle" },
                      { label: "Private", value: "Private" },
                    ]}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Transportation Price"
                    type="number"
                    min={0}
                    disabled={form.isTransportationFree}
                    value={form.transportationPrice}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        transportationPrice: Number(e.target.value),
                      })
                    }
                  />

                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 text-sm font-bold text-white/70">
                    <input
                      type="checkbox"
                      checked={form.isTransportationFree}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          isTransportationFree: e.target.checked,
                          transportationPrice: e.target.checked
                            ? 0
                            : form.transportationPrice,
                        })
                      }
                    />
                    Transportation is free
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-white/45">
                    Transportation Details
                  </label>
                  <textarea
                    rows={3}
                    className="w-full min-h-24 rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-neon-cyan/50 focus:bg-white/[0.06]"
                    placeholder="Pickup instructions, vehicle notes, route, contact person, etc."
                    value={form.transportationDetails}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        transportationDetails: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </Card>

          <Card className="space-y-4" animate={false}>
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-300">
                <BedDouble size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black sm:text-2xl">Accommodation</h2>
                <p className="text-sm text-white/35">Optional stay package for attendees</p>
              </div>
            </div>

            <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5">
              <span className="font-bold text-white">Enable Accommodation</span>
              <input
                type="checkbox"
                checked={form.accommodationAvailable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accommodationAvailable: e.target.checked,
                  })
                }
              />
            </label>

            {form.accommodationAvailable && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Hotel / Lodge Name"
                    placeholder="e.g. Grand Palace Hotel"
                    value={form.accommodationName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        accommodationName: e.target.value,
                      })
                    }
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Accommodation Address"
                      placeholder="e.g. 10 Island Road, Lagos"
                      value={form.accommodationAddress}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          accommodationAddress: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Input
                    label="Check-in Date & Time"
                    type="datetime-local"
                    value={form.accommodationCheckIn}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        accommodationCheckIn: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Check-out Date & Time"
                    type="datetime-local"
                    value={form.accommodationCheckOut}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        accommodationCheckOut: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Available Rooms"
                    type="number"
                    min={0}
                    value={form.accommodationRooms}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        accommodationRooms: Number(e.target.value),
                      })
                    }
                  />

                  <Input
                    label="Accommodation Price Per Room"
                    type="number"
                    min={0}
                    disabled={form.isAccommodationFree}
                    value={form.accommodationPrice}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        accommodationPrice: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 text-sm font-bold text-white/70">
                  <input
                    type="checkbox"
                    checked={form.isAccommodationFree}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isAccommodationFree: e.target.checked,
                        accommodationPrice: e.target.checked
                          ? 0
                          : form.accommodationPrice,
                      })
                    }
                  />
                  Accommodation is free
                </label>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-[0.2em] text-white/45">
                    Accommodation Details
                  </label>
                  <textarea
                    rows={3}
                    className="w-full min-h-24 rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-neon-cyan/50 focus:bg-white/[0.06]"
                    placeholder="Room type, breakfast, hotel rules, contact person, distance from venue, etc."
                    value={form.accommodationDetails}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        accommodationDetails: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">

          <Card className="space-y-4" animate={false}>
            <h2 className="text-xl font-black sm:text-2xl">Event Image</h2>

            <label className="group flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/[0.03] text-center transition hover:border-neon-purple/40">
              {imagePreview ? (
                <div className="relative h-full min-h-[220px] w-full">
                  <img src={imagePreview} alt="Preview" className="h-full min-h-[220px] w-full object-cover" />
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
                  <Upload className="mb-4 text-neon-purple" size={36} />
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
            Create Event
          </Button>
        </aside>
      </form>
    </div>
  );
}
