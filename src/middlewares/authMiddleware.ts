import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma"; // ensure this path matches your project
import { userRepository } from "../repositories/userRepository";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // token has { userId, type: "user" }
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      type?: string;
    };

    (req as any).userId = decoded.userId;

    // check if the user is banned on every protected request
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { banned: true, isOnline: true },
    });

    if (!user || user.banned) {
      return res.status(403).json({ message: "Your account is banned" });
    }

    if (user.isOnline) {
      await userRepository.touchLastSeen(decoded.userId);
    }

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};