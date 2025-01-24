import { prisma } from "../../lib/prisma";

export const deleteAssessmentService = async (id: number) => {
  try {
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!existingAssessment) {
      throw new Error("Assessment not found");
    }

    await prisma.assessment.delete({
      where: { id },
    });

    return { message: `Assessment #${id} deleted successfully` };
  } catch (error) {
    throw error;
  }
};
