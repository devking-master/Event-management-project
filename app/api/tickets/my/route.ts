import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { verifyToken } from "@/lib/jwt";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tickets = await Ticket.find({ userId: user.id })
      .populate("eventId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ tickets });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
