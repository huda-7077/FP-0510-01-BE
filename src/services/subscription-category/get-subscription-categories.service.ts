import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getSubscriptionCategoriesService = async () => {
  try {
    const subscriptionCategory = await prisma.subscriptionCategory.findMany();

    if (!subscriptionCategory) {
      throw new ApiError("Subscription category not found", 404);
    }

    return subscriptionCategory;
  } catch (error) {
    throw error;
  }
};
