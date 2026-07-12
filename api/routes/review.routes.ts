import { Router } from "express";
import { addReview, getReviews } from "../controllers/review.controller";
import { verifyToken } from "../middlewares/auth";

const router = Router();

router.get("/:phoneId", getReviews);
router.post("/", verifyToken, addReview);

export default router;
