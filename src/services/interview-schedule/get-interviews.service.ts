import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";
import { ApiError } from "../../utils/apiError";

interface GetInterviewsQuery extends PaginationQueryParams {
  search: string;
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
    } = query;

    // Fetch the user and their associated company
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

    // Initialize the where clause for filtering interviews
    const whereClause: Prisma.InterviewWhereInput = { isDeleted: false };

    // Restrict interviews based on user role and companyId
    if (user.role === "ADMIN") {
      if (!user.companyId) {
        throw new ApiError("Admin is not associated with any company", 403);
      }
      // Admins can only see interviews from their own company
      whereClause.jobApplication = {
        job: {
          companyId: user.companyId,
        },
      };
    } else if (user.role === "USER") {
      // Users can only see interviews related to their userId
      whereClause.jobApplication = {
        userId: user.id,
      };
    } else {
      throw new ApiError("Unauthorized role", 403);
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
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

    // Count total interviews matching the where clause
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
