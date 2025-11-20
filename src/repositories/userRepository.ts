// src/repositories/userRepository.ts
import prisma from "../prisma";

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async createUser(data: { email: string; password: string; name: string }) {
    return prisma.user.create({ data });
  },

  async updateUser(id: string, data: { name?: string; email?: string; password?: string }) {
    return prisma.user.update({ where: { id }, data });
  },

  // 🔍 Search & Pagination
  async searchUsers(params: { search?: string; skip: number; take: number }) {
    const { search, skip, take } = params;

    return prisma.user.findMany({
      where: search
        ? {
            name: { contains: search, mode: "insensitive" },
          }
        : {},
      skip,
      take,
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async countUsers(search?: string) {
    return prisma.user.count({
      where: search
        ? { name: { contains: search, mode: "insensitive" } }
        : {},
    });
  },

  // ⭐ NEW: FULL USER PROFILE (offers + ratings)
  // src/repositories/userRepository.ts

async getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      createdAt: true,

      // Service offers
      offers: {
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
        },
      },

      // Service requests
      requests: {
        select: {
          id: true,
          description: true,
          createdAt: true,
        },
      },

      // Ratings received as provider
      ratings: {
        select: {
          id: true,
          stars: true,
          createdAt: true,
        },
      },
    },
  });
}

};
