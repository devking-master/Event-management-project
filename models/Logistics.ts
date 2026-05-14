import mongoose, { Schema, type Document, type Model } from "mongoose";
import { LogisticsStatus } from "@/types";

export interface ILogistics extends Document {
  eventId: mongoose.Types.ObjectId;
  title: string;
  category: string;
  description: string;
  status: LogisticsStatus;
  assignedStaff?: string;
  deadline?: Date;
  createdBy: mongoose.Types.ObjectId;
}

const LogisticsSchema = new Schema<ILogistics>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    assignedStaff: String,
    deadline: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Logistics: Model<ILogistics> = mongoose.models.Logistics || mongoose.model<ILogistics>("Logistics", LogisticsSchema);

export default Logistics;
