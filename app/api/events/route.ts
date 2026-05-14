import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import { verifyToken } from "@/lib/jwt";
import type { EventPayload } from "@/types";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    let query: any = {};
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    let events = await Event.find(query).sort({ date: 1 });

    // Filter by status if provided and calculate status for each event
    const now = new Date();
    events = events.map((event: any) => {
      const eventObj = event.toObject();
      const endDate = eventObj.endDate ? new Date(eventObj.endDate) : new Date(eventObj.date);
      const startDate = eventObj.startDate ? new Date(eventObj.startDate) : new Date(eventObj.date);

      if (now < startDate) {
        eventObj.status = "upcoming";
      } else if (now >= startDate && now < endDate) {
        eventObj.status = "ongoing";
      } else {
        eventObj.status = "ended";
      }

      return eventObj;
    });

    if (status) {
      events = events.filter((e: any) => e.status === status);
    }

    return NextResponse.json({ events });
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
      return NextResponse.json({ message: "Forbidden: Only organizers/admins can create events" }, { status: 403 });
    }

    const body: EventPayload = await req.json();

    if (!body.title || !body.date || !body.ticketTypes?.length) {
      return NextResponse.json({ message: "Missing required fields (title, date, ticket types)" }, { status: 400 });
    }

    // Calculate total capacity
    const totalTickets = body.ticketTypes.reduce((acc, curr) => acc + curr.quantity, 0);

    // Determine event status based on dates
    const now = new Date();
    const startDate = body.startDate ? new Date(body.startDate) : new Date(body.date);
    const endDate = body.endDate ? new Date(body.endDate) : new Date(body.date);

    let eventStatus = "upcoming";
    if (now >= startDate && now < endDate) {
      eventStatus = "ongoing";
    } else if (now >= endDate) {
      eventStatus = "ended";
    }

    const event = await Event.create({
      ...body,
      date: new Date(body.date),
      startDate: body.startDate ? new Date(body.startDate) : new Date(body.date),
      endDate: body.endDate ? new Date(body.endDate) : new Date(body.date),
      totalTickets,
      status: eventStatus,
      organizer: user.id,
    });

    return NextResponse.json({ message: "Event created successfully", event }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
