import mongoose, { Document, Schema } from "mongoose";
export interface IReview extends Document {
  phoneId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}
const ReviewSchema = new Schema<IReview>(
  {
    phoneId: { type: Schema.Types.ObjectId, ref: "Phone", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);
ReviewSchema.index({ phoneId: 1, userId: 1 }, { unique: true });
export const Review = mongoose.model<IReview>("Review", ReviewSchema);
