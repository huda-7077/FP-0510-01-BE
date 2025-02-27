import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";
import { ApiError } from "../../utils/apiError";

interface GetCompanyJobsQuery extends PaginationQueryParams {
  search: string;
  category: string;
  startDate?: string;
  endDate?: string;
}

export const getCompanyJobsService = async (
  query: GetCompanyJobsQuery,
  userId: number
) => {
  try {
    const {
      page = 1,
      sortBy = "id",
      sortOrder = "asc",
      take,
      search,
      category,
      startDate,
      endDate,
    } = query;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
      include: {
        company: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    const whereClause: Prisma.JobWhereInput = { isDeleted: false };

    if (user) {
      if (!user.companyId) {
        throw new ApiError("Admin is not associated with any company", 403);
      }
      whereClause.companyId = user.companyId;
    } else {
      throw new ApiError("User not found", 404);
    }

    if (user.role === "USER") {
      whereClause.isPublished = true;
    }

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (startDate && endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);

      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: adjustedEndDate,
      };
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      ...(take !== -1
        ? {
            skip: (page - 1) * (take || 10),
            take: take || 10,
          }
        : {}),
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        company: {
          select: {
            name: true,
            logo: true,
            industry: true,
          },
        },
        preTestAssessments: {
          select: {
            id: true,
            slug: true,
            passingScore: true,
            status: true,
          },
        },
        companyLocation: {
          select: {
            address: true,
            regency: {
              select: {
                regency: true,
              },
            },
          },
        },
      },
    });

    const count = await prisma.job.count({
      where: whereClause,
    });

    return {
      data: jobs,
      meta: {
        page: take !== -1 ? page : 1,
        take: take !== -1 ? take : count,
        total: count,
      },
    };
  } catch (error) {
    throw error;
  }
};
