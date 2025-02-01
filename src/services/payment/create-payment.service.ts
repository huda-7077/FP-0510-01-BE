import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { generatePaymentUUID } from "../../lib/generator";
import { prisma } from "../../lib/prisma";
import xendit from "../../lib/xendit";
import { ApiError } from "../../utils/apiError";

const INVOICE_DURATION = 7200;
const PAYMENT_GATEWAY_EXPIRY = 2 * 60 * 60 * 1000;
const MANUAL_PAYMENT_EXPIRY = 5 * 60 * 1000;
const UUID_PREFIX = {
  [PaymentMethod.PAYMENT_GATEWAY]: "PGW-",
  [PaymentMethod.PAYMENT_MANUAL]: "PMN-",
};

interface CreatePaymentBody {
  duration: number;
  category: string;
  paymentMethod: PaymentMethod;
}

const createPaymentRecord = async (
  userId: number,
  subscriptionCategoryId: number,
  uuid: string,
  paymentMethod: PaymentMethod,
  duration: number,
  amount: number,
  expiredAt: Date,
  invoiceUrl?: string
) => {
  return prisma.payment.create({
    data: {
      userId,
      subscriptionCategoryId,
      uuid,
      paymentMethod,
      duration,
      total: amount,
      status: PaymentStatus.PENDING,
      expiredAt,
      invoiceUrl,
    },
  });
};

const createXenditInvoice = async (
  uuid: string,
  amount: number,
  payerEmail: string,
  category: string,
  duration: number,
  price: number
) => {
  return xendit.Invoice.createInvoice({
    data: {
      externalId: uuid,
      amount,
      payerEmail,
      description: `Payment for ${duration}-month ${category.toLowerCase()} subscription on Supajob`,
      invoiceDuration: INVOICE_DURATION.toString(),
      items: [{ name: category, quantity: duration, price }],
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
  const { duration, category, paymentMethod } = body;

  const { user, subscriptionCategory } = await validateUserAndCategory(
    userId,
    category
  );
  const uuid = generatePaymentUUID(UUID_PREFIX[paymentMethod], 25);
  const amount = subscriptionCategory.price * duration;

  try {
    return await prisma.$transaction(async () => {
      if (paymentMethod === PaymentMethod.PAYMENT_GATEWAY) {
        const invoice = await createXenditInvoice(
          uuid,
          amount,
          user.email,
          subscriptionCategory.name,
          duration,
          subscriptionCategory.price
        );
        const payment = await createPaymentRecord(
          userId,
          subscriptionCategory.id,
          uuid,
          paymentMethod,
          duration,
          amount,
          new Date(Date.now() + PAYMENT_GATEWAY_EXPIRY),
          invoice.invoiceUrl
        );
        return { payment, message: "Payment gateway created successfully" };
      }

      if (paymentMethod === PaymentMethod.PAYMENT_MANUAL) {
        const payment = await createPaymentRecord(
          userId,
          subscriptionCategory.id,
          uuid,
          paymentMethod,
          duration,
          amount,
          new Date(Date.now() + MANUAL_PAYMENT_EXPIRY)
        );
        return { payment, message: "Manual payment created successfully" };
      }

      throw new ApiError("Invalid payment method", 400);
    });
  } catch (error) {
    throw new ApiError("Payment processing failed", 500);
  }
};
