import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetJobApplicationsQuery extends PaginationQueryParams {
  search: string;
  jobId: number;
  educationLevel: string;
}

export const getJobApplicationsService = async (
  query: GetJobApplicationsQuery
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

    const whereClause: Prisma.JobApplicationWhereInput = {};

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
        : sortBy === "id"
        ? {
            user: {
              fullName: sortOrder as Prisma.SortOrder,
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
