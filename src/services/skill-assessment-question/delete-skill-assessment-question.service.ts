import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const deleteSkillAssessmentQuestionService = async (id: number) => {
  try {
    const existingQuestion = await prisma.skillAssessmentQuestion.findUnique({
      where: { id },
      include: { skillAssessmentOptions: true },
    });

    if (!existingQuestion) {
      throw new ApiError("Skill Assessment Question not found", 404);
    }

    await prisma.skillAssessmentOption.deleteMany({
      where: { skillAssessmentQuestionId: id },
    });

    await prisma.skillAssessmentQuestion.delete({
      where: { id },
    });

    return { message: `Skill Assessment Question #${id} deleted successfully` };
  } catch (error) {
    throw error;
  }
};
