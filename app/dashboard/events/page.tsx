"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Calendar as CalendarIcon,
  MapPin,
  Ticket,
  Clock,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type EventItem = {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  category?: string;
  imageUrl?: string;
  totalTickets?: number;
  soldTickets?: number;
  status?: "upcoming" | "live" | "ended";
  ticketTypes?: { name: string; price: number; quantity: number }[];
  transportationAvailable?: boolean;
};

function formatDate(value?: string) {
  if (!value) return "Not set";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusClass(status?: string) {
  if (status === "ended") return "border-rose-500/20 bg-rose-500/10 text-rose-300";
  if (status === "live") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
}

export default function EventsList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events?mine=true", { cache: "no-store" });
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
  }, []);

  const filteredEvents = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return events;

    return events.filter((event) =>
      [event.title, event.category, event.location].some((field) =>
        field?.toLowerCase().includes(value)
      )
    );
  }, [events, search]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents((current) => current.filter((event) => event._id !== id));
    } else {
      const data = await res.json();
      alert(data.message || "Failed to delete event");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            My <span className="text-neon-cyan">Events</span>
          </h1>
          <p className="mt-2 text-white/45">
            Only events created by your organizer account are shown here.
          </p>
        </div>

        <Link href="/dashboard/events/create">
          <Button variant="neon" size="lg" icon={Plus}>
            Create New Event
          </Button>
        </Link>
      </header>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/25" size={20} />
        <input
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 pl-14 text-white outline-none transition focus:border-neon-cyan/50 focus:bg-white/[0.07]"
          placeholder="Search your events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-[430px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card animate={false} className="py-20 text-center">
          <CalendarIcon className="mx-auto mb-4 text-white/20" size={56} />
          <h3 className="text-2xl font-black text-white/70">No events found</h3>
          <p className="mx-auto mt-2 max-w-md text-white/40">
            Create your first event or adjust your search.
          </p>
          <Link href="/dashboard/events/create" className="mt-8 inline-block">
            <Button variant="outline">Create Event</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => {
            const lowestPrice = event.ticketTypes?.length
              ? Math.min(...event.ticketTypes.map((ticket) => Number(ticket.price) || 0))
              : 0;

            return (
              <Card key={event._id} className="flex h-full flex-col overflow-hidden p-0" animate={false}>
                <div className="relative h-52 w-full overflow-hidden">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 text-white/20">
                      <CalendarIcon size={52} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/10 to-transparent" />

                  <span className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusClass(event.status)}`}>
                    {event.status || "upcoming"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-neon-cyan">
                      {event.category || "Event"}
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-2xl font-black leading-tight text-white">
                      {event.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
                      {event.description || "No description provided."}
                    </p>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
                    <p className="flex gap-2">
                      <Clock size={16} className="shrink-0 text-neon-purple" />
                      <span>{formatDate(event.startDate)} → {formatDate(event.endDate)}</span>
                    </p>
                    <p className="flex gap-2">
                      <MapPin size={16} className="shrink-0 text-neon-cyan" />
                      <span>{event.location || "No location"}</span>
                    </p>
                    <p className="flex gap-2">
                      <Ticket size={16} className="shrink-0 text-neon-pink" />
                      <span>{event.soldTickets || 0} sold / {event.totalTickets || 0} total</span>
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-white/35">From</p>
                      <p className="text-xl font-black text-white">₦{lowestPrice.toLocaleString()}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/dashboard/events/${event._id}/edit`}>
                        <Button variant="secondary" size="sm" icon={Edit2}>
                          Edit
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(event._id)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
