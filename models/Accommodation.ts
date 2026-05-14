import mongoose, { Schema, type Document, type Model } from "mongoose";
import { AccommodationStatus } from "@/types";

export interface IAccommodation extends Document {
  eventId: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  hotelName: string;
  roomNumber?: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: AccommodationStatus;
  specialRequest?: string;
  createdBy: mongoose.Types.ObjectId;
}

const AccommodationSchema = new Schema<IAccommodation>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    hotelName: { type: String, required: true },
    roomNumber: String,
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    status: { type: String, enum: ["reserved", "checked-in", "checked-out", "cancelled"], default: "reserved" },
    specialRequest: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Accommodation: Model<IAccommodation> = mongoose.models.Accommodation || mongoose.model<IAccommodation>("Accommodation", AccommodationSchema);

export default Accommodation;
