import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const saveUserAnswerService = async (
  userId: number,
  attemptId: number,
  questionId: number,
  selectedOptionId: number
) => {
  try {
    const attempt = await prisma.skillAssessmentUserAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new ApiError("Invalid attempt", 403);
    }

    return await prisma.skillAssessmentUserAnswer.upsert({
      where: {
        skillAssessmentUserAttemptId_skillAssessmentQuestionId: {
          skillAssessmentUserAttemptId: attemptId,
          skillAssessmentQuestionId: questionId,
        },
      },
      update: { selectedOptionId },
      create: {
        skillAssessmentUserAttemptId: attemptId,
        skillAssessmentQuestionId: questionId,
        selectedOptionId,
      },
    });
  } catch (error) {
    throw error;
  }
};
