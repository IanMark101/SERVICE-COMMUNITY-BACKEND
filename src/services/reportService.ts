// src/services/reportService.ts
import { reportRepository } from "../repositories/reportRepository";

export const reportService = {
  async createReport(reporterId: string, reportedId: string, reason: string) {
    if (!reportedId || !reason) {
      throw new Error("Reported user and reason are required");
    }

    if (reporterId === reportedId) {
      throw new Error("You cannot report yourself");
    }

    const reportedUser = await reportRepository.findUserById(reportedId);
    if (!reportedUser) {
      throw new Error("Reported user not found");
    }

    return reportRepository.create(reporterId, reportedId, reason);
  },

  async getAllReports() {
    const reports = await reportRepository.getAll();
    return { totalReports: reports.length, reports };
  },

  // ✅ DELETE REPORT
  async deleteReport(reportId: string) {
    const existing = await reportRepository.findById(reportId);
    if (!existing) {
      throw new Error("Report not found");
    }

    return reportRepository.delete(reportId);
  }
};
