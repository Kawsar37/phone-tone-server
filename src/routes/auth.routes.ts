import { Router } from "express";
import { verifyToken } from "@/middlewares/auth";
import { getMe, login, logout, register } from "@/controllers/auth.controller";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

export default router;
