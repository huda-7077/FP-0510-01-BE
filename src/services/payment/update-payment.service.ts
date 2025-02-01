import { PaymentStatus } from "@prisma/client";
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
    const payment = await prisma.payment.findUnique({
      where: { uuid, userId, status: PaymentStatus.PENDING },
    });

    if (!payment) {
      throw new ApiError("Payment or pending payment not found", 404);
    }

    let status = "";

    switch (action) {
      case "CANCEL":
        await prisma.payment.update({
          where: { uuid },
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
          where: { uuid },
          data: {
            status: PaymentStatus.WAITING_ADMIN,
            paymentProof: secure_url,
            expiredAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            paidAt: new Date(Date.now()),
          },
        });
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
