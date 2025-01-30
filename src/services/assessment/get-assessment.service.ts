import { prisma } from "../../lib/prisma";

export const getAssessmentService = async (id: number) => {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new Error("Assessment not found");
    }

    return assessment;
  } catch (error) {
    throw error;
  }
};
