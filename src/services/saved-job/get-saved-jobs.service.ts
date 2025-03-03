import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";
import { ApiError } from "../../utils/apiError";

interface GetSavedJobsQuery extends PaginationQueryParams {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export const getSavedJobsService = async (
  query: GetSavedJobsQuery,
  userId: number
) => {
  try {
    const {
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
      take = 10,
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
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const whereClause: Prisma.SavedJobWhereInput = {
      userId,
      job: {
        isDeleted: false,
        isPublished: true,
      },
    };

    if (category) {
      whereClause.job = {
        ...((whereClause.job as Prisma.JobWhereInput) || {}),
        category: { equals: category, mode: "insensitive" },
      };
    }

    if (search) {
      whereClause.OR = [
        { job: { title: { contains: search, mode: "insensitive" } } },
        {
          job: { company: { name: { contains: search, mode: "insensitive" } } },
        },
        { job: { category: { contains: search, mode: "insensitive" } } },
        {
          job: {
            companyLocation: {
              address: { contains: search, mode: "insensitive" },
            },
          },
        },
        { job: { tags: { has: search.toLowerCase() } } },
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

    const savedJobs = await prisma.savedJob.findMany({
      where: whereClause,
      ...(take !== -1
        ? {
            skip: (page - 1) * take,
            take,
          }
        : {}),
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
                industry: true,
              },
            },
            companyLocation: {
              include: {
                regency: {
                  select: {
                    regency: true,
                    province: {
                      select: {
                        province: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const count = await prisma.savedJob.count({
      where: whereClause,
    });

    return {
      data: savedJobs,
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
