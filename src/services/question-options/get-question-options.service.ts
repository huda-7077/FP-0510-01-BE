import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { PaginationQueryParams } from "../../types/pagination";

interface GetQuestionOptionsQuery {
  questionId: number;
}

export const getQuestionOptionsService = async (
  query: GetQuestionOptionsQuery
) => {
  try {
    const { questionId } = query;

    const parsedQuestionId = questionId && Number(questionId);

    const whereClause: Prisma.AssessmentOptionWhereInput = {};

    if (parsedQuestionId) {
      whereClause.questionId = parsedQuestionId;
    }

    const questionOptions = await prisma.assessmentOption.findMany({
      where: whereClause,
    });

    return { data: questionOptions };
  } catch (error) {
    throw error;
  }
};
