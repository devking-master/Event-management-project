import mongoose, { Schema, type Document, type Model } from "mongoose";
import { TicketType, TicketStatus } from "@/types";

export interface ITicket extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  type: TicketType;
  price: number;
  code: string;
  status: TicketStatus;
  transportation?: {
    included: boolean;
    pickup?: string;
    departureTime?: Date;
    vehicleType?: string;
  };
  accommodation?: {
    included: boolean;
    name?: string;
    address?: string;
    checkIn?: Date;
    checkOut?: Date;
  };
}

const TicketSchema = new Schema<ITicket>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "paid", "checked-in", "cancelled"],
      default: "pending",
    },
    transportation: {
      included: { type: Boolean, default: false },
      pickup: String,
      departureTime: Date,
      vehicleType: String,
    },
    accommodation: {
      included: { type: Boolean, default: false },
      name: String,
      address: String,
      checkIn: Date,
      checkOut: Date,
    },
  },
  { timestamps: true }
);

const Ticket: Model<ITicket> =
  mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);

export default Ticket;
