import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface UpdateSubscriptionCategoryBody {
  description: string;
  price: number;
  features: string[];
}

export const updateSubscriptionCategoryServices = async (
  id: number,
  body: UpdateSubscriptionCategoryBody
) => {
  const { description, price, features } = body;

  const existingSubscriptionCategory =
    await prisma.subscriptionCategory.findUnique({
      where: { id },
    });

  if (!existingSubscriptionCategory) {
    throw new ApiError(`Subscription category with id ${id} not found`, 404);
  }

  const subscriptionCategory = await prisma.subscriptionCategory.update({
    where: { id },
    data: {
      description,
      price,
      features,
    },
  });

  return {
    subscriptionCategory,
    messages: "Subscription category updated successfully",
  };
};
