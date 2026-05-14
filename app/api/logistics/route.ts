import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { verifyToken } from "@/lib/jwt";
import Logistics from "@/models/Logistics";

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

    const logistics = await Logistics.find(query)
      .populate("eventId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ logistics });
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

    if (!user || (user.role !== "organizer" && user.role !== "admin")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const logistics = await Logistics.create({
      ...body,
      createdBy: user.id,
    });

    return NextResponse.json({ logistics, message: "Logistics mission initialized" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
