import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const startSkillAssessmentService = async (
  userId: number,
  slug: string
) => {
  try {
    const skillAssessment = await prisma.skillAssessment.findUnique({
      where: { slug },
    });

    if (!skillAssessment) {
      throw new ApiError("Skill assessment not found", 404);
    }
    const existingAttempt = await prisma.skillAssessmentUserAttempt.findFirst({
      where: {
        userId,
        skillAssessmentId: skillAssessment.id,
        createdAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000),
        },
      },
    });

    if (existingAttempt) {
      throw new ApiError(
        "You already finished this assessment, try again at a later time",
        400
      );
    }

    const newAttempt = await prisma.skillAssessmentUserAttempt.create({
      data: {
        userId,
        skillAssessmentId: skillAssessment.id,
      },
    });

    return newAttempt;
  } catch (error) {
    throw error;
  }
};
