import express from "express";
import {
  adminLogin, getAdminInfo, updateAdminInfo,
  getUserStats, getUsers, banUser, unbanUser,
  getReports, deleteReport,
  createCategory, getAllCategories, updateCategory, deleteCategory,
  getPostsStats, getAllOffers, getAllRequests
} from "../controllers/adminController";

import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = express.Router();

// Public
router.post("/login", adminLogin);

// Protected
router.use(adminAuthMiddleware);

// Admin info
router.get("/me", getAdminInfo);
router.patch("/me", updateAdminInfo);

// Users
router.get("/users", getUsers);
router.patch("/user/:userId/ban", banUser);
router.patch("/user/:userId/unban", unbanUser);

// Reports
router.get("/reports", getReports);
router.delete("/reports/:id", deleteReport);

// Categories CRUD
router.post("/category", createCategory);
router.get("/categories", getAllCategories);
router.patch("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

// Posts & offers/requests
router.get("/stats/posts", getPostsStats);
router.get("/offers", getAllOffers);
router.get("/requests", getAllRequests);

router.get("/stats/users", getUserStats);


export default router;
