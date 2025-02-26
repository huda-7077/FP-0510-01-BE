import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const startPreTestAssessmentService = async (
  userId: number,
  slug: string
) => {
  try {
    const preTestAssessment = await prisma.preTestAssessment.findUnique({
      where: { slug },
    });

    if (!preTestAssessment) {
      throw new ApiError("Skill assessment not found", 404);
    }
    const existingAttempt = await prisma.preTestAssessmentUserAttempt.findFirst(
      {
        where: {
          userId,
          preTestAssessmentId: preTestAssessment.id,
          createdAt: {
            gte: new Date(Date.now() - 30 * 60 * 1000),
          },
        },
      }
    );

    if (existingAttempt) {
      throw new ApiError(
        "You already finished this assessment, try again at a later time",
        400
      );
    }

    const newAttempt = await prisma.preTestAssessmentUserAttempt.create({
      data: {
        userId,
        preTestAssessmentId: preTestAssessment.id,
      },
    });

    return newAttempt;
  } catch (error) {
    throw error;
  }
};
