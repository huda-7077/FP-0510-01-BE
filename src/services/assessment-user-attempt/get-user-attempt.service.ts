import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getUserAttemptService = async (userId: number) => {
  try {
    const attempt = await prisma.preTestAssessmentUserAttempt.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        preTestAssessmentId: true,
        createdAt: true,
        status: true,
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
