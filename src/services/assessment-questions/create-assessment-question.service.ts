import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface CreatePreTestAssessmentQuestionBody {
  preTestAssessmentId: number;
  question: string;
  options: { option: string; isCorrect: boolean }[];
}

export const createAssessmentQuestionService = async ({
  preTestAssessmentId,
  question,
  options,
}: CreatePreTestAssessmentQuestionBody) => {
  try {
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

    const existingQuestionCount = await prisma.preTestAssessmentQuestion.count({
      where: { preTestAssessmentId },
    });

    if (existingQuestionCount >= 25) {
      throw new ApiError("Cannot create more than 25 questions", 400);
    }

    const newQuestion = await prisma.preTestAssessmentQuestion.create({
      data: {
        preTestAssessmentId,
        question,
        preTestAssessmentOptions: {
          create: options,
        },
      },
      include: { preTestAssessmentOptions: true },
    });

    return newQuestion;
  } catch (error) {
    throw error;
  }
};
