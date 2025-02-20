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

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const whereClause: Prisma.JobWhereUniqueInput = { id, isDeleted: false };

    if (user.role === "ADMIN") {
      if (!user.companyId) {
        throw new ApiError("Admin is not associated with any company", 403);
      }
      whereClause.companyId = user.companyId;
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
        assessments: {
          select: {
            id: true,
            passingScore: true,
          },
        },
      },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    return job;
  } catch (error) {
    throw error;
  }
};
