import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getAssessmentSlugByJobIdService = async (userId: number) => {
  try {
    const jobApplication = await prisma.jobApplication.findFirst({
      where: {
        userId,
      },
      select: {
        jobId: true,
      },
    });

    if (!jobApplication) {
      throw new ApiError("You don't have access to this assessment", 403);
    }

    const preTestAssessment = await prisma.preTestAssessment.findFirst({
      where: { status: "PUBLISHED", jobId: jobApplication.jobId },
      select: {
        slug: true,
      },
    });

    if (!preTestAssessment) {
      throw new ApiError("Assessment not found", 404);
    }

    return preTestAssessment;
  } catch (error) {
    throw error;
  }
};
