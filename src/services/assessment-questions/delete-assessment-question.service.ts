import { prisma } from "../../lib/prisma";

export const deleteAssessmentQuestionService = async (id: number) => {
  try {
    const existingAssessmentQuestion =
      await prisma.assessmentQuestion.findUnique({
        where: { id },
      });

    if (!existingAssessmentQuestion) {
      throw new Error("Assessment Question not found");
    }

    await prisma.assessmentQuestion.delete({
      where: { id },
    });

    return { message: `Assessment Question #${id} deleted successfully` };
  } catch (error) {
    throw error;
  }
};
