import { adminRepository } from "../repositories/adminRepository";
import bcrypt from "bcryptjs";

export const adminService = {
  async banUser(userId: string) {
    const user = await adminRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    await adminRepository.banUser(userId);
    await adminRepository.deactivateUserContent(userId);

    return { message: "User banned successfully" };
  },

  async unbanUser(userId: string) {
    const user = await adminRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    await adminRepository.unbanUser(userId);
    await adminRepository.restoreUserContent(userId);

    return { message: "User unbanned successfully, services restored" };
  },

  async getAllUsers(filter?: { banned?: boolean }) {
    return adminRepository.getAllUsers(filter);
  },

  async getReports() {
    return adminRepository.getReports();
  },

  async getUserStats(days: number) {
    return adminRepository.getUserStats(days);
  },

  async getPostsStats() {
    return adminRepository.getPostsStats();
  },

  async createCategory(name: string) {
    return adminRepository.createCategory(name);
  },

  // -----------------------
  // Admin own info
  // -----------------------
  async updateAdminInfo(adminId: string, data: Partial<{ name: string; email: string; password: string }>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return adminRepository.updateAdmin(adminId, data);
  },
};
