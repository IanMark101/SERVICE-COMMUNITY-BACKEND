// src/routes/reportRoutes.ts
import express from "express";
import { createReport, getAllReports } from "../controllers/reportController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const router = express.Router();

// Authenticated users can report
router.post("/", authMiddleware, createReport);

// Admin can view all reports
router.get("/", adminAuthMiddleware, getAllReports);

export default router;
