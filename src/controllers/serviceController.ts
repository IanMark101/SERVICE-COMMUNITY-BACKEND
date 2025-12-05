import { Request, Response } from "express";
import { serviceService } from "../services/serviceService";

// Categories
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await serviceService.getCategories();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Offers
export const getOffersByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await serviceService.getOffersByCategory(categoryId, page, limit);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createOffer = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title, description, categoryId } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !description || !categoryId) return res.status(400).json({ message: "All fields required" });

    const offer = await serviceService.createOffer(userId, title, description, categoryId);
    res.status(201).json({ message: "Offer created", offer });
  } catch (error: any) {
    console.error("Create offer error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const updateOffer = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { offerId } = req.params;
    const { title, description, categoryId } = req.body;

    const updatedOffer = await serviceService.updateOffer(userId, offerId, { title, description, categoryId });
    res.json({ message: "Service offer updated", offer: updatedOffer });
  } catch (error: any) {
    console.error(error);
    res.status(403).json({ message: error.message });
  }
};

export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { offerId } = req.params;

    await serviceService.deleteOffer(userId, offerId);
    res.json({ message: "Service offer deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(403).json({ message: error.message });
  }
};

// Requests
export const createRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { description, categoryId } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!description || !categoryId) return res.status(400).json({ message: "Description and categoryId required" });

    const request = await serviceService.createRequest(userId, description, categoryId);
    res.status(201).json({ message: "Request created", request });
  } catch (error: any) {
    console.error("Create request error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await serviceService.getRequests(page, limit);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getRequestsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await serviceService.getRequestsByCategory(categoryId, page, limit);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { requestId } = req.params;
    const { description } = req.body;

    const updatedRequest = await serviceService.updateRequest(userId, requestId, description);
    res.json({ message: "Service request updated", request: updatedRequest });
  } catch (error: any) {
    console.error(error);
    res.status(403).json({ message: error.message });
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { requestId } = req.params;

    await serviceService.deleteRequest(userId, requestId);
    res.json({ message: "Service request deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res.status(403).json({ message: error.message });
  }
};

// Ratings
export const createRating = async (req: Request, res: Response) => {
  try {
    const providerId = (req as any).userId;
    const { offerId, stars } = req.body;

    const rating = await serviceService.createRating(providerId, offerId, stars);
    res.status(201).json({ message: "Rating submitted", rating });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getMyOffers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await serviceService.getMyOffers(userId, page, limit);
    res.json(data);
  } catch (error) {
    console.error("Get my offers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await serviceService.getMyRequests(userId, page, limit);
    res.json(data);
  } catch (error) {
    console.error("Get my requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserRatings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await serviceService.getUserRatings(userId, page, limit);
    res.json(data);
  } catch (error) {
    console.error("Get user ratings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserOffers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await serviceService.getUserOffers(userId, page, limit);
    res.json(data);
  } catch (error) {
    console.error("Get user offers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserRequests = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await serviceService.getUserRequests(userId, page, limit);
    res.json(data);
  } catch (error) {
    console.error("Get user requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
