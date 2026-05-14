import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IMerchandise extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  stock: number;
  sold: number;
}

const MerchandiseSchema = new Schema<IMerchandise>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Merchandise: Model<IMerchandise> = mongoose.models.Merchandise || mongoose.model<IMerchandise>("Merchandise", MerchandiseSchema);

export default Merchandise;
