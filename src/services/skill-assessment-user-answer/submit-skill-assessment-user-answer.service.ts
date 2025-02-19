import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const submitSkillAssessmentUserAnswerService = async (
  userId: number,
  questionId: number,
  selectedOptionId: number
) => {
  try {
    const existingAnswer = await prisma.skillAssessmentUserAnswer.findFirst({
      where: { userId, skillAssessmentQuestionId: questionId },
    });

    if (existingAnswer) {
      throw new ApiError("You have already answered this question", 400);
    }

    await prisma.skillAssessmentUserAnswer.create({
      data: {
        userId,
        skillAssessmentQuestionId: questionId,
        selectedOptionId,
      },
    });

    return { message: "Answer submitted successfully" };
  } catch (error) {
    throw error;
  }
};
