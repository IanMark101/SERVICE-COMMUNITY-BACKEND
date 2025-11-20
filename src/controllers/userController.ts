// src/controllers/userController.ts
import { Request, Response } from "express";
import { userService } from "../services/userService";

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const data = await userService.searchUsers(search, page, limit);
    res.json(data);
  } catch (error) {
    console.error("User search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profile = await userService.getUserProfile(userId);
    if (!profile) return res.status(404).json({ message: "User not found" });

    res.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
