import mongoose, { Schema, type Document, type Model } from "mongoose";
import { TicketType, PaymentStatus } from "@/types";

export interface IGuest extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  ticketType: TicketType;
  paymentStatus: PaymentStatus;
  checkInStatus: boolean;
}

const GuestSchema = new Schema<IGuest>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    ticketType: { type: String, enum: ["Regular", "VIP", "VVIP"], required: true },
    paymentStatus: { type: String, enum: ["pending", "successful", "failed", "refunded"], default: "pending" },
    checkInStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Guest: Model<IGuest> = mongoose.models.Guest || mongoose.model<IGuest>("Guest", GuestSchema);

export default Guest;
