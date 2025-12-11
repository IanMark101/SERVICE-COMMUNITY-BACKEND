import { suggestionRepository } from "../repositories/suggestionRepository";
import { serviceRepository } from "../repositories/serviceRepository";

export const suggestionService = {
  // User submits a suggestion for a new service category
  async submitSuggestion(userId: string, title: string, description: string) {
    // Validate input
    if (!title || !description) {
      throw new Error("Title and description are required");
    }

    if (title.length < 3) {
      throw new Error("Title must be at least 3 characters long");
    }

    if (description.length < 10) {
      throw new Error("Description must be at least 10 characters long");
    }

    // Create the suggestion
    const suggestion = await suggestionRepository.createSuggestion(
      userId,
      title,
      description
    );

    return suggestion;
  },

  // Admin gets all pending suggestions
  async getPendingSuggestions() {
    return await suggestionRepository.getSuggestionsByStatus("pending");
  },

  // Admin gets all suggestions (any status)
  async getAllSuggestions(status?: string) {
    return await suggestionRepository.getAllSuggestions(status);
  },

  // User gets their own suggestions
  async getUserSuggestions(userId: string) {
    return await suggestionRepository.getUserSuggestions(userId);
  },

  // Admin approves a suggestion and creates a service category
  async approveSuggestion(suggestionId: string) {
    const suggestion = await suggestionRepository.getSuggestionById(
      suggestionId
    );

    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    if (suggestion.status !== "pending") {
      throw new Error("Only pending suggestions can be approved");
    }

    // Check if category with same name already exists
    const existingCategory = await serviceRepository.findCategoryByName(
      suggestion.title
    );
    if (existingCategory) {
      throw new Error(
        "A service category with this name already exists. Please suggest a different name."
      );
    }

    // Create the service category
    const newCategory = await serviceRepository.createCategory({
      name: suggestion.title,
    });

    // Update suggestion status to approved
    await suggestionRepository.updateSuggestionStatus(
      suggestionId,
      "approved"
    );

    return {
      suggestion: await suggestionRepository.getSuggestionById(suggestionId),
      category: newCategory,
    };
  },

  // Admin rejects a suggestion
  async rejectSuggestion(suggestionId: string) {
    const suggestion = await suggestionRepository.getSuggestionById(
      suggestionId
    );

    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    if (suggestion.status !== "pending") {
      throw new Error("Only pending suggestions can be rejected");
    }

    return await suggestionRepository.updateSuggestionStatus(
      suggestionId,
      "rejected"
    );
  },

  // Admin deletes a suggestion
  async deleteSuggestion(suggestionId: string) {
    const suggestion = await suggestionRepository.getSuggestionById(
      suggestionId
    );

    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    // If the suggestion was approved, also delete the associated service category
    if (suggestion.status === "approved") {
      const category = await serviceRepository.findCategoryByName(
        suggestion.title
      );
      if (category) {
        // Delete all service offers in this category first
        await serviceRepository.deleteOffersByCategory(category.id);
        // Delete all service requests in this category
        await serviceRepository.deleteRequestsByCategory(category.id);
        // Then delete the category
        await serviceRepository.deleteCategory(category.id);
      }
    }

    return await suggestionRepository.deleteSuggestion(suggestionId);
  },
};
