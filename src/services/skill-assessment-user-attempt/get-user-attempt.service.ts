import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getUserAttemptService = async (userId: number, slug: string) => {
  try {
    const skillAssessment = await prisma.skillAssessment.findUnique({
      where: { slug },
    });

    if (!skillAssessment) {
      throw new ApiError("Skill assessment not found", 404);
    }

    const attempt = await prisma.skillAssessmentUserAttempt.findFirst({
      where: { userId, skillAssessmentId: skillAssessment.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        skillAssessmentId: true,
        createdAt: true,
        status: true,
        isPassed: true,
      },
    });

    if (!attempt) {
      throw new ApiError("No attempt found", 404);
    }

    return attempt;
  } catch (error) {
    throw error;
  }
};
