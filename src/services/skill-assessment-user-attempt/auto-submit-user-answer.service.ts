import { SkillAssessmentUserAttemptStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const autoSubmitUserAnswersService = async (
  userId: number,
  attemptId: number
) => {
  try {
    const attempt = await prisma.skillAssessmentUserAttempt.findUnique({
      where: { id: attemptId },
      include: { skillAssessmentUserAnswer: true },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new ApiError("Invalid attempt", 403);
    }

    const elapsedTime = Date.now() - new Date(attempt.createdAt).getTime();
    if (elapsedTime < 30 * 60 * 1000) {
      throw new ApiError("Time is not up yet", 400);
    }

    const correctAnswers = await prisma.skillAssessmentUserAnswer.count({
      where: {
        skillAssessmentUserAttemptId: attemptId,
        skillAssessmentOption: {
          isCorrect: true,
        },
      },
    });

    await prisma.skillAssessmentUserAttempt.update({
      where: { id: attemptId },
      data: {
        correctAnswer: correctAnswers,
        status: SkillAssessmentUserAttemptStatus.ENDED,
      },
    });

    return { message: "Auto-submitted successfully", correctAnswers };
  } catch (error) {
    throw error;
  }
};
