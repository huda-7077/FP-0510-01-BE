import { PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { BASE_URL_FE } from "../../config";

interface CreateSubscriptionBody {
  uuid: string;
  action: "ACCEPTED" | "REJECTED";
}

export const createSubscriptionServices = async (
  body: CreateSubscriptionBody
) => {
  const { uuid, action } = body;

  return prisma.$transaction(async (prisma) => {
    const existingPayment = await prisma.payment.findUnique({
      where: { uuid, status: PaymentStatus.WAITING_ADMIN },
    });

    if (!existingPayment) {
      throw new Error(`Payment ${uuid} with status WAITING_ADMIN not found`);
    }

    let subscriptionMessage = "";

    if (action === "ACCEPTED") {
      await prisma.payment.update({
        where: { uuid },
        data: {
          status: PaymentStatus.PAID,
          expiredAt: null,
          invoiceUrl: `${BASE_URL_FE}/invoice/${uuid}`,
        },
      });

      await prisma.subscription.create({
        data: {
          paymentId: existingPayment.id,
          status: SubscriptionStatus.ACTIVE,
          expiredDate: new Date(
            Date.now() + existingPayment.duration * 30 * 24 * 60 * 60 * 1000
          ),
        },
      });

      subscriptionMessage = "subscription created successfully";
    } else if (action === "REJECTED") {
      await prisma.payment.update({
        where: { uuid },
        data: { status: PaymentStatus.REJECTED, expiredAt: null },
      });

      subscriptionMessage = "subscription not created";
    } else {
      throw new Error("Invalid action");
    }

    return {
      message: `Payment ${action} and ${subscriptionMessage}`,
    };
  });
};
