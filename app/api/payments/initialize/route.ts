import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { verifyToken } from "@/lib/jwt";
import Order from "@/models/Order";
import Event from "@/models/Event";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to purchase tickets." },
        { status: 401 }
      );
    }

    const { eventId, ticketType, quantity, amount, includeTransportation, transportQuantity } = await req.json();

    if (!eventId || !ticketType || !quantity) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (new Date(event.endDate) <= new Date()) {
      return NextResponse.json(
        { message: "This event has ended and can no longer be purchased." },
        { status: 400 }
      );
    }

    const selectedTicket = event.ticketTypes.find((ticket: any) => ticket.name === ticketType);
    if (!selectedTicket) {
      return NextResponse.json({ message: "Invalid ticket type" }, { status: 400 });
    }

    const orderQuantity = Number(quantity) || 1;
    const available = Number(selectedTicket.quantity) || 0;

    if (orderQuantity > available) {
      return NextResponse.json({ message: "Not enough tickets available" }, { status: 400 });
    }

    const ticketPrice = event.isFree ? 0 : Number(selectedTicket.price) || 0;
    const transportationQty = includeTransportation ? Number(transportQuantity || quantity) : 0;
    const transportationTotal =
      includeTransportation && event.transportationAvailable
        ? (Number(event.transportationPrice) || 0) * transportationQty
        : 0;

    const calculatedAmount = ticketPrice * orderQuantity + transportationTotal;

    if (Number(amount) !== calculatedAmount) {
      return NextResponse.json(
        { message: "Invalid payment amount. Please refresh and try again." },
        { status: 400 }
      );
    }

    const tickets = [
      {
        type: ticketType,
        quantity: orderQuantity,
        price: ticketPrice,
      },
    ];

    if (includeTransportation && event.transportationAvailable) {
      tickets.push({
        type: "Transportation",
        quantity: transportationQty,
        price: Number(event.transportationPrice) || 0,
      });
    }

    const order = await Order.create({
      userId: user.id,
      eventId,
      tickets,
      totalAmount: calculatedAmount,
      paymentStatus: calculatedAmount === 0 ? "successful" : "pending",
    });

    // Mock payment flow. Replace with Paystack/Flutterwave initialization later.
    const mockAuthUrl = `/api/payments/verify?orderId=${order._id}&status=success`;

    return NextResponse.json({
      authorization_url: calculatedAmount === 0 ? `/success?orderId=${order._id}` : mockAuthUrl,
      orderId: order._id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
