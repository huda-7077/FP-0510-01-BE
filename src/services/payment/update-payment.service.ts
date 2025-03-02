import { PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { cloudinaryUpload } from "../../lib/cloudinary";
import { ApiError } from "../../utils/apiError";

interface UpdatePaymentBody {
  uuid: string;
  action: "CANCEL" | "CONFIRM";
}

export const updatePaymentService = async (
  userId: number,
  body: UpdatePaymentBody,
  paymentProof: Express.Multer.File
) => {
  const { uuid, action } = body;

  return await prisma.$transaction(async (prisma) => {
    const payment = await prisma.payment.findFirst({
      where: { uuid, userId, status: PaymentStatus.PENDING },
    });

    if (!payment) {
      throw new ApiError("Payment or pending payment not found", 404);
    }

    let status = "";

    switch (action) {
      case "CANCEL":
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.CANCELLED,
            expiredAt: null,
          },
        });
        status = PaymentStatus.CANCELLED;
        break;

      case "CONFIRM":
        if (!paymentProof) {
          throw new ApiError("Payment proof is required", 400);
        }

        const { secure_url } = await cloudinaryUpload(paymentProof);

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.WAITING_ADMIN,
            paymentProof: secure_url,
            expiredAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            paidAt: new Date(Date.now()),
          },
        });

        if (payment.isRenewal === true) {
          const subscription = await prisma.subscription.findFirst({
            where: {
              userId,
              status: SubscriptionStatus.MAILED,
            },
          });

          if (!subscription) {
            throw new ApiError("You don't have any active subscription", 404);
          }

          if (subscription) {
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: { status: SubscriptionStatus.RENEWED },
            });
          }
        }

        status = PaymentStatus.WAITING_ADMIN;
        break;

      default:
        throw new ApiError("Invalid action", 400);
    }

    return {
      message: `Payment status updated to ${status}`,
    };
  });
};
