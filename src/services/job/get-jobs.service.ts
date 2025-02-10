import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetJobsQuery extends PaginationQueryParams {
  search: string;
  category: string;
  timeRange?: string;
  isPublished?: string;
  isDeleted?: string;
  companyId: number;
}

export const getJobsService = async (query: GetJobsQuery) => {
  try {
    const {
      page = 1,
      sortBy = "id",
      sortOrder = "asc",
      take,
      search,
      category,
      timeRange,
      isPublished,
      isDeleted,
      companyId,
    } = query;

    const whereClause: Prisma.JobWhereInput = {};

    if (companyId) {
      whereClause.companyId = companyId;
    }

    if (isDeleted !== "") {
      const convertIsDeleted = isDeleted === "true";
      whereClause.isDeleted = convertIsDeleted;
    }

    if (isPublished !== "") {
      const convertIsPublished = isPublished === "true";
      whereClause.isPublished = convertIsPublished;
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

    if (timeRange) {
      const now = new Date();
      let applicationDeadline: Date | undefined;

      switch (timeRange) {
        case "day":
          applicationDeadline = new Date(now.setHours(23, 59, 59, 999));
          break;
        case "week":
          const startOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay())
          );
          applicationDeadline = new Date(
            startOfWeek.setDate(startOfWeek.getDate() + 6)
          );
          applicationDeadline.setHours(23, 59, 59, 999);
          break;
        case "month":
          applicationDeadline = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
          );
          break;
        case "year":
          applicationDeadline = new Date(
            now.getFullYear(),
            11,
            31,
            23,
            59,
            59,
            999
          );
          break;
        default:
          throw new Error("Invalid timeRange value");
      }

      if (applicationDeadline) {
        whereClause.applicationDeadline = {
          lte: applicationDeadline,
        };
      }
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      ...(take !== -1
        ? {
            skip: (page - 1) * (take || 10),
            take: take || 10,
          }
        : {}),
      skip: (page - 1) * take,
      take: take,
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
