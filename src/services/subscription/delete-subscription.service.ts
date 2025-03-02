import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const deleteSubscriptionServices = async (
  id: number,
  userId: number
) => {
  const existingSubscription = await prisma.subscription.findUnique({
    where: { id, userId },
  });

  if (!existingSubscription) {
    throw new ApiError(`Subscription not found`, 404);
  }

  const subscription = await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      status: SubscriptionStatus.INACTIVE,
    },
  });

  return {
    subscription,
    messages: "Subscription deleted successfully",
  };
};
