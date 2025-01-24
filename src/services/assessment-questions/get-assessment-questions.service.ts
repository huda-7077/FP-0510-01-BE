import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetAssessmentQuestionQuery {
  assessmentId: number;
}

export const getAssessmentQuestionsService = async (
  query: GetAssessmentQuestionQuery
) => {
  try {
    const { assessmentId } = query;

    const parsedAssessmentId = assessmentId && Number(assessmentId);

    const whereClause: Prisma.AssessmentQuestionWhereInput = {};

    if (parsedAssessmentId) {
      whereClause.assessmentId = parsedAssessmentId;
    }

    const assessmentQuestion = await prisma.assessmentQuestion.findMany({
      where: whereClause,
    });

    return { data: assessmentQuestion };
  } catch (error) {
    throw error;
  }
};
