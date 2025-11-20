import { serviceRepository } from "../repositories/serviceRepository";

export const serviceService = {
  // Categories
  getCategories() {
    return serviceRepository.getAllCategories();
  },

  // Offers
  async createOffer(userId: string, title: string, description: string, categoryId: string) {
    return serviceRepository.createOffer({ title, description, categoryId, userId });
  },

  async getOffersByCategory(categoryId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const offers = await serviceRepository.getOffersByCategory(categoryId);

    const offersWithAvgRating = offers.map((offer) => {
      const totalStars = offer.ratings.reduce((sum, r) => sum + r.stars, 0);
      const avgRating = offer.ratings.length ? parseFloat((totalStars / offer.ratings.length).toFixed(2)) : 0;
      return { ...offer, avgRating };
    });

    const sortedOffers = offersWithAvgRating.sort((a, b) => b.avgRating - a.avgRating);

    const paginatedOffers = sortedOffers.slice(skip, skip + limit);
    const totalPages = Math.ceil(sortedOffers.length / limit);

    return { page, totalPages, totalOffers: sortedOffers.length, offers: paginatedOffers };
  },

  async updateOffer(userId: string, offerId: string, data: Partial<{ title: string; description: string; categoryId: string }>) {
    const offer = await serviceRepository.findOfferById(offerId);
    if (!offer) throw new Error("Service offer not found");
    if (offer.userId !== userId) throw new Error("Forbidden");

    return serviceRepository.updateOffer(offerId, data);
  },

  async deleteOffer(userId: string, offerId: string) {
    const offer = await serviceRepository.findOfferById(offerId);
    if (!offer) throw new Error("Service offer not found");
    if (offer.userId !== userId) throw new Error("Forbidden");

    return serviceRepository.deleteOffer(offerId);
  },

  // Requests
  async createRequest(userId: string, description: string) {
    return serviceRepository.createRequest({ description, userId });
  },

  async getRequests(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const requests = await serviceRepository.getRequests(skip, limit);
    const totalRequests = await serviceRepository.countRequests();
    const totalPages = Math.ceil(totalRequests / limit);

    return { page, totalPages, totalRequests, requests };
  },

  async updateRequest(userId: string, requestId: string, description: string) {
    const request = await serviceRepository.findRequestById(requestId);
    if (!request) throw new Error("Service request not found");
    if (request.userId !== userId) throw new Error("Forbidden");

    return serviceRepository.updateRequest(requestId, { description });
  },

  async deleteRequest(userId: string, requestId: string) {
    const request = await serviceRepository.findRequestById(requestId);
    if (!request) throw new Error("Service request not found");
    if (request.userId !== userId) throw new Error("Forbidden");

    return serviceRepository.deleteRequest(requestId);
  },

  // Ratings
  async createRating(providerId: string, offerId: string, stars: number) {
    if (stars < 1 || stars > 5) throw new Error("Stars must be between 1 and 5");
    return serviceRepository.createRating({ providerId, offerId, stars });
  },
};
