import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getSubscriptionService = async (userId: number) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      include: {
        payment: {
          select: {
            category: { select: { name: true, price: true } },
            duration: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription) {
      throw new ApiError("You don't have any subscription", 404);
    }

    const { payment } = subscription;

    return {
      ...subscription,
      category: payment.category,
      duration: payment.duration,
    };
  } catch (error) {
    throw error;
  }
};
