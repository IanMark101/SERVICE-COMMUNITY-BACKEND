import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { adminService } from "../services/adminService";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Admin login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current admin info
export const getAdminInfo = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).adminId;
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------
// Admin update own info
// -----------------------
export const updateAdminInfo = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).adminId;
    const { name, email, password } = req.body;

    const updatedAdmin = await adminService.updateAdminInfo(adminId, { name, email, password });

    res.json({
      message: "Admin info updated successfully",
      admin: { id: updatedAdmin.id, name: updatedAdmin.name, email: updatedAdmin.email },
    });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// User stats
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const totalUsers = await adminService.getUserStats(days);
    res.json({ totalUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const banned = req.query.banned !== undefined ? req.query.banned === "true" : undefined;
    const users = await adminService.getAllUsers({ banned });
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reports
export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await adminService.getReports();
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Ban a user
export const banUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await adminService.banUser(userId);
    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Unban a user
export const unbanUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await adminService.unbanUser(userId);
    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    const category = await adminService.createCategory(name);
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get posts stats
export const getPostsStats = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getPostsStats();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
