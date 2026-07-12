import { Router } from "express";
import { getAllUsers, updateUserStatus } from "../controllers/user.controller";
import { verifyToken, authorizeRoles } from "../middlewares/auth";

const router = Router();

router.use(verifyToken);
router.use(authorizeRoles("admin"));

router.get("/", getAllUsers);
router.patch("/:userId/status", updateUserStatus);

export default router;
