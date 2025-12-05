// src/services/authService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authService = {
  async register(name: string, email: string, password: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser({ name, email, password: hashedPassword });

    return { id: user.id, email: user.email, name: user.name };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");
    if (user.banned) throw new Error("Your account is banned");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  },
};
