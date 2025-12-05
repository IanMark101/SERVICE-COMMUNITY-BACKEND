import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { messageController } from "../controllers/messageController";

const router = Router();

// Send a new message (Protected)
router.post("/send", authMiddleware, messageController.sendMessage);

// Get messages between two users (Protected)
router.get("/between", authMiddleware, messageController.getMessages);

// Get all conversations (Protected)
router.get("/conversations", authMiddleware, messageController.getConversations);

export default router;
