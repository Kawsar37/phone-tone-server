import { Request, Response } from "express";
import { Review } from "../models/Review";
import { Phone } from "../models/Phone";
import { AuthRequest } from "../middlewares/auth";

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { phoneId, rating, comment } = req.body;

    if (!phoneId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Phone ID, rating, and comment are required.",
      });
    }

    const existingReview = await Review.findOne({ userId, phoneId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this phone.",
      });
    }

    await Review.create({ userId, phoneId, rating, comment });

    const reviews = await Review.find({ phoneId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

    await Phone.findByIdAndUpdate(phoneId, { rating: averageRating });

    res.status(201).json({
      success: true,
      message: "Review added successfully!",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { phoneId } = req.params;

    const reviews = await Review.find({ phoneId })
      .populate("userId", "name photoURL")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
      count: reviews.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
