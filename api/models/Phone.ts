import mongoose, { Document, Schema } from "mongoose";

export interface IPhone extends Document {
  name: string;
  slug: string;
  brand: string;
  images: string[];
  shortDescription: string;
  description: string;
  price: number;
  operatingSystem: string;
  processor: string;
  chipset: string;
  gpu: string;
  ram: string;
  storage: string;
  display: {
    type: string;
    size: string;
    resolution: string;
    refreshRate: string;
  };
  battery: { capacity: string; charging: string };
  camera: { rear: string; front: string };
  connectivity: {
    network: string;
    wifi: string;
    bluetooth: string;
    nfc: string;
  };
  colors: string[];
  releaseDate: Date;
  rating: number;
  stock: number;
  createdBy: mongoose.Types.ObjectId;
}

const PhoneSchema = new Schema<IPhone>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    images: [{ type: String, required: true }],
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    operatingSystem: String,
    processor: String,
    chipset: String,
    gpu: String,
    ram: String,
    storage: String,
    display: {
      type: { type: String },
      size: String,
      resolution: String,
      refreshRate: String,
    },
    battery: { capacity: String, charging: String },
    camera: { rear: String, front: String },
    connectivity: {
      network: String,
      wifi: String,
      bluetooth: String,
      nfc: String,
    },
    colors: [String],
    releaseDate: Date,
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Phone = mongoose.model<IPhone>("Phone", PhoneSchema);
