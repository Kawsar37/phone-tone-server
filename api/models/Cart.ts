import mongoose, { Document, Schema } from "mongoose";
export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  phoneId: mongoose.Types.ObjectId;
  quantity: number;
}
const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    phoneId: { type: Schema.Types.ObjectId, ref: "Phone", required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
  },
  { timestamps: true },
);
CartSchema.index({ userId: 1, phoneId: 1 }, { unique: true });
export const Cart = mongoose.model<ICart>("Cart", CartSchema);
