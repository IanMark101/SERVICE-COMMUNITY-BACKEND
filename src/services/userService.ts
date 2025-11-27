// src/services/userService.ts
import { userRepository } from "../repositories/userRepository";

export const userService = {
  async searchUsers(search: string | undefined, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const users = await userRepository.searchUsers({ search, skip, take: limit });
    const total = await userRepository.countUsers(search);

    return {
      page,
      totalPages: Math.ceil(total / limit),
      total,
      users,
    };
  },

  async getUserProfile(userId: string) {
    const user = await userRepository.getUserProfile(userId);
    if (!user) return null;

    // Compute total and average ratings for each offer
    const offersWithRatings = user.offers.map((offer) => {
      const totalRatings = offer.ratings.length;
      const averageRating =
        totalRatings > 0
          ? offer.ratings.reduce((sum, r) => sum + r.stars, 0) / totalRatings
          : 0;

      return {
        id: offer.id,
        title: offer.title,
        description: offer.description,
        createdAt: offer.createdAt,
        totalRatings,
        averageRating: Number(averageRating.toFixed(2)),
      };
    });

    // Compute overall provider ratings
    const allOfferRatings = user.offers.flatMap((o) => o.ratings);
    const totalRatings = allOfferRatings.length;
    const averageRating =
      totalRatings > 0
        ? allOfferRatings.reduce((sum, r) => sum + r.stars, 0) / totalRatings
        : 0;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      offers: offersWithRatings,
      requests: user.requests,
      ratings: user.ratings, // keep this if needed separately
      totalRatings,
      averageRating: Number(averageRating.toFixed(2)),
    };
  },
};
