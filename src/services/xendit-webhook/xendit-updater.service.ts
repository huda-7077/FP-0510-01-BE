import { PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { BASE_URL_FE } from "../../config";
import { sendTransactionPaidEmail } from "../../lib/handlebars/sendTransactionPaidEmail";
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
        await updatePaymentStatus(
          prisma,
          payment.id,
          payment.uuid,
          PaymentStatus.EXPIRED
        );
        return {
          message: `Payment status updated to ${PaymentStatus.EXPIRED}`,
        };
      }

      if (status === PaymentStatus.PAID) {
        await updatePaymentStatus(
          prisma,
          payment.id,
          payment.uuid,
          PaymentStatus.PAID,
          null,
          new Date(Date.now())
        );
        if (payment.isRenewal === true) {
          const existingSubscription = await prisma.subscription.findFirst({
            where: {
              userId: payment.userId,
              status: SubscriptionStatus.MAILED,
            },
          });

          if (!existingSubscription) {
            throw new Error(`You have no active subscription to renew`);
          }
          let assessmentLimit = existingSubscription.assessmentLimit;
          if (payment.category.name === "STANDARD") {
            assessmentLimit = existingSubscription.assessmentLimit + 2;
          }

          await updateSubscription(
            prisma,
            payment,
            existingSubscription,
            assessmentLimit
          );
        } else {
          let assessmentLimit = 0;
          if (payment.category.name === "STANDARD") {
            assessmentLimit = 2;
          } else if (payment.category.name === "PROFESSIONAL") {
            assessmentLimit = 10000;
          }
          await createSubscription(prisma, payment, assessmentLimit);
        }
        return {
          message: `Payment status updated to ${PaymentStatus.PAID} and subscription created successfully`,
          payment,
        };
      }

      throw new ApiError(`Unsupported payment status: ${status}`, 400);
    });

    if (status === PaymentStatus.PAID) {
      const { payment } = result;
      try {
        await sendTransactionPaidEmail({
          paymentId: payment.uuid,
          email: payment.user.email,
          name: payment.user.fullName,
          transactionStatus: PaymentStatus.PAID,
          plan: payment.category.name,
          duration:
            payment.duration === 1 ? "1 month" : `${payment.duration} months`,
          paymentMethod: payment.paymentMethod,
          total: payment.total,
          invoiceUrl: payment.invoiceUrl,
        });
      } catch (emailError) {
        console.error("Failed to send transaction paid email:", emailError);
      }
    }

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
  const payment = await prisma.payment.findFirst({
    where: { uuid },
    include: {
      user: {
        select: { email: true, fullName: true },
      },
      category: {
        select: { name: true },
      },
    },
  });

  if (!payment) {
    throw new ApiError(`Payment with uuid ${uuid} not found`, 400);
  }

  return payment;
};

const updatePaymentStatus = async (
  prisma: any,
  id: string,
  uuid: string,
  status: PaymentStatus,
  expiredAt?: Date | null,
  paidAt?: Date
) => {
  await prisma.payment.update({
    where: { id },
    data: {
      status,
      expiredAt,
      invoiceUrl: `${BASE_URL_FE}/invoice/${uuid}`,
      paidAt,
    },
  });
};

const createSubscription = async (
  prisma: any,
  payment: any,
  assessmentLimit: number
) => {
  await prisma.subscription.create({
    data: {
      userId: payment.userId,
      paymentId: payment.id,
      status: SubscriptionStatus.ACTIVE,
      assessmentLimit,
      expiredDate: new Date(
        Date.now() + payment.duration * 30 * 24 * 60 * 60 * 1000
      ),
    },
  });
};

const updateSubscription = async (
  prisma: any,
  payment: any,
  existingSubscription: any,
  assessmentLimit: number
) => {
  const expiredDate = new Date(existingSubscription.expiredDate);

  await prisma.subscription.update({
    where: { id: existingSubscription.id },
    data: {
      paymentId: payment.id,
      status: SubscriptionStatus.ACTIVE,
      assessmentLimit,
      expiredDate: new Date(
        expiredDate.getTime() + payment.duration * 30 * 24 * 60 * 60 * 1000
      ),
    },
  });
};
