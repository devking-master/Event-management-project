import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { verifyToken } from "@/lib/jwt";
import Event from "@/models/Event";
import Order from "@/models/Order";
import Ticket from "@/models/Ticket";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Filter by organizer if not admin
    const query = user.role === "admin" ? {} : { organizer: user.id };

    const events = await Event.find(query);
    const eventIds = events.map(e => e._id);

    const totalEvents = events.length;
    const totalSoldTickets = events.reduce((acc, curr) => acc + (curr.soldTickets || 0), 0);
    
    const successfulOrders = await Order.find({ 
      eventId: { $in: eventIds }, 
      paymentStatus: "successful" 
    });
    
    const totalRevenue = successfulOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    const recentSales = await Order.find({ eventId: { $in: eventIds }, paymentStatus: "successful" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email");

    const upcomingEvents = await Event.find(query)
      .where("date").gt(Date.now() as any)
      .sort({ date: 1 })
      .limit(3);

    return NextResponse.json({
      stats: {
        totalEvents,
        totalSoldTickets,
        totalRevenue,
        avgAttendance: "85%" // Mocked or calculated from check-ins
      },
      recentSales,
      upcomingEvents
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
