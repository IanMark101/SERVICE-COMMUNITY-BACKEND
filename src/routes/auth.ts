import express from "express";
import { register, login } from "../controllers/authController";
import { googleLogin, googleCallback } from "../controllers/googleController";
import { forgotPassword, resetPassword } from "../controllers/passwordController";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Google OAuth routes
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

// Forgot/Reset password routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
