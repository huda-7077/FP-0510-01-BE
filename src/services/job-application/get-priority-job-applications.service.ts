import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";
import { ApiError } from "../../utils/apiError";

interface GetJobApplicationsQuery extends PaginationQueryParams {
  search: string;
  jobId: number;
  educationLevel: string;
}

export const getJobApplicationsService = async (
  query: GetJobApplicationsQuery,
  userId: number
) => {
  try {
    const {
      page = 1,
      sortBy = "createdAt",
      sortOrder = "asc",
      take,
      search,
      jobId,
      educationLevel,
    } = query;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
        role: "ADMIN",
      },
      include: {
        company: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    const whereClause: Prisma.JobApplicationWhereInput = {};
    if (user) {
      if (!user.companyId) {
        throw new ApiError("Admin is not associated with any company", 403);
      }
      whereClause.job = {
        companyId: user.companyId,
      };
    } else {
      throw new ApiError("User not found", 404);
    }

    if (jobId) {
      whereClause.jobId = jobId;
    }

    if (educationLevel) {
      if (whereClause.user) {
        whereClause.user.educationLevel = educationLevel;
      } else {
        whereClause.user = { educationLevel };
      }
    }

    if (search) {
      whereClause.OR = [
        { user: { fullName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const orderByClause: Prisma.JobApplicationOrderByWithRelationInput =
      sortBy === "dateOfBirth"
        ? {
            user: {
              dateOfBirth: sortOrder as Prisma.SortOrder,
            },
          }
        : {
            [sortBy]: sortOrder as Prisma.SortOrder,
          };

    const jobApplications = await prisma.jobApplication.findMany({
      where: whereClause,
      ...(take !== -1
        ? {
            skip: (page - 1) * (take || 10),
            take: take || 10,
          }
        : {}),
      skip: (page - 1) * take,
      take: take,
      orderBy: orderByClause,
      include: {
        job: {
          select: {
            title: true,
            requiresAssessment: true,
          },
        },
        user: {
          select: {
            fullName: true,
            currentAddress: true,
            educationLevel: true,
            dateOfBirth: true,
            email: true,
            gender: true,
            phoneNumber: true,
            profilePicture: true,
            regency: {
              select: {
                regency: true,
              },
            },
            experience: true,
          },
        },
      },
    });

    const count = await prisma.jobApplication.count({
      where: whereClause,
    });

    return {
      data: jobApplications,
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
