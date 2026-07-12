import { Request, Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middlewares/auth";

// 1. Get All Users (Admin Only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Exclude password from the response
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Block / Unblock User (Admin Only)
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // "active" or "blocked"

    if (status !== "active" && status !== "blocked") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status." });
    }

    // Prevent admin from blocking themselves
    if (req.user!.id === userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot change your own status.",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true },
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: `User ${status === "blocked" ? "blocked" : "unblocked"} successfully.`,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
