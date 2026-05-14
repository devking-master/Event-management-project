import mongoose, { Schema, type Document, type Model } from "mongoose";
import { PaymentStatus } from "@/types";

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: "Paystack" | "Flutterwave";
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" },
    status: { type: String, enum: ["pending", "successful", "failed", "refunded"], default: "pending" },
    provider: { type: String, enum: ["Paystack", "Flutterwave"], required: true },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
