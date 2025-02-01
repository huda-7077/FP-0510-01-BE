import { prisma } from "../../lib/prisma";

export const getInvoiceService = async (uuid: string) => {
  try {
    const invoice = await prisma.payment.findUnique({
      where: { uuid },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    return invoice;
  } catch (error) {
    throw error;
  }
};
