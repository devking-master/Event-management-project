import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import { verifyToken } from "@/lib/jwt";

function getEventStatus(startDate: Date, endDate: Date) {
  const now = new Date();

  if (now < startDate) return "upcoming";
  if (now >= startDate && now <= endDate) return "live";
  return "ended";
}

function eventWithComputedStatus(event: any) {
  const obj = typeof event.toObject === "function" ? event.toObject() : event;
  return {
    ...obj,
    status: getEventStatus(new Date(obj.startDate), new Date(obj.endDate)),
  };
}

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return verifyToken(token);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const event = await Event.findById(id).populate("organizer", "name email");

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event: eventWithComputedStatus(event) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingEvent = await Event.findById(id);

    if (!existingEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (user.role !== "admin" && String(existingEvent.organizer) !== String(user.id)) {
      return NextResponse.json(
        { message: "Forbidden: You can only edit your own events" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const startDate = body.startDate ? new Date(body.startDate) : existingEvent.startDate;
    const endDate = body.endDate ? new Date(body.endDate) : existingEvent.endDate;

    if (endDate <= startDate) {
      return NextResponse.json(
        { message: "End date/time must be after start date/time" },
        { status: 400 }
      );
    }

    const ticketTypes = Array.isArray(body.ticketTypes)
      ? body.ticketTypes.map((ticket: any) => ({
          name: ticket.name,
          price: body.isFree ? 0 : Number(ticket.price) || 0,
          quantity: Number(ticket.quantity) || 0,
        }))
      : existingEvent.ticketTypes;

    const totalTickets = ticketTypes.reduce((sum: number, ticket: any) => sum + Number(ticket.quantity || 0), 0);

    const event = await Event.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        startDate,
        endDate,
        location: body.location,
        category: body.category,
        imageUrl: body.imageUrl || "",
        isFree: Boolean(body.isFree),
        transportationAvailable: Boolean(body.transportationAvailable),
        isTransportationFree: Boolean(body.isTransportationFree),
        transportationPrice: Number(body.transportationPrice) || 0,
        transportationDetails: body.transportationDetails,
        ticketTypes,
        totalTickets,
        status: getEventStatus(startDate, endDate),
      },
      { new: true }
    ).populate("organizer", "name email");

    return NextResponse.json({ message: "Event updated", event: eventWithComputedStatus(event) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (user.role !== "admin" && String(event.organizer) !== String(user.id)) {
      return NextResponse.json(
        { message: "Forbidden: You can only delete your own events" },
        { status: 403 }
      );
    }

    await Event.findByIdAndDelete(id);

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
