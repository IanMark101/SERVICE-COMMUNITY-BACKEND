import { Request, Response } from "express";
import { suggestionService } from "../services/suggestionService";

// User submits a suggestion
export const submitSuggestion = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title, description } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const suggestion = await suggestionService.submitSuggestion(
      userId,
      title,
      description
    );

    return res.status(201).json({
      message: "Suggestion submitted successfully",
      suggestion,
    });
  } catch (error: any) {
    console.error("Submit suggestion error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// User gets their own suggestions
export const getUserSuggestions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const suggestions = await suggestionService.getUserSuggestions(userId);

    return res.json({
      message: "User suggestions retrieved",
      suggestions,
    });
  } catch (error: any) {
    console.error("Get user suggestions error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin gets all pending suggestions
export const getPendingSuggestions = async (req: Request, res: Response) => {
  try {
    const suggestions = await suggestionService.getPendingSuggestions();

    return res.json({
      message: "Pending suggestions retrieved",
      suggestions,
    });
  } catch (error: any) {
    console.error("Get pending suggestions error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin gets all suggestions (with optional status filter)
export const getAllSuggestions = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const suggestions = await suggestionService.getAllSuggestions(
      status as string
    );

    return res.json({
      message: "All suggestions retrieved",
      suggestions,
    });
  } catch (error: any) {
    console.error("Get all suggestions error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin approves a suggestion
export const approveSuggestion = async (req: Request, res: Response) => {
  try {
    const { suggestionId } = req.params;

    if (!suggestionId) {
      return res.status(400).json({ message: "Suggestion ID is required" });
    }

    const result = await suggestionService.approveSuggestion(suggestionId);

    return res.json({
      message: "Suggestion approved and service category created",
      suggestion: result.suggestion,
      category: result.category,
    });
  } catch (error: any) {
    console.error("Approve suggestion error:", error);
    const status = error.message.includes("not found") ? 404 : 400;
    return res.status(status).json({ message: error.message });
  }
};

// Admin rejects a suggestion
export const rejectSuggestion = async (req: Request, res: Response) => {
  try {
    const { suggestionId } = req.params;

    if (!suggestionId) {
      return res.status(400).json({ message: "Suggestion ID is required" });
    }

    const suggestion = await suggestionService.rejectSuggestion(suggestionId);

    return res.json({
      message: "Suggestion rejected",
      suggestion,
    });
  } catch (error: any) {
    console.error("Reject suggestion error:", error);
    const status = error.message.includes("not found") ? 404 : 400;
    return res.status(status).json({ message: error.message });
  }
};

// Admin deletes a suggestion
export const deleteSuggestion = async (req: Request, res: Response) => {
  try {
    const { suggestionId } = req.params;

    if (!suggestionId) {
      return res.status(400).json({ message: "Suggestion ID is required" });
    }

    await suggestionService.deleteSuggestion(suggestionId);

    return res.json({
      message: "Suggestion deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete suggestion error:", error);
    const status = error.message.includes("not found") ? 404 : 400;
    return res.status(status).json({ message: error.message });
  }
};
