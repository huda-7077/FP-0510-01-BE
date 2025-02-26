import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface UpdatePreTestAssessmentQuestionBody {
  id: number;
  question: string;
  options: { option: string; isCorrect: boolean }[];
}

export const updateAssessmentQuestionService = async ({
  id,
  question,
  options,
}: UpdatePreTestAssessmentQuestionBody) => {
  try {
    const existingQuestion = await prisma.preTestAssessmentQuestion.findUnique({
      where: { id },
      include: { preTestAssessmentOptions: true },
    });

    if (!existingQuestion) {
      throw new ApiError("Question not found", 404);
    }

    if (options.length !== 4) {
      throw new ApiError("Each question must have exactly 4 options", 400);
    }

    const correctAnswers = options.filter((opt) => opt.isCorrect).length;
    if (correctAnswers !== 1) {
      throw new ApiError(
        "A question must have exactly one correct option",
        400
      );
    }

    await prisma.preTestAssessmentQuestion.update({
      where: { id },
      data: {
        question,
        preTestAssessmentOptions: {
          deleteMany: { preTestAssessmentQuestionId: id },
          create: options,
        },
      },
    });

    return { message: `Question #${id} updated successfully` };
  } catch (error) {
    throw error;
  }
};
