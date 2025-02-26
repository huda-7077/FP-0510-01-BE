import { PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { BASE_URL_FE } from "../../config";
import { sendTransactionPaidEmail } from "../../lib/handlebars/sendTransactionPaidEmail";
import { prisma } from "../../lib/prisma";

interface CreateSubscriptionBody {
  uuid: string;
  action: "ACCEPTED" | "REJECTED";
}

export const createSubscriptionServices = async (
  body: CreateSubscriptionBody
) => {
  const { uuid, action } = body;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const existingPayment = await prisma.payment.findFirst({
        where: { uuid, status: PaymentStatus.WAITING_ADMIN },
        include: {
          user: {
            select: { email: true, fullName: true },
          },
          category: {
            select: { name: true },
          },
        },
      });

      if (!existingPayment) {
        throw new Error(`Payment ${uuid} with status WAITING_ADMIN not found`);
      }

      let subscriptionMessage = "";

      if (action === "ACCEPTED") {
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: PaymentStatus.PAID,
            expiredAt: null,
            invoiceUrl: `${BASE_URL_FE}/invoice/${uuid}`,
          },
        });

        if (existingPayment.isRenewal === true) {
          const existingSubscription = await prisma.subscription.findFirst({
            where: {
              userId: existingPayment.userId,
              status: SubscriptionStatus.RENEWED,
            },
          });

          if (!existingSubscription) {
            throw new Error(`You have no active subscription to renew`);
          }
          const expiredDate = new Date(existingSubscription.expiredDate);

          await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              paymentId: existingPayment.id,
              status: SubscriptionStatus.ACTIVE,
              expiredDate: new Date(
                expiredDate.getTime() +
                  existingPayment.duration * 30 * 24 * 60 * 60 * 1000
                // expiredDate.getTime() +
                //   existingPayment.duration * 30 * 24 * 60 * 60 * 1000
              ),
            },
          });
        } else {
          await prisma.subscription.create({
            data: {
              userId: existingPayment.userId,
              paymentId: existingPayment.id,
              status: SubscriptionStatus.ACTIVE,
              expiredDate: new Date(
                Date.now() + existingPayment.duration * 30 * 24 * 60 * 60 * 1000
                // Date.now() + existingPayment.duration * 10 * 60 * 1000
              ),
            },
          });
        }

        subscriptionMessage = "subscription created successfully";
        return {
          message: `Payment ${action} and ${subscriptionMessage}`,
          payment: existingPayment,
        };
      } else if (action === "REJECTED") {
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: { status: PaymentStatus.REJECTED, expiredAt: null },
        });

        subscriptionMessage = "subscription not created";
        return {
          message: `Payment ${action} and ${subscriptionMessage}`,
        };
      } else {
        throw new Error("Invalid action");
      }
    });

    if (action === "ACCEPTED" && result.payment) {
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
          total: payment.total.toString(),
          invoiceUrl: `${BASE_URL_FE}/invoice/${payment.uuid}`,
        });
      } catch (emailError) {
        console.error("Failed to send transaction paid email:", emailError);
      }
    }

    return result;
  } catch (error) {
    console.error(
      `Error in createSubscriptionServices for uuid ${uuid}:`,
      error
    );
    throw error;
  }
};
