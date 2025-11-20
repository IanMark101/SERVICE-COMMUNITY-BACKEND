// src/services/userService.ts
import { userRepository } from "../repositories/userRepository";

export const userService = {
  // 🔍 Search users
  async searchUsers(search: string | undefined, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const users = await userRepository.searchUsers({ search, skip, take: limit });
    const total = await userRepository.countUsers(search);

    return {
      page,
      totalPages: Math.ceil(total / limit),
      total,
      users,
    };
  },
  // 📌 Get user profile
  async getUserProfile(userId: string) {
    const user = await userRepository.getUserProfile(userId);
    if (!user) return null;
  
    const totalRatings = user.ratings.length;
  
    const averageRating =
      totalRatings > 0
        ? user.ratings.reduce((sum, r) => sum + r.stars, 0) / totalRatings
        : 0;
  
    return {
      ...user,
      totalRatings,
      averageRating: Number(averageRating.toFixed(2)),
    };
  }
};
