// src/repositories/reportRepository.ts
import prisma from "../prisma";

export const reportRepository = {
  async create(reporterId: string, reportedId: string, reason: string) {
    return prisma.report.create({
      data: { reporterId, reportedId, reason },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        reported: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async getAll() {
    return prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        reported: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async findUserById(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } });
  },

  // 🔍 Find a report by ID
  async findById(id: string) {
    return prisma.report.findUnique({
      where: { id },
    });
  },

  // ❌ Delete a report
  async delete(id: string) {
    return prisma.report.delete({
      where: { id },
    });
  }
};
