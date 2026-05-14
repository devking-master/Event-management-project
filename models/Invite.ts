import mongoose, { Schema, type Document, type Model } from "mongoose";
import { InviteStatus } from "@/types";

export interface IInvite extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  status: InviteStatus;
}

const InviteSchema = new Schema<IInvite>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  },
  { timestamps: true }
);

const Invite: Model<IInvite> = mongoose.models.Invite || mongoose.model<IInvite>("Invite", InviteSchema);

export default Invite;
