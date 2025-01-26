import { AssessmentQuestion } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const createAssessmentQuestionService = async (
  body: AssessmentQuestion
) => {
  try {
    return await prisma.assessmentQuestion.create({
      data: {
        ...body,
      },
    });
  } catch (error) {
    throw error;
  }
};
