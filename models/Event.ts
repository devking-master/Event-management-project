import mongoose, { Schema, type Document, type Model } from "mongoose";
import { TicketType } from "@/types";

export interface IEvent extends Document {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
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
  transportPickup?: string;
  transportDepartureTime?: Date;
  transportSeats: number;
  transportBooked: number;
  transportType?: "Bus" | "Van" | "Shuttle" | "Private";

  accommodationAvailable: boolean;
  isAccommodationFree: boolean;
  accommodationPrice: number;
  accommodationName?: string;
  accommodationAddress?: string;
  accommodationCheckIn?: Date;
  accommodationCheckOut?: Date;
  accommodationRooms: number;
  accommodationBooked: number;
  accommodationDetails?: string;

  status?: "upcoming" | "live" | "ended";
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: String,

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    location: String,
    category: String,
    imageUrl: String,

    ticketTypes: [
      {
        name: { type: String, enum: ["Regular", "VIP", "VVIP"], required: true },
        price: { type: Number, required: true, default: 0 },
        quantity: { type: Number, required: true, default: 0 },
      },
    ],

    totalTickets: { type: Number, default: 0 },
    soldTickets: { type: Number, default: 0 },

    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },

    transportationAvailable: { type: Boolean, default: false },
    isTransportationFree: { type: Boolean, default: false },
    transportationPrice: { type: Number, default: 0 },
    transportationDetails: String,
    transportPickup: String,
    transportDepartureTime: Date,
    transportSeats: { type: Number, default: 0 },
    transportBooked: { type: Number, default: 0 },
    transportType: {
      type: String,
      enum: ["Bus", "Van", "Shuttle", "Private"],
      default: "Bus",
    },

    accommodationAvailable: { type: Boolean, default: false },
    isAccommodationFree: { type: Boolean, default: false },
    accommodationPrice: { type: Number, default: 0 },
    accommodationName: String,
    accommodationAddress: String,
    accommodationCheckIn: Date,
    accommodationCheckOut: Date,
    accommodationRooms: { type: Number, default: 0 },
    accommodationBooked: { type: Number, default: 0 },
    accommodationDetails: String,

    isFree: { type: Boolean, default: false },

    status: { type: String, enum: ["upcoming", "live", "ended"], default: "upcoming" },
  },
  { timestamps: true }
);

EventSchema.index({ organizer: 1, startDate: 1 });
EventSchema.index({ endDate: 1 });
EventSchema.index({ title: "text", category: "text", location: "text" });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
