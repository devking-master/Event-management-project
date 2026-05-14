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
      return NextResponse.json({ message: "Unauthorized. Please login to purchase tickets." }, { status: 401 });
    }

    const { eventId, ticketType, quantity, amount, includeTransportation } = await req.json();

    if (!eventId || !ticketType || !amount) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const transPrice = Number(event.transportationPrice) || 0;
    const baseQuantity = Number(quantity) || 1;
    const totalInputAmount = Number(amount) || 0;

    const tickets = [
      { 
        type: ticketType, 
        quantity: baseQuantity, 
        price: (totalInputAmount - (includeTransportation ? (transPrice * baseQuantity) : 0)) / baseQuantity 
      }
    ];

    if (includeTransportation && event.transportationAvailable) {
      tickets.push({
        type: "Transportation",
        quantity: baseQuantity,
        price: transPrice
      });
    }

    // Create a pending order
    const order = await Order.create({
      userId: user.id,
      eventId,
      tickets,
      totalAmount: amount,
      paymentStatus: "pending",
    });

    /**
     * REAL PAYSTACK INTEGRATION WOULD GO HERE
     * const paystackRes = await axios.post('https://api.paystack.co/transaction/initialize', {
     *   email: user.email,
     *   amount: amount * 100,
     *   callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify?orderId=${order._id}`
     * }, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
     */

    // For now, we simulate a successful initialization and redirect to a mock verification route
    const mockAuthUrl = `/api/payments/verify?orderId=${order._id}&status=success&reference=T${Date.now()}`;

    return NextResponse.json({ 
      message: "Payment initialized", 
      authorization_url: mockAuthUrl 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
