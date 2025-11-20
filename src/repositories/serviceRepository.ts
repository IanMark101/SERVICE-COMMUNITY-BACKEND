import prisma from "../prisma";

export const serviceRepository = {
  // Categories
  getAllCategories() {
    return prisma.serviceCategory.findMany();
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

  // Requests
  createRequest(data: { description: string; userId: string }) {
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
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  countRequests() {
    return prisma.serviceRequest.count();
  },

  // Ratings
  createRating(data: { offerId: string; providerId: string; stars: number }) {
    return prisma.rating.create({ data });
  },
};
