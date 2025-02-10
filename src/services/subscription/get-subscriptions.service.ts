import { Prisma, SubscriptionStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetSubscriptionsQuery extends PaginationQueryParams {
  search: string;
  status?: SubscriptionStatus;
}

export const getSubscriptionsService = async (query: GetSubscriptionsQuery) => {
  try {
    const { page, sortBy, sortOrder, take, search, status } = query;

    const whereClause: Prisma.SubscriptionWhereInput = {};

    if (status !== undefined || status !== SubscriptionStatus.INACTIVE) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        {
          payment: {
            category: { name: { contains: search, mode: "insensitive" } },
          },
        },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const subscription = await prisma.subscription.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        payment: {
          select: {
            category: { select: { name: true, price: true } },
            duration: true,
            invoiceUrl: true,
          },
        },
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
    });

    const count = await prisma.subscription.count({ where: whereClause });

    return {
      data: subscription,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
