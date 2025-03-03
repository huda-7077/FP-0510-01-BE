import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const deleteAssessmentQuestionService = async (
  id: number,
  companyId: number
) => {
  try {
    const existingPreTestAssessment = await prisma.preTestAssessment.findFirst({
      where: {
        status: "DRAFT",
        job: { companyId },
        preTestAssessmentQuestions: { some: { id } },
      },
    });

    if (!existingPreTestAssessment) {
      throw new ApiError(
        "You don't have access to modify this assessment",
        403
      );
    }

    const existingQuestion = await prisma.preTestAssessmentQuestion.findUnique({
      where: { id, preTestAssessmentId: existingPreTestAssessment.id },
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
