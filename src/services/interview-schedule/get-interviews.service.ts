import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";
import { ApiError } from "../../utils/apiError";

interface GetInterviewsQuery extends PaginationQueryParams {
  search: string;
  startDate?: string;
  endDate?: string;
}

export const getInterviewsService = async (
  query: GetInterviewsQuery,
  userId: number
) => {
  try {
    const {
      page = 1,
      sortBy = "scheduledDate",
      sortOrder = "desc",
      take,
      search,
      startDate,
      endDate,
    } = query;

    if ((startDate && !endDate) || (!startDate && endDate)) {
      throw new ApiError(
        "Both startDate and endDate must be provided for date range filtering",
        400
      );
    }

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

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const whereClause: Prisma.InterviewWhereInput = { isDeleted: false };

    if (user.role === "ADMIN") {
      if (!user.companyId) {
        throw new ApiError("Admin is not associated with any company", 403);
      }
      whereClause.jobApplication = {
        job: {
          companyId: user.companyId,
        },
      };
    } else if (user.role === "USER") {
      whereClause.jobApplication = {
        userId: user.id,
      };
    } else {
      throw new ApiError("Unauthorized role", 403);
    }

    if (search) {
      whereClause.OR = [
        { interviewerName: { contains: search, mode: "insensitive" } },
        {
          jobApplication: {
            user: { fullName: { contains: search, mode: "insensitive" } },
          },
        },
        {
          jobApplication: {
            job: { title: { contains: search, mode: "insensitive" } },
          },
        },
      ];
    }

    if (startDate && endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);

      whereClause.scheduledDate = {
        gte: new Date(startDate),
        lte: adjustedEndDate,
      };
    }

    const interviews = await prisma.interview.findMany({
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
        jobApplication: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                phoneNumber: true,
                profilePicture: true,
                currentAddress: true,
                dateOfBirth: true,
                regency: {
                  select: {
                    regency: true,
                  },
                },
                educationLevel: true,
                experience: true,
              },
            },
            job: true,
          },
        },
      },
    });

    const count = await prisma.interview.count({
      where: whereClause,
    });

    return {
      data: interviews,
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
