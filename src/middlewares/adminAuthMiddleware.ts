// src/middlewares/adminAuthMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decode token
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId?: string };

    if (!decoded?.adminId) {
      return res.status(403).json({ message: "Forbidden: Invalid admin token" });
    }

    // Check if admin exists in DB
    const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } });
    if (!admin) {
      return res.status(403).json({ message: "Forbidden: Admin not found" });
    }

    // Attach adminId to request for controllers
    (req as any).adminId = admin.id;

    next();
  } catch (error) {
    console.error("Admin JWT verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
