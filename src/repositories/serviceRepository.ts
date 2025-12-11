import prisma from "../prisma";

export const serviceRepository = {
  // Categories
  getAllCategories() {
    return prisma.serviceCategory.findMany();
  },

  findCategoryByName(name: string) {
    return prisma.serviceCategory.findUnique({ where: { name } });
  },

  createCategory(data: { name: string }) {
    return prisma.serviceCategory.create({ data });
  },

  deleteCategory(categoryId: string) {
    return prisma.serviceCategory.delete({ where: { id: categoryId } });
  },

  deleteOffersByCategory(categoryId: string) {
    return prisma.serviceOffer.deleteMany({ where: { categoryId } });
  },

  deleteRequestsByCategory(categoryId: string) {
    return prisma.serviceRequest.deleteMany({ where: { categoryId } });
  },

  // Offers
  createOffer(data: { title: string; description: string; categoryId: string; userId: string }) {
    return prisma.serviceOffer.create({ data });
  },

  findOfferById(offerId: string) {
    return prisma.serviceOffer.findUnique({ where: { id: offerId } });
  },

  updateOffer(offerId: string, data: Partial<{ title: string; description: string; categoryId: string }>) {
    return prisma.serviceOffer.update({ where: { id: offerId }, data });
  },

  deleteOffer(offerId: string) {
    return prisma.serviceOffer.delete({ where: { id: offerId } });
  },

  getOffersByCategory(categoryId: string) {
    return prisma.serviceOffer.findMany({
      where: { categoryId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        ratings: { select: { stars: true } },
      },
    });
  },

  getOffersByUserId(userId: string, skip: number, take: number) {
    return prisma.serviceOffer.findMany({
      where: { userId },
      include: {
        category: { select: { id: true, name: true } },
        ratings: { select: { stars: true } },
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  countOffersByUserId(userId: string) {
    return prisma.serviceOffer.count({ where: { userId } });
  },

  // Requests
  createRequest(data: { description: string; userId: string; categoryId: string }) {
    return prisma.serviceRequest.create({ data });
  },

  findRequestById(requestId: string) {
    return prisma.serviceRequest.findUnique({ where: { id: requestId } });
  },

  updateRequest(requestId: string, data: Partial<{ description: string }>) {
    return prisma.serviceRequest.update({ where: { id: requestId }, data });
  },

  deleteRequest(requestId: string) {
    return prisma.serviceRequest.delete({ where: { id: requestId } });
  },

  getRequests(skip: number, take: number) {
    return prisma.serviceRequest.findMany({
      skip,
      take,
      include: { user: { select: { id: true, name: true, email: true } }, category: true },
      orderBy: { createdAt: "desc" },
    });
  },

  countRequests() {
    return prisma.serviceRequest.count();
  },

  getRequestsByCategory(categoryId: string, skip: number, take: number) {
    return prisma.serviceRequest.findMany({
      where: { categoryId },
      skip,
      take,
      include: {
        user: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  countRequestsByCategory(categoryId: string) {
    return prisma.serviceRequest.count({ where: { categoryId } });
  },

  getRequestsByUserId(userId: string, skip: number, take: number) {
    return prisma.serviceRequest.findMany({
      where: { userId },
      include: {
        category: { select: { id: true, name: true } },
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  countRequestsByUserId(userId: string) {
    return prisma.serviceRequest.count({ where: { userId } });
  },

  // Ratings
  createRating(data: { offerId: string; providerId: string; stars: number }) {
    return prisma.rating.create({ data });
  },

  getRatingByOfferAndProvider(offerId: string, providerId: string) {
    return prisma.rating.findFirst({
      where: { offerId, providerId },
    });
  },

  updateRating(offerId: string, providerId: string, stars: number) {
    return prisma.rating.updateMany({
      where: { offerId, providerId },
      data: { stars },
    });
  },

  getRatingsByUserId(userId: string, skip: number, take: number) {
    return prisma.rating.findMany({
      where: {
        offer: {
          userId,
        },
      },
      include: {
        provider: { select: { id: true, name: true, email: true } },
        offer: { select: { id: true, title: true } },
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  },

  countRatingsByUserId(userId: string) {
    return prisma.rating.count({
      where: {
        offer: {
          userId,
        },
      },
    });
  },
};
