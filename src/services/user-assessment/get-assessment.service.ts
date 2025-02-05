import { prisma } from "../../lib/prisma";

export const getUserAssessmentService = async (id: number) => {
  try {
    const userAssessment = await prisma.userAssessment.findUnique({
      where: { id },
    });

    if (!userAssessment) {
      throw new Error("User assessment not found");
    }

    return userAssessment;
  } catch (error) {
    throw error;
  }
};
