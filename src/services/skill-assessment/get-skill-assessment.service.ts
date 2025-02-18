import { prisma } from "../../lib/prisma";

export const getSkillAssessmentService = async (slug: string) => {
  try {
    const skillAssessment = await prisma.skillAssessment.findUnique({
      where: { slug },
    });

    if (!skillAssessment) {
      throw new Error("Assessment not found");
    }

    return skillAssessment;
  } catch (error) {
    throw error;
  }
};
