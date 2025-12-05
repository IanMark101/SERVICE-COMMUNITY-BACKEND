import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import * as serviceController from "../controllers/serviceController";

const router = express.Router();

// Categories
router.get("/categories", serviceController.getCategories);

// Offers
router.get("/offers/my-offers", authMiddleware, serviceController.getMyOffers);
router.get("/offers/:categoryId", serviceController.getOffersByCategory);
router.post("/offer", authMiddleware, serviceController.createOffer);
router.patch("/offer/:offerId", authMiddleware, serviceController.updateOffer);
router.delete("/offer/:offerId", authMiddleware, serviceController.deleteOffer);

// Requests
router.get("/requests/my-requests", authMiddleware, serviceController.getMyRequests);
router.post("/request", authMiddleware, serviceController.createRequest);
router.get("/requests", serviceController.getRequests);
router.get("/requests/category/:categoryId", serviceController.getRequestsByCategory);
router.patch("/request/:requestId", authMiddleware, serviceController.updateRequest);
router.delete("/request/:requestId", authMiddleware, serviceController.deleteRequest);

// Ratings
router.post("/rate", authMiddleware, serviceController.createRating);
router.get("/ratings/:userId", serviceController.getUserRatings);

// View specific user's offers
router.get("/offers/user/:userId", serviceController.getUserOffers);

// View specific user's requests
router.get("/requests/user/:userId", serviceController.getUserRequests);

export default router;
