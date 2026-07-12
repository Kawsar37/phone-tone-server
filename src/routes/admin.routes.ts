import { Router } from "express";
import {
  getDashboardStats,
  getMonthlyOrders,
} from "../controllers/admin.controller";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

router.use(verifyToken);
router.use(authorizeRoles("admin"));

router.get("/stats", getDashboardStats);
router.get("/monthly-orders", getMonthlyOrders);

export default router;
