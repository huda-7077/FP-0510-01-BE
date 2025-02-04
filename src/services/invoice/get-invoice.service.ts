import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getInvoiceService = async (uuid: string) => {
  try {
    const invoice = await prisma.payment.findFirst({
      where: { uuid },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    if (!invoice) {
      throw new ApiError("Invoice not found", 404);
    }

    return invoice;
  } catch (error) {
    throw error;
  }
};
