import express from "express";
import {
  submitSuggestion,
  getUserSuggestions,
  getPendingSuggestions,
  getAllSuggestions,
  approveSuggestion,
  rejectSuggestion,
  deleteSuggestion,
} from "../controllers/suggestionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

// ============================================
// SUGGESTION ROUTES
// ============================================

const router = express.Router();

// ============================================
// USER ROUTES
// Protected by authMiddleware (requires user token)
// ============================================

/**
 * POST /api/suggestions/
 * Submit a new suggestion for a service category
 */
router.post("/", authMiddleware, submitSuggestion);

/**
 * GET /api/suggestions/my-suggestions
 * Get all suggestions submitted by the current user
 */
router.get("/my-suggestions", authMiddleware, getUserSuggestions);

// ============================================
// ADMIN ROUTES
// Protected by adminAuthMiddleware (requires admin token)
// ============================================

/**
 * GET /api/suggestions/pending
 * Get all pending suggestions waiting for approval
 */
router.get("/pending", adminAuthMiddleware, getPendingSuggestions);

/**
 * GET /api/suggestions/all?status=pending
 * Get all suggestions with optional status filter
 * Query params: status (pending, approved, rejected)
 */
router.get("/all", adminAuthMiddleware, getAllSuggestions);

/**
 * POST /api/suggestions/:suggestionId/approve
 * Approve a suggestion and automatically create a service category
 */
router.post("/:suggestionId/approve", adminAuthMiddleware, approveSuggestion);

/**
 * POST /api/suggestions/:suggestionId/reject
 * Reject a suggestion (prevents category creation)
 */
router.post("/:suggestionId/reject", adminAuthMiddleware, rejectSuggestion);

/**
 * DELETE /api/suggestions/:suggestionId
 * Delete a suggestion
 * If approved: also deletes the created service category and its offers/requests
 * If pending/rejected: only deletes the suggestion
 */
router.delete("/:suggestionId", adminAuthMiddleware, deleteSuggestion);

export default router;
