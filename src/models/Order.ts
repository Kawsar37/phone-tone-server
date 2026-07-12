import mongoose, { Document, Schema } from "mongoose";
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: {
    phoneId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: "cod" | "bkash";
  paymentStatus: "pending" | "paid";
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    fullName: string;
    phone: string;
    district: string;
    area: string;
    address: string;
  };
}
const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        phoneId: { type: Schema.Types.ObjectId, ref: "Phone", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "bkash"], default: "cod" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      district: String,
      area: String,
      address: String,
    },
  },
  { timestamps: true },
);
export const Order = mongoose.model<IOrder>("Order", OrderSchema);
