import { prisma } from "../../lib/prisma";

export const getPaymentService = async (uuid: string) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { uuid },
      include: {
        user: {
          select: { email: true },
        },
        category: {
          select: { name: true },
        },
      },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  } catch (error) {
    throw error;
  }
};
