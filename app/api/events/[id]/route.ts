import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const event = await Event.findById(id).populate("organizer", "name email");
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ event });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Update logic with auth check
  const { id } = await params;
  return NextResponse.json({ message: "Update not implemented yet" });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Delete logic with auth check
  const { id } = await params;
  return NextResponse.json({ message: "Delete not implemented yet" });
}
