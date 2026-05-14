import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";
import Payment from "@/models/Payment";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");
    const reference = searchParams.get("reference");

    if (!orderId || status !== "success") {
      return NextResponse.redirect(new URL("/checkout/failed", req.url));
    }

    const order = await Order.findById(orderId).populate("userId");
    if (!order || order.paymentStatus === "successful") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const user = order.userId as any;

    // 1. Update Order Status
    order.paymentStatus = "successful";
    await order.save();

    // 2. Record Payment
    await Payment.create({
      orderId: order._id,
      transactionId: reference || `REF-${Date.now()}`,
      amount: order.totalAmount,
      currency: "NGN",
      status: "successful",
      provider: "Paystack", // Mock
    });

    // 3. Generate Tickets
    const tickets = [];
    for (const item of order.tickets) {
      for (let i = 0; i < item.quantity; i++) {
        const ticketCode = `EF-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
        const ticket = await Ticket.create({
          eventId: order.eventId,
          userId: user._id,
          guestName: user.name || "Valued Guest",
          guestEmail: user.email || "guest@eventflow.com",
          type: item.type,
          price: item.price,
          code: ticketCode,
          status: "paid",
        });
        tickets.push(ticket);
      }
    }

    // 4. Update Event Sold Count
    await Event.findByIdAndUpdate(order.eventId, {
      $inc: { soldTickets: tickets.length }
    });

    // 5. Redirect to success page
    return NextResponse.redirect(new URL(`/checkout/success?orderId=${orderId}`, req.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/checkout/failed", req.url));
  }
}
