import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as serviceController from "../controllers/serviceController";

const router = express.Router();

// Categories
router.get("/categories", serviceController.getCategories);

// Offers
router.get("/offers/:categoryId", serviceController.getOffersByCategory);
router.post("/offer", authMiddleware, serviceController.createOffer);
router.patch("/offer/:offerId", authMiddleware, serviceController.updateOffer);
router.delete("/offer/:offerId", authMiddleware, serviceController.deleteOffer);

// Requests
router.post("/request", authMiddleware, serviceController.createRequest);
router.get("/requests", serviceController.getRequests);
router.patch("/request/:requestId", authMiddleware, serviceController.updateRequest);
router.delete("/request/:requestId", authMiddleware, serviceController.deleteRequest);

// Ratings
router.post("/rate", authMiddleware, serviceController.createRating);

export default router;
