// src/controllers/authController.ts
import { Request, Response } from "express";
import { authService } from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await authService.register(name, email, password);
    res.status(201).json({ message: "User registered", user });
  } catch (error: any) {
    if (error.message === "Email already exists") return res.status(400).json({ message: error.message });
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ message: "Login successful", ...result });
  } catch (error: any) {
    if (["Invalid credentials", "Your account is banned"].includes(error.message))
      return res.status(error.message === "Your account is banned" ? 403 : 400).json({ message: error.message });
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await authService.getMe(userId);
    res.json(user);
  } catch (error: any) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, email, password } = req.body;

    const updatedUser = await authService.updateMe(userId, { name, email, password });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(400).json({ message: "Email already in use" });
    }
    console.error("UpdateMe error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
