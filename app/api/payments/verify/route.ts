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

    if (!order) {
      return NextResponse.redirect(new URL("/checkout/failed", req.url));
    }

    if (order.paymentStatus === "successful") {
      return NextResponse.redirect(new URL(`/checkout/success?orderId=${orderId}`, req.url));
    }

    const event = await Event.findById(order.eventId);

    if (!event) {
      return NextResponse.redirect(new URL("/checkout/failed", req.url));
    }

    const transportItem = order.tickets.find((item: any) => item.type === "Transportation");

    if (transportItem) {
      const remainingSeats =
        Number(event.transportSeats || 0) - Number(event.transportBooked || 0);

      if (Number(transportItem.quantity) > remainingSeats) {
        order.paymentStatus = "failed";
        await order.save();

        return NextResponse.redirect(new URL("/checkout/failed", req.url));
      }
    }

    const user = order.userId as any;

    order.paymentStatus = "successful";
    await order.save();

    await Payment.create({
      orderId: order._id,
      transactionId: reference || `REF-${Date.now()}`,
      amount: order.totalAmount,
      currency: "NGN",
      status: "successful",
      provider: "Paystack",
    });

    const purchasedTicketItems = order.tickets.filter(
      (item: any) => item.type !== "Transportation"
    );

    const createdTickets = [];

    for (const item of purchasedTicketItems) {
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
          transportation: {
            included: Boolean(transportItem),
            pickup: order.transportation?.pickup || event.transportPickup || "",
            departureTime:
              order.transportation?.departureTime || event.transportDepartureTime,
            vehicleType: order.transportation?.vehicleType || event.transportType || "Bus",
          },
        });

        createdTickets.push(ticket);
      }
    }

    const update: any = {
      $inc: {
        soldTickets: createdTickets.length,
      },
    };

    if (transportItem) {
      update.$inc.transportBooked = Number(transportItem.quantity) || 0;
    }

    await Event.findByIdAndUpdate(order.eventId, update);

    return NextResponse.redirect(new URL(`/checkout/success?orderId=${orderId}`, req.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/checkout/failed", req.url));
  }
}
