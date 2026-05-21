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

    const {
      eventId,
      ticketType,
      quantity,
      amount,
      includeTransportation,
      transportQuantity,
      includeAccommodation,
      accommodationQuantity,
    } = await req.json();

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

    const selectedTicket = event.ticketTypes.find(
      (ticket: any) => ticket.name === ticketType
    );

    if (!selectedTicket) {
      return NextResponse.json({ message: "Invalid ticket type" }, { status: 400 });
    }

    const orderQuantity = Math.max(1, Number(quantity) || 1);
    const availableTickets = Number(selectedTicket.quantity || 0);

    if (orderQuantity > availableTickets) {
      return NextResponse.json({ message: "Not enough tickets available" }, { status: 400 });
    }

    const ticketPrice = event.isFree ? 0 : Number(selectedTicket.price) || 0;

    let transportationQty = 0;
    let transportationUnitPrice = 0;
    let transportationTotal = 0;

    if (includeTransportation) {
      if (!event.transportationAvailable) {
        return NextResponse.json(
          { message: "Transportation is not available for this event." },
          { status: 400 }
        );
      }

      transportationQty = Math.max(1, Number(transportQuantity || orderQuantity) || 1);
      transportationUnitPrice = event.isTransportationFree
        ? 0
        : Number(event.transportationPrice) || 0;

      const remainingSeats =
        Number(event.transportSeats || 0) - Number(event.transportBooked || 0);

      if (transportationQty > remainingSeats) {
        return NextResponse.json(
          { message: `Not enough transport seats. Only ${remainingSeats} seat(s) left.` },
          { status: 400 }
        );
      }

      transportationTotal = transportationUnitPrice * transportationQty;
    }

    let accommodationQty = 0;
    let accommodationUnitPrice = 0;
    let accommodationTotal = 0;

    if (includeAccommodation) {
      if (!event.accommodationAvailable) {
        return NextResponse.json(
          { message: "Accommodation is not available for this event." },
          { status: 400 }
        );
      }

      accommodationQty = Math.max(1, Number(accommodationQuantity || 1) || 1);
      accommodationUnitPrice = event.isAccommodationFree
        ? 0
        : Number(event.accommodationPrice) || 0;

      const remainingRooms =
        Number(event.accommodationRooms || 0) - Number(event.accommodationBooked || 0);

      if (accommodationQty > remainingRooms) {
        return NextResponse.json(
          { message: `Not enough accommodation rooms. Only ${remainingRooms} room(s) left.` },
          { status: 400 }
        );
      }

      accommodationTotal = accommodationUnitPrice * accommodationQty;
    }

    const calculatedAmount = ticketPrice * orderQuantity + transportationTotal + accommodationTotal;

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
        price: transportationUnitPrice,
      });
    }

    if (includeAccommodation && event.accommodationAvailable) {
      tickets.push({
        type: "Accommodation",
        quantity: accommodationQty,
        price: accommodationUnitPrice,
      });
    }

    const order = await Order.create({
      userId: user.id,
      eventId,
      tickets,
      transportation: {
        included: Boolean(includeTransportation && event.transportationAvailable),
        quantity: transportationQty,
        unitPrice: transportationUnitPrice,
        total: transportationTotal,
        pickup: event.transportPickup || "",
        departureTime: event.transportDepartureTime,
        vehicleType: event.transportType || "Bus",
      },
      accommodation: {
        included: Boolean(includeAccommodation && event.accommodationAvailable),
        quantity: accommodationQty,
        unitPrice: accommodationUnitPrice,
        total: accommodationTotal,
        name: event.accommodationName || "",
        address: event.accommodationAddress || "",
        checkIn: event.accommodationCheckIn,
        checkOut: event.accommodationCheckOut,
      },
      totalAmount: calculatedAmount,
      paymentStatus: calculatedAmount === 0 ? "successful" : "pending",
    });

    const mockAuthUrl = `/api/payments/verify?orderId=${order._id}&status=success`;

    return NextResponse.json({
      authorization_url:
        calculatedAmount === 0
          ? `/api/payments/verify?orderId=${order._id}&status=success`
          : mockAuthUrl,
      orderId: order._id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
