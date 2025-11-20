import express from "express";
import {
  adminLogin,
  getAdminInfo,
  updateAdminInfo,
  getUserStats,
  getUsers,
  getReports,
  banUser,
  unbanUser,
  createCategory,
  getPostsStats,
} from "../controllers/adminController";

import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = express.Router();

// ---------------------------
// Public route: Admin login
// ---------------------------
router.post("/login", adminLogin);

// ---------------------------
// Protected routes: Admin only
// ---------------------------
router.use(adminAuthMiddleware);

// Get current logged-in admin info
router.get("/me", getAdminInfo);

// Update current admin info
router.patch("/me", updateAdminInfo);

// Get total users in last X days (query param: days)
router.get("/stats/users", getUserStats);

// Get all users (optional filter: ?banned=true)
router.get("/users", getUsers);

// Get all pending reports with reporter & reported info
router.get("/reports", getReports);

// Ban a user by ID
router.patch("/user/:userId/ban", banUser);

// Unban a user by ID
router.patch("/user/:userId/unban", unbanUser);

// Create a new service category
router.post("/category", createCategory);

// Get total posted offers & requests
router.get("/stats/posts", getPostsStats);

export default router;
