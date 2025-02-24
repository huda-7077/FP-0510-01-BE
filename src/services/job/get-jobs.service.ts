import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetJobsQuery extends PaginationQueryParams {
  search?: string;
  category?: string;
  timeRange?: "week" | "month" | "custom";
  startDate?: string;
  endDate?: string;
  location?: string;
  companyId?: number;
}

export const getJobsService = async (query: GetJobsQuery) => {
  try {
    const {
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
      take = 10,
      search,
      category,
      timeRange,
      startDate,
      endDate,
      location,
      companyId,
    } = query;

    const whereClause: Prisma.JobWhereInput = {
      isDeleted: false,
      isPublished: true,
      applicationDeadline: {
        gte: new Date(),
      },
    };

    if (companyId) {
      whereClause.companyId = companyId;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { company: { name: { contains: search, mode: "insensitive" } } },
        { tags: { has: search.toLocaleLowerCase() } },
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    if (timeRange || (startDate && endDate)) {
      const now = new Date();
      let startDateTime: Date;
      let endDateTime = now;

      if (timeRange === "week") {
        startDateTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (timeRange === "month") {
        startDateTime = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
      } else if (startDate && endDate) {
        startDateTime = new Date(startDate);
        endDateTime = new Date(endDate);
      } else {
        startDateTime = now;
      }

      whereClause.createdAt = {
        gte: startDateTime,
        lte: endDateTime,
      };
    }

    if (location) {
      whereClause.companyLocation = {
        OR: [
          { address: { contains: location, mode: "insensitive" } },
          {
            regency: {
              regency: { contains: location, mode: "insensitive" },
            },
          },
        ],
      };
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      ...(take !== -1
        ? {
            skip: (page - 1) * take,
            take: take,
          }
        : {}),
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            industry: true,
            description: true,
          },
        },
        companyLocation: {
          select: {
            address: true,
            postalCode: true,
            regency: {
              select: {
                id: true,
                regency: true,
                province: {
                  select: {
                    id: true,
                    province: true,
                  },
                },
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
        searchQuery: search || null,
      },
    };
  } catch (error) {
    throw error;
  }
};