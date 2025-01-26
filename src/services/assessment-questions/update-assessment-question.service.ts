import { prisma } from "../../lib/prisma";

interface UpdateAssessmentQuestionBody {
  question?: string;
}

export const updateAssessmentQuestionService = async (
  body: UpdateAssessmentQuestionBody,
  id: number
) => {
  try {
    const existingAssessmentQuestion =
      await prisma.assessmentQuestion.findUnique({
        where: { id },
      });

    if (!existingAssessmentQuestion) {
      throw new Error("Assessment Question not found");
    }

    return await prisma.assessmentQuestion.update({
      where: { id },
      data: {
        ...body,
      },
    });
  } catch (error) {
    throw error;
  }
};
