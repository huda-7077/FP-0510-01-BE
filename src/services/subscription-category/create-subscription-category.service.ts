import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface CreateSubscriptionCategoryBody {
  name: string;
  description: string;
  price: number;
  features: string[];
}

export const createSubscriptionCategoryServices = async (
  body: CreateSubscriptionCategoryBody
) => {
  const { name, description, price, features } = body;

  const existingSubscriptionCategory =
    await prisma.subscriptionCategory.findUnique({
      where: { name },
    });

  if (existingSubscriptionCategory) {
    throw new ApiError(
      `Subscription category with name ${name} already exists`,
      409
    );
  }

  const subscriptionCategory = await prisma.subscriptionCategory.create({
    data: {
      name,
      description,
      price,
      features,
    },
  });

  return {
    subscriptionCategory,
    messages: "Subscription category created successfully",
  };
};
