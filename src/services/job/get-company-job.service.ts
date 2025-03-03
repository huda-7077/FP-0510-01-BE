import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getCompanyJobService = async (id: number, userId: number) => {
  try {
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

    const whereClause: Prisma.JobWhereUniqueInput = { id, isDeleted: false };

    if (user) {
      if (!user.companyId) {
        throw new ApiError("Admin is not associated with any company", 403);
      }
      whereClause.companyId = user.companyId;
    } else {
      throw new ApiError("User not found", 404);
    }

    const job = await prisma.job.findUnique({
      where: whereClause,
      include: {
        companyLocation: {
          select: {
            address: true,
            regency: {
              select: {
                regency: true,
                province: { select: { province: true } },
              },
            },
          },
        },
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
      },
    });

    if (!job) {
      throw new ApiError("Job not found", 404);
    }

    return job;
  } catch (error) {
    throw error;
  }
};
