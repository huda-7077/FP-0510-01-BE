import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getUserScoreService = async (
  userId: number,
  attemptId: number
) => {
  try {
    const attempt = await prisma.skillAssessmentUserAttempt.findUnique({
      where: { id: attemptId },
      include: {
        skillAssessmentUserAnswer: { include: { skillAssessmentOption: true } },
        skillAssessment: { select: { slug: true } },
      },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new ApiError("Invalid attempt or not found", 403);
    }

    const correctAnswers = attempt.skillAssessmentUserAnswer.filter(
      (answer) => answer.skillAssessmentOption.isCorrect
    ).length;

    const totalQuestions = await prisma.skillAssessmentQuestion.count({
      where: { skillAssessmentId: attempt.skillAssessmentId },
    });

    const score =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return {
      attemptId,
      totalQuestions,
      correctAnswers,
      score: score.toFixed(1),
      slug: attempt.skillAssessment.slug,
    };
  } catch (error) {
    throw error;
  }
};
