import express from "express";
import { searchUsers, getUserProfile, getMe, updateUserProfile } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", searchUsers);

// Protected routes - MUST come BEFORE /:userId
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateUserProfile);

// Public routes
router.get("/:userId", getUserProfile);

export default router;
