import { prisma } from "../../lib/prisma";

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
      return {
        status: "INACTIVE",
        message: "You don't have any active subscription",
      };
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
