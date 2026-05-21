import mongoose, { Schema, type Document, type Model } from "mongoose";
import { TicketType, PaymentStatus } from "@/types";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  tickets: {
    type: TicketType;
    quantity: number;
    price: number;
  }[];
  transportation?: {
    included: boolean;
    quantity: number;
    unitPrice: number;
    total: number;
    pickup?: string;
    departureTime?: Date;
    vehicleType?: string;
  };
  accommodation?: {
    included: boolean;
    quantity: number;
    unitPrice: number;
    total: number;
    name?: string;
    address?: string;
    checkIn?: Date;
    checkOut?: Date;
  };
  totalAmount: number;
  paymentStatus: PaymentStatus;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },

    tickets: [
      {
        type: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    transportation: {
      included: { type: Boolean, default: false },
      quantity: { type: Number, default: 0 },
      unitPrice: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      pickup: String,
      departureTime: Date,
      vehicleType: String,
    },

    accommodation: {
      included: { type: Boolean, default: false },
      quantity: { type: Number, default: 0 },
      unitPrice: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      name: String,
      address: String,
      checkIn: Date,
      checkOut: Date,
    },

    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "successful", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
