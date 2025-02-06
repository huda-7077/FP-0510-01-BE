import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface GetUserAssessmentQuery {
  assessmentId?: number;
  userId?: number;
}

export const getUserAssessmentsService = async (
  query: GetUserAssessmentQuery
) => {
  try {
    const { assessmentId, userId } = query;

    const parsedAssessmentId = assessmentId && Number(assessmentId);
    const parsedUserId = userId && Number(userId);

    const whereClause: Prisma.UserAssessmentWhereInput = {};

    if (parsedAssessmentId) {
      whereClause.assessmentId = parsedAssessmentId;
    }

    if (parsedUserId) {
      whereClause.userId = parsedUserId;
    }

    const assessment = await prisma.userAssessment.findMany({
      where: whereClause,
      include: {
        assessment: true,
      },
    });

    return { data: assessment };
  } catch (error) {
    throw error;
  }
};
