import { prisma } from "../../lib/prisma";

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
    throw new Error(`Subscription category with name ${name} already exists`);
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
