import express from "express";
import { searchUsers, getUserProfile, getMe, updateUserProfile, updatePresence } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", searchUsers);

// Protected routes - MUST come BEFORE /:userId
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateUserProfile);
router.post("/me/presence", authMiddleware, updatePresence);

// Public routes
router.get("/:userId", getUserProfile);

export default router;
