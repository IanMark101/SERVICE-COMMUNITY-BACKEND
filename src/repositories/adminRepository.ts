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
    // Total users by status
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { banned: false } });
    const bannedUsers = await prisma.user.count({ where: { banned: true } });

    // New users per day (last X days)
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const newUsersData = await prisma.user.findMany({
      where: { createdAt: { gte: dateFrom } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Format the data for bar chart
    const chartData: { [key: string]: number } = {};
    newUsersData.forEach((user) => {
      const date = new Date(user.createdAt).toISOString().split('T')[0];
      chartData[date] = (chartData[date] || 0) + 1;
    });

    const newUsersPerDay = Object.entries(chartData).map(([date, count]) => ({
      date,
      count,
    }));

    return {
      summary: { totalUsers, activeUsers, bannedUsers },
      newUsersPerDay,
    };
  },

  async getPostsStats() {
    const totalOffers = await prisma.serviceOffer.count();
    const totalRequests = await prisma.serviceRequest.count();
    return { totalOffers, totalRequests };
  },

  async createCategory(name: string) {
    return prisma.serviceCategory.create({ data: { name } });
  },

  async getAllCategories() {
    return prisma.serviceCategory.findMany({ orderBy: { createdAt: "desc" } });
  },

  async updateCategory(id: string, name: string) {
    return prisma.serviceCategory.update({
      where: { id },
      data: { name },
    });
  },

  async deleteCategory(id: string) {
    return prisma.serviceCategory.delete({ where: { id } });
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
