import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const saveUserAnswerService = async (
  userId: number,
  attemptId: number,
  questionId: number,
  selectedOptionId: number
) => {
  try {
    const attempt = await prisma.preTestAssessmentUserAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new ApiError("Invalid attempt", 403);
    }

    return await prisma.preTestAssessmentUserAnswer.upsert({
      where: {
        preTestAssessmentQuestionId_preTestAssessmentUserAttemptId: {
          preTestAssessmentQuestionId: questionId,
          preTestAssessmentUserAttemptId: attemptId,
        },
      },
      update: { selectedOptionId },
      create: {
        preTestAssessmentUserAttemptId: attemptId,
        preTestAssessmentQuestionId: questionId,
        selectedOptionId,
      },
    });
  } catch (error) {
    throw error;
  }
};
