import { PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface XenditUpdaterBody {
  external_id: string;
  status: string;
}

export const xenditUpdaterServices = async (body: XenditUpdaterBody) => {
  const { external_id, status } = body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const payment = await findPaymentByUuid(prisma, external_id);

      if (status === PaymentStatus.EXPIRED) {
        await updatePaymentStatus(prisma, external_id, PaymentStatus.EXPIRED);
        return {
          message: `Payment status updated to ${PaymentStatus.EXPIRED}`,
        };
      }

      if (status === PaymentStatus.PAID) {
        await updatePaymentStatus(
          prisma,
          external_id,
          PaymentStatus.PAID,
          null
        );
        await createSubscription(prisma, payment);
        return {
          message: `Payment status updated to ${PaymentStatus.PAID} and subscription created successfully`,
        };
      }

      throw new ApiError(`Unsupported payment status: ${status}`, 400);
    });

    return result;
  } catch (error) {
    console.error(
      `Error in xenditUpdaterServices for external_id ${external_id}:`,
      error
    );
    throw error;
  }
};

const findPaymentByUuid = async (prisma: any, uuid: string) => {
  const payment = await prisma.payment.findUnique({
    where: { uuid },
  });

  if (!payment) {
    throw new ApiError(`Payment with uuid ${uuid} not found`, 400);
  }

  return payment;
};

const updatePaymentStatus = async (
  prisma: any,
  uuid: string,
  status: PaymentStatus,
  expiredAt?: Date | null
) => {
  await prisma.payment.update({
    where: { uuid },
    data: { status, expiredAt },
  });
};

const createSubscription = async (prisma: any, payment: any) => {
  await prisma.subscription.create({
    data: {
      paymentId: payment.id,
      status: SubscriptionStatus.ACTIVE,
      expiredDate: new Date(
        Date.now() + payment.duration * 30 * 24 * 60 * 60 * 1000
      ),
    },
  });
};
