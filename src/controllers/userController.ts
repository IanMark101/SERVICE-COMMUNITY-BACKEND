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

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await userService.getMe(userId);
    res.json(user);
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : error.message === "User not found" ? 404 : 500;
    res.status(status).json({ message: error.message || "Server error" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, email, password, currentPassword } = req.body;

    if (!name && !email && !password) {
      return res.status(400).json({ message: "Provide at least one field to update" });
    }

    let updated;

    // If changing password, verify current password first
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password required to change password" });
      }
      updated = await userService.verifyAndChangePassword(userId, currentPassword, password);
    } else {
      updated = await userService.updateUserProfile(userId, { name, email, password });
    }

    res.json({
      message: "Profile updated",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        createdAt: updated.createdAt,
        banned: updated.banned,
      },
    });
  } catch (error: any) {
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(400).json({ message: "Email already in use" });
    }
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
