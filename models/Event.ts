import mongoose, { Schema, type Document, type Model } from "mongoose";
import { TicketType } from "@/types";

export interface IEvent extends Document {
  title: string;
  description?: string;
  date: Date;
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: string;
  imageUrl?: string;
  ticketTypes: {
    name: TicketType;
    price: number;
    quantity: number;
  }[];
  totalTickets: number;
  soldTickets: number;
  organizer: mongoose.Types.ObjectId;
  isFree: boolean;
  transportationAvailable: boolean;
  isTransportationFree: boolean;
  transportationPrice: number;
  transportationDetails?: string;
  status?: "upcoming" | "ongoing" | "ended";
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String,
    location: String,
    category: String,
    imageUrl: String,
    ticketTypes: [
      {
        name: { type: String, enum: ["Regular", "VIP", "VVIP"], required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalTickets: { type: Number, default: 0 },
    soldTickets: { type: Number, default: 0 },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isFree: { type: Boolean, default: false },
    transportationAvailable: { type: Boolean, default: false },
    isTransportationFree: { type: Boolean, default: false },
    transportationPrice: { type: Number, default: 0 },
    transportationDetails: String,
    status: { type: String, enum: ["upcoming", "ongoing", "ended"], default: "upcoming" },
  },
  { timestamps: true }
);

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
