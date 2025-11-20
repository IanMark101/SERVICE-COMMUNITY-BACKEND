// src/controllers/reportController.ts
import { Request, Response } from "express";
import { reportService } from "../services/reportService";

export const createReport = async (req: Request, res: Response) => {
  try {
    const reporterId = (req as any).userId;
    const { reportedId, reason } = req.body;

    const report = await reportService.createReport(reporterId, reportedId, reason);
    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error: any) {
    console.error("CreateReport error:", error);
    res.status(400).json({ message: error.message || "Server error" });
  }
};

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const result = await reportService.getAllReports();
    res.json(result);
  } catch (error) {
    console.error("GetAllReports error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
