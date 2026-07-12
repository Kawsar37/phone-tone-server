import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from "../controllers/order.controller";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

router.use(verifyToken);

router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/:orderId", getOrderById);

router.get("/", authorizeRoles("admin"), getAllOrders);
router.patch("/:orderId/status", authorizeRoles("admin"), updateOrderStatus);

export default router;
