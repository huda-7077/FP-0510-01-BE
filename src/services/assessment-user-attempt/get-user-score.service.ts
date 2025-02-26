import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getUserScoreService = async (
  userId: number,
  attemptId: number
) => {
  try {
    const attempt = await prisma.preTestAssessmentUserAttempt.findUnique({
      where: { id: attemptId },
      include: {
        preTestAssessmentUserAnswer: {
          include: { preTestAssessmentOption: true },
        },
        preTestAssessment: { select: { slug: true } },
      },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new ApiError("Invalid attempt or not found", 403);
    }

    const correctAnswers = attempt.preTestAssessmentUserAnswer.filter(
      (answer) => answer.preTestAssessmentOption.isCorrect
    ).length;

    const totalQuestions = await prisma.preTestAssessmentQuestion.count({
      where: { preTestAssessmentId: attempt.preTestAssessmentId },
    });

    const score =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return {
      attemptId,
      totalQuestions,
      correctAnswers,
      score,
      slug: attempt.preTestAssessment.slug,
    };
  } catch (error) {
    throw error;
  }
};
