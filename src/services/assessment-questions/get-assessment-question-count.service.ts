import { prisma } from "../../lib/prisma";

export const getAssessmentQuestionCountService = async (
  assessmentId: number
) => {
  try {
    const questionCount = await prisma.assessmentQuestion.count({
      where: { assessmentId },
    });

    return questionCount;
  } catch (error) {
    throw error;
  }
};
