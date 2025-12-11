import { Request, Response } from "express";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { presenceTimeoutMinutes } from "../utils/presence";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await authService.register(name, email, password);
    res.status(201).json({ message: "User registered", user });
  } catch (error: any) {
    if (error.message === "Email already exists")
      return res.status(400).json({ message: error.message });
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password); // result.user

    // ✅ create a USER token here, different payload from admin
    const token = jwt.sign(
      { userId: result.user.id, type: "user" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      type: "user",
      token,
      user: result.user,
      presenceTimeoutMinutes,
    });
  } catch (error: any) {
    if (["Invalid credentials", "Your account is banned"].includes(error.message)) {
      const status = error.message === "Your account is banned" ? 403 : 400;
      return res.status(status).json({ message: error.message });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.json({ message: "Logout successful" });
    }

    await userService.updatePresence(userId, "offline");

    return res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};