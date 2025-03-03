import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface CreatePreTestAssessmentQuestionBody {
  preTestAssessmentId: number;
  question: string;
  options: { option: string; isCorrect: boolean }[];
}

export const createAssessmentQuestionService = async (
  {
    preTestAssessmentId,
    question,
    options,
  }: CreatePreTestAssessmentQuestionBody,
  companyId: number
) => {
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

    const existingPreTestAssessment = await prisma.preTestAssessment.findFirst({
      where: { id: preTestAssessmentId, job: { companyId }, status: "DRAFT" },
    });

    if (!existingPreTestAssessment) {
      throw new ApiError(
        "You don't have access to modify this assessment",
        403
      );
    }

    const existingQuestionCount = await prisma.preTestAssessmentQuestion.count({
      where: { preTestAssessmentId: existingPreTestAssessment.id },
    });

    if (existingQuestionCount >= 25) {
      throw new ApiError("Cannot create more than 25 questions", 400);
    }

    const newQuestion = await prisma.preTestAssessmentQuestion.create({
      data: {
        preTestAssessmentId: existingPreTestAssessment.id,
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
