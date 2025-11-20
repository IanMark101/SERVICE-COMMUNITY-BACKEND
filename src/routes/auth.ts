import express from "express";
import { register, login, getMe, updateMe } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);

export default router;
