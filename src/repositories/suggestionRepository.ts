import prisma from "../prisma";

export const suggestionRepository = {
  // User submits a suggestion
  async createSuggestion(userId: string, title: string, description: string) {
    return await prisma.suggestion.create({
      data: {
        title,
        description,
        userId,
        status: "pending",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  // Get all suggestions (for admin)
  async getAllSuggestions(status?: string) {
    const where = status ? { status } : {};
    return await prisma.suggestion.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Get suggestions by status
  async getSuggestionsByStatus(status: string) {
    return await prisma.suggestion.findMany({
      where: { status },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Get user's own suggestions
  async getUserSuggestions(userId: string) {
    return await prisma.suggestion.findMany({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Get a single suggestion by ID
  async getSuggestionById(suggestionId: string) {
    return await prisma.suggestion.findUnique({
      where: { id: suggestionId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  // Update suggestion status (approve/reject)
  async updateSuggestionStatus(suggestionId: string, status: string) {
    return await prisma.suggestion.update({
      where: { id: suggestionId },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  // Delete a suggestion
  async deleteSuggestion(suggestionId: string) {
    return await prisma.suggestion.delete({
      where: { id: suggestionId },
    });
  },
};
