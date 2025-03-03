import { PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetPaymentsQuery extends PaginationQueryParams {
  search: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

export const getPaymentsUserService = async (
  query: GetPaymentsQuery,
  userId: number
) => {
  try {
    const { page, sortBy, sortOrder, take, search, status, paymentMethod } =
      query;

    const whereClause: Prisma.PaymentWhereInput = {
      userId,
    };

    if (status !== undefined) {
      whereClause.status = status;
    }

    if (paymentMethod !== undefined) {
      whereClause.paymentMethod = paymentMethod;
    }

    if (search) {
      whereClause.OR = [{ uuid: { contains: search, mode: "insensitive" } }];
    }

    const payment = await prisma.payment.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder },
    });

    const count = await prisma.payment.count({ where: whereClause });

    return {
      data: payment,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
