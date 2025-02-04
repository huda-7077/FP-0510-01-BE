import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface GetAssessmentQuery {
  jobId?: number;
  userId?: number;
}

export const getAssessmentsService = async (query: GetAssessmentQuery) => {
  try {
    const { jobId, userId } = query;

    const parsedJobId = jobId && Number(jobId);
    const parsedUserId = userId && Number(userId);

    const whereClause: Prisma.AssessmentWhereInput = {};

    if (parsedJobId) {
      whereClause.jobId = parsedJobId;
    }

    if (parsedUserId) {
      whereClause.userAssessments = {
        some: {
          userId: parsedUserId,
        },
      };
    }

    const assessment = await prisma.assessment.findMany({
      where: whereClause,
      include: {
        userAssessments: {
          select: {
            userId: true,
            score: true,
          },
        },
      },
    });

    return { data: assessment };
  } catch (error) {
    throw error;
  }
};
