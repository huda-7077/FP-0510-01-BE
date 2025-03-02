import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const getJobService = async (id: number, companyId?: number) => {
  try {
    const whereClause: Prisma.JobWhereUniqueInput = { id, isDeleted: false };

    if (companyId) {
      whereClause.companyId = companyId;
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
