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
  totalAmount: number;
  paymentStatus: PaymentStatus;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    tickets: [
      {
        type: { type: String, required: true }, // Removed enum here to allow all TicketType values from TypeScript
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "successful", "failed", "refunded"], default: "pending" },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
