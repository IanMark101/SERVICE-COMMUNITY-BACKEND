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
  async createRequest(userId: string, description: string, categoryId: string) {
    return serviceRepository.createRequest({ description, userId, categoryId });
  },

  async getRequests(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const requests = await serviceRepository.getRequests(skip, limit);
    const totalRequests = await serviceRepository.countRequests();
    const totalPages = Math.ceil(totalRequests / limit);

    return { page, totalPages, totalRequests, requests };
  },

  async getRequestsByCategory(categoryId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const requests = await serviceRepository.getRequestsByCategory(categoryId, skip, limit);
    const total = await serviceRepository.countRequestsByCategory(categoryId);
    const totalPages = Math.ceil(total / limit);

    return { page, totalPages, totalRequests: total, requests };
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

  async getMyOffers(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const offers = await serviceRepository.getOffersByUserId(userId, skip, limit);
    const total = await serviceRepository.countOffersByUserId(userId);

    const offersWithAvgRating = offers.map((offer: any) => {
      const totalStars = offer.ratings.reduce((sum: number, r: any) => sum + r.stars, 0);
      const avgRating = offer.ratings.length ? parseFloat((totalStars / offer.ratings.length).toFixed(2)) : 0;
      return { ...offer, avgRating };
    });

    return {
      page,
      totalPages: Math.ceil(total / limit),
      total,
      offers: offersWithAvgRating,
    };
  },

  async getMyRequests(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const requests = await serviceRepository.getRequestsByUserId(userId, skip, limit);
    const total = await serviceRepository.countRequestsByUserId(userId);

    return {
      page,
      totalPages: Math.ceil(total / limit),
      total,
      requests,
    };
  },

  async getUserRatings(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const ratings = await serviceRepository.getRatingsByUserId(userId, skip, limit);
    const total = await serviceRepository.countRatingsByUserId(userId);

    const avgRating = ratings.length
      ? parseFloat((ratings.reduce((sum: number, r: any) => sum + r.stars, 0) / ratings.length).toFixed(2))
      : 0;

    return {
      page,
      totalPages: Math.ceil(total / limit),
      total,
      avgRating,
      ratings,
    };
  },

  async getUserOffers(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const offers = await serviceRepository.getOffersByUserId(userId, skip, limit);
    const total = await serviceRepository.countOffersByUserId(userId);

    const offersWithAvgRating = offers.map((offer: any) => {
      const totalStars = offer.ratings.reduce((sum: number, r: any) => sum + r.stars, 0);
      const avgRating = offer.ratings.length ? parseFloat((totalStars / offer.ratings.length).toFixed(2)) : 0;
      return { ...offer, avgRating };
    });

    return {
      page,
      totalPages: Math.ceil(total / limit),
      total,
      offers: offersWithAvgRating,
    };
  },

  async getUserRequests(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const requests = await serviceRepository.getRequestsByUserId(userId, skip, limit);
    const total = await serviceRepository.countRequestsByUserId(userId);

    return {
      page,
      totalPages: Math.ceil(total / limit),
      total,
      requests,
    };
  },
};
