import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "../services/emailService";
import { findUserByEmail } from "../repositories/userRepository";
import {
  findUserByResetToken,
  updateUserResetToken,
  updateUserPassword,
} from "../repositories/passwordRepository";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(200).json({ message: "If email exists, reset link sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const exp = new Date(Date.now() + 60 * 60 * 1000);

    await updateUserResetToken(user.id, token, exp);
    await sendPasswordResetEmail(email, token);

    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await updateUserPassword(user.id, hashedPassword);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};