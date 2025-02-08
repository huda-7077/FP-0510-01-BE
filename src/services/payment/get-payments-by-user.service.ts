import { prisma } from "../../lib/prisma";

export const getPaymentsByUserService = async (userId: number) => {
  try {
    const payment = await prisma.payment.findMany({
      where: { userId },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  } catch (error) {
    throw error;
  }
};
