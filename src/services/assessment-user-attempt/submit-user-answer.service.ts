import { PreTestAssessmentUserAttemptStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const submitUserAnswersService = async (
  userId: number,
  attemptId: number
) => {
  try {
    const attempt = await prisma.preTestAssessmentUserAttempt.findUnique({
      where: { id: attemptId },
      include: { preTestAssessmentUserAnswer: true },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new ApiError("Invalid attempt", 403);
    }

    const elapsedTime = Date.now() - new Date(attempt.createdAt).getTime();
    if (elapsedTime > 2 * 60 * 60 * 1000) {
      throw new ApiError(
        "Time is up, you answer will be submitted automatically",
        400
      );
    }

    const correctAnswers = await prisma.preTestAssessmentUserAnswer.count({
      where: {
        preTestAssessmentUserAttemptId: attemptId,
        preTestAssessmentOption: {
          isCorrect: true,
        },
      },
    });

    await prisma.preTestAssessmentUserAttempt.update({
      where: { id: attemptId },
      data: {
        correctAnswer: correctAnswers,
        status: PreTestAssessmentUserAttemptStatus.ENDED,
      },
    });

    return { message: "Submitted successfully", correctAnswers };
  } catch (error) {
    throw error;
  }
};
