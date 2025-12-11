// src/services/userService.ts
import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/userRepository";
import { normalizePresence } from "../utils/presence";

export const userService = {
  async searchUsers(search: string | undefined, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      userRepository.searchUsers({ search, skip, take: limit }),
      userRepository.countUsers(search),
    ]);

    return {
      page,
      totalPages: Math.ceil(total / limit),
      total,
      users: users.map((user) => normalizePresence(user)),
    };
  },

  async getUserProfile(userId: string) {
    const profile = await userRepository.getUserProfile(userId);
    return normalizePresence(profile);
  },

  async getMe(userId: string | undefined) {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const hydrated = normalizePresence(user);

    return {
      id: hydrated.id,
      name: hydrated.name,
      email: hydrated.email,
      createdAt: hydrated.createdAt,
      isOnline: hydrated.isOnline,
      lastSeenAt: hydrated.lastSeenAt,
    };
  },

  async verifyAndChangePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      const err: any = new Error("Current password is incorrect");
      err.status = 400;
      throw err;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    return userRepository.updateUser(userId, { password: hashed });
  },

  async updateUserProfile(userId: string, data: { name?: string; email?: string; password?: string }) {
    const existing = await userRepository.findById(userId);
    if (!existing) throw new Error("User not found");

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

    return userRepository.updateUser(userId, updateData);
  },

  async updatePresence(userId: string, status: "online" | "offline") {
    const presence = status === "online"
      ? await userRepository.markUserOnline(userId)
      : await userRepository.markUserOffline(userId);

    return normalizePresence(presence);
  },

  async heartbeat(userId: string) {
    const presence = await userRepository.touchLastSeen(userId);
    return normalizePresence(presence);
  },
};
