import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { verifyToken } from "@/lib/jwt";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = verifyToken(token);

    if (!user || !["organizer", "admin"].includes(user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { code, eventId } = await req.json();

    if (!code) {
      return NextResponse.json({ message: "Ticket code is required" }, { status: 400 });
    }

    const ticket = await Ticket.findOne({ code }).populate("userId", "name email");

    if (!ticket) {
      return NextResponse.json({ message: "Invalid ticket code" }, { status: 404 });
    }

    if (eventId && String(ticket.eventId) !== String(eventId)) {
      return NextResponse.json({ message: "Ticket is not for this event" }, { status: 400 });
    }

    if (ticket.status === "checked-in") {
      return NextResponse.json({ message: "Ticket already checked-in", guest: ticket.userId }, { status: 409 });
    }

    if (ticket.status !== "paid") {
      return NextResponse.json({ message: "Ticket is not paid for" }, { status: 400 });
    }

    // Mark as checked-in
    ticket.status = "checked-in";
    await ticket.save();

    return NextResponse.json({ 
      message: "Check-in successful", 
      guest: ticket.userId,
      type: ticket.type 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
