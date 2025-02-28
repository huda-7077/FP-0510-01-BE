import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetCompanyReviewsQuery extends PaginationQueryParams {}

export const getCompanyReviewsService = async (
  query: GetCompanyReviewsQuery,
  companyId: number
) => {
  try {
    const { page, sortBy, sortOrder, take } = query;

    const whereClause: Prisma.CompanyReviewWhereInput = {};

    whereClause.companyId = companyId;

    const companyReviews = await prisma.companyReview.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: {
            employees: {
              select: {
                position: true,
              },
            },
          },
        },
      },
    });

    const count = await prisma.companyReview.count({ where: whereClause });

    const formattedReviews = companyReviews.map((review) => ({
      ...review,
      position: review.user?.employees?.[0]?.position ?? null,
      user: undefined,
    }));

    return {
      data: formattedReviews,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
