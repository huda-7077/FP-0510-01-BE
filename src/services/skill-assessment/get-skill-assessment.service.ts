import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getSkillAssessmentService = async (slug: string) => {
  try {
    const skillAssessment = await prisma.skillAssessment.findUnique({
      where: { slug },
    });

    if (!skillAssessment) {
      throw new ApiError("Assessment not found", 404);
    }

    return skillAssessment;
  } catch (error) {
    throw error;
  }
};
