import { Router } from "express";
import {
  addPhone,
  getPhones,
  getPhoneById,
  deletePhone,
} from "../controllers/phone.controller";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

router.get("/", getPhones);
router.get("/:id", getPhoneById);
router.post("/", verifyToken, authorizeRoles("admin"), addPhone);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deletePhone);

export default router;
