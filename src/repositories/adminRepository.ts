import prisma from "../prisma";

// Handles all user-related database actions for admin
export const adminRepository = {
  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async banUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: { banned: true },
    });
  },

  async unbanUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: { banned: false },
    });
  },

  async deactivateUserContent(userId: string) {
    await prisma.serviceOffer.updateMany({
      where: { userId },
      data: { active: false },
    });
    await prisma.serviceRequest.updateMany({
      where: { userId },
      data: { active: false },
    });
  },

  async restoreUserContent(userId: string) {
    await prisma.serviceOffer.updateMany({
      where: { userId },
      data: { active: true },
    });
    await prisma.serviceRequest.updateMany({
      where: { userId },
      data: { active: true },
    });
  },

  async getAllUsers(filter?: { banned?: boolean }) {
    const whereClause = filter?.banned !== undefined ? { banned: filter.banned } : {};
    return prisma.user.findMany({
      where: whereClause,
      select: { id: true, name: true, email: true, banned: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getReports() {
    return prisma.report.findMany({
      include: {
        reporter: { select: { id: true, name: true, email: true, banned: true } },
        reported: { select: { id: true, name: true, email: true, banned: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getUserStats(days: number) {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);
    return prisma.user.count({ where: { createdAt: { gte: dateFrom } } });
  },

  async getPostsStats() {
    const totalOffers = await prisma.serviceOffer.count();
    const totalRequests = await prisma.serviceRequest.count();
    return { totalOffers, totalRequests };
  },

  async createCategory(name: string) {
    return prisma.serviceCategory.create({ data: { name } });
  },

  // -----------------------
  // Admin own info
  // -----------------------
  findAdminById(adminId: string) {
    return prisma.admin.findUnique({ where: { id: adminId } });
  },

  updateAdmin(adminId: string, data: Partial<{ name: string; email: string; password: string }>) {
    return prisma.admin.update({ where: { id: adminId }, data });
  },
};
