import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface CreateSkillAssessmentQuestionBody {
  skillAssessmentId: number;
  question: string;
  options: { option: string; isCorrect: boolean }[];
}

export const createSkillAssessmentQuestionService = async ({
  skillAssessmentId,
  question,
  options,
}: CreateSkillAssessmentQuestionBody) => {
  try {
    if (options.length !== 4) {
      throw new ApiError("Each question must have exactly 4 options", 400);
    }

    const correctAnswers = options.filter((opt) => opt.isCorrect).length;
    if (correctAnswers !== 1) {
      throw new ApiError("Exactly one option must be correct", 400);
    }

    const existingQuestionCount = await prisma.skillAssessmentQuestion.count({
      where: { skillAssessmentId },
    });

    if (existingQuestionCount >= 25) {
      throw new ApiError(
        "Cannot create more than 25 questions for a skill assessment",
        400
      );
    }

    const newQuestion = await prisma.skillAssessmentQuestion.create({
      data: {
        skillAssessmentId,
        question,
        skillAssessmentOptions: {
          create: options,
        },
      },
      include: { skillAssessmentOptions: true },
    });

    return newQuestion;
  } catch (error) {
    throw error;
  }
};
