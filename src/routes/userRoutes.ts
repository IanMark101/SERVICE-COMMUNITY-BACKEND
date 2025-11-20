import express from "express";
import { searchUsers, getUserProfile } from "../controllers/userController";

const router = express.Router();

router.get("/", searchUsers);
router.get("/:userId", getUserProfile);

export default router;
