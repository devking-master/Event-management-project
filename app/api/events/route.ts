import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import { verifyToken } from "@/lib/jwt";

type TicketInput = {
  name: "Regular" | "VIP" | "VVIP";
  price: number;
  quantity: number;
};

type EventBody = {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
  imageUrl?: string | null;
  isFree?: boolean;
  transportationAvailable?: boolean;
  isTransportationFree?: boolean;
  transportationPrice?: number;
  transportationDetails?: string;
  ticketTypes?: TicketInput[];
};

function getEventStatus(startDate: Date, endDate: Date) {
  const now = new Date();

  if (now < startDate) return "upcoming";
  if (now >= startDate && now <= endDate) return "live";
  return "ended";
}

function eventWithComputedStatus(event: any) {
  const obj = typeof event.toObject === "function" ? event.toObject() : event;
  const startDate = new Date(obj.startDate);
  const endDate = new Date(obj.endDate);

  return {
    ...obj,
    status: getEventStatus(startDate, endDate),
  };
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const mine = searchParams.get("mine") === "true";

    const query: any = {};

    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (mine) {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      const user = verifyToken(token);

      if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      query.organizer = user.id;
    } else {
      // Public explore page: only show events that have not ended.
      query.endDate = { $gt: new Date() };
    }

    let events = await Event.find(query)
      .populate("organizer", "name email")
      .sort({ startDate: 1 });

    let result = events.map(eventWithComputedStatus);

    if (status) {
      result = result.filter((event: any) => event.status === status);
    }

    return NextResponse.json({ events: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!["organizer", "admin"].includes(user.role)) {
      return NextResponse.json(
        { message: "Forbidden: Only organizers/admins can create events" },
        { status: 403 }
      );
    }

    const body: EventBody = await req.json();

    if (!body.title || !body.startDate || !body.endDate || !body.ticketTypes?.length) {
      return NextResponse.json(
        { message: "Title, start date, end date and ticket types are required" },
        { status: 400 }
      );
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return NextResponse.json({ message: "Invalid event date" }, { status: 400 });
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { message: "End date/time must be after start date/time" },
        { status: 400 }
      );
    }

    const ticketTypes = body.ticketTypes.map((ticket) => ({
      name: ticket.name,
      price: body.isFree ? 0 : Number(ticket.price) || 0,
      quantity: Number(ticket.quantity) || 0,
    }));

    const totalTickets = ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0);

    const event = await Event.create({
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
      soldTickets: 0,
      organizer: user.id,
      status: getEventStatus(startDate, endDate),
    });

    return NextResponse.json(
      { message: "Event created successfully", event: eventWithComputedStatus(event) },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
