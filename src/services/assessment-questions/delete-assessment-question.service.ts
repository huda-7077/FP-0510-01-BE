import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const deleteAssessmentQuestionService = async (id: number) => {
  try {
    const existingQuestion = await prisma.preTestAssessmentQuestion.findUnique({
      where: { id },
      include: { preTestAssessmentOptions: true },
    });

    if (!existingQuestion) {
      throw new ApiError("Pre test assessment question not found", 404);
    }

    await prisma.preTestAssessmentOption.deleteMany({
      where: { preTestAssessmentQuestionId: id },
    });

    await prisma.preTestAssessmentQuestion.delete({
      where: { id },
    });

    return {
      message: `Pre test assessment question #${id} deleted successfully`,
    };
  } catch (error) {
    throw error;
  }
};
