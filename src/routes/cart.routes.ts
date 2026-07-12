import { Router } from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../controllers/cart.controller";
import { verifyToken } from "../middlewares/auth";

const router = Router();

// All cart routes require authentication
router.use(verifyToken);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:cartItemId", removeFromCart);
router.patch("/:cartItemId", updateCartQuantity);
router.delete("/", clearCart);

export default router;
