import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import xendit from "../../lib/xendit";
import { ApiError } from "../../utils/apiError";
import { BASE_URL_FE } from "../../config";

const INVOICE_DURATION = 7200;
const PAYMENT_GATEWAY_EXPIRY = 2 * 60 * 60 * 1000;
const MANUAL_PAYMENT_EXPIRY = 6 * 60 * 60 * 1000;

interface CreatePaymentBody {
  category: string;
  paymentMethod: PaymentMethod;
  isRenewal?: boolean;
}

const createPaymentRecord = async (
  userId: number,
  subscriptionCategoryId: number,
  paymentMethod: PaymentMethod,
  amount: number,
  expiredAt: Date,
  isRenewal?: boolean,
  invoiceUrl?: string
) => {
  return prisma.payment.create({
    data: {
      userId,
      subscriptionCategoryId,
      paymentMethod,
      isRenewal,
      total: amount,
      status: PaymentStatus.PENDING,
      expiredAt,
      invoiceUrl,
    },
  });
};

const createXenditInvoice = async (
  externalId: string,
  amount: number,
  payerEmail: string,
  category: string,
  duration: number,
  price: number
) => {
  return xendit.Invoice.createInvoice({
    data: {
      externalId,
      amount,
      payerEmail,
      description: `Payment for ${duration}-month ${category.toLowerCase()} subscription on Supajob`,
      invoiceDuration: INVOICE_DURATION.toString(),
      items: [{ name: category, quantity: duration, price }],
      successRedirectUrl: `${BASE_URL_FE}/subscriptions/payments/${externalId}`,
    },
  });
};

const validateUserAndCategory = async (userId: number, category: string) => {
  const [user, subscriptionCategory] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.subscriptionCategory.findUnique({ where: { name: category } }),
  ]);

  if (!user) throw new ApiError("User not found", 404);
  if (!subscriptionCategory)
    throw new ApiError("Subscription category not found", 404);

  return { user, subscriptionCategory };
};

export const createPaymentService = async (
  userId: number,
  body: CreatePaymentBody
) => {
  const { category, paymentMethod, isRenewal } = body;

  const { user, subscriptionCategory } = await validateUserAndCategory(
    userId,
    category
  );

  const amount = subscriptionCategory.price;

  try {
    return await prisma.$transaction(async () => {
      if (paymentMethod === PaymentMethod.PAYMENT_GATEWAY) {
        const payment = await createPaymentRecord(
          userId,
          subscriptionCategory.id,
          paymentMethod,
          amount,
          new Date(Date.now() + PAYMENT_GATEWAY_EXPIRY),
          isRenewal
        );
        const invoice = await createXenditInvoice(
          payment.uuid,
          amount,
          user.email,
          subscriptionCategory.name,
          1,
          subscriptionCategory.price
        );

        await prisma.payment.update({
          where: { id: payment.id },
          data: { invoiceUrl: invoice.invoiceUrl },
        });

        return { payment, message: "Payment gateway created successfully" };
      }

      if (paymentMethod === PaymentMethod.PAYMENT_MANUAL) {
        const payment = await createPaymentRecord(
          userId,
          subscriptionCategory.id,
          paymentMethod,
          amount,
          new Date(Date.now() + MANUAL_PAYMENT_EXPIRY),
          isRenewal
        );
        return { payment, message: "Manual payment created successfully" };
      }

      throw new ApiError("Invalid payment method", 400);
    });
  } catch (error) {
    throw new ApiError("Payment processing failed", 500);
  }
};
