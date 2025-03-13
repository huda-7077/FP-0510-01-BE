import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const getJobService = async (
  slug: string,
  companyId?: number,
  isPublished?: boolean,
  isExpired?: boolean
) => {
  try {
    const whereClause: Prisma.JobWhereUniqueInput = { slug, isDeleted: false };

    if (companyId) {
      whereClause.companyId = companyId;
    }

    if (isPublished) {
      whereClause.isPublished = isPublished;
    }

    if (isExpired !== undefined) {
      if (isExpired === false) {
        whereClause.applicationDeadline = { gt: new Date() };
      } else {
        whereClause.applicationDeadline = { lte: new Date() };
      }
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
            slug: true,
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
