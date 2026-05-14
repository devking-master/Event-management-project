import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { verifyToken } from "@/lib/jwt";
import Accommodation from "@/models/Accommodation";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = verifyToken(token);

    if (!user || (user.role !== "organizer" && user.role !== "admin")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");
    const query: any = {};
    
    if (eventId) query.eventId = eventId;
    if (status) query.status = status;
    if (user.role === "organizer") query.createdBy = user.id;

    const accommodation = await Accommodation.find(query)
      .populate("eventId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ accommodation });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = verifyToken(token);

    if (!user || (user.role !== "organizer" && user.role !== "admin")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const accommodation = await Accommodation.create({
      ...body,
      createdBy: user.id,
    });

    return NextResponse.json({ accommodation, message: "Guest accommodation node secured" });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
