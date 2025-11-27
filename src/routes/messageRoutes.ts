import { Router } from "express";
import { messageController } from "../controllers/messageController";

const router = Router();

// Send a new message
router.post("/send", messageController.sendMessage);

// Get messages between two users
router.get("/between", messageController.getMessages);

export default router;
