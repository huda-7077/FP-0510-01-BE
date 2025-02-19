import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface UpdateSkillAssessmentQuestionBody {
  id: number;
  question: string;
  options: { option: string; isCorrect: boolean }[];
}

export const updateSkillAssessmentQuestionService = async ({
  id,
  question,
  options,
}: UpdateSkillAssessmentQuestionBody) => {
  try {
    const existingQuestion = await prisma.skillAssessmentQuestion.findUnique({
      where: { id },
      include: { skillAssessmentOptions: true },
    });

    if (!existingQuestion) {
      throw new ApiError("Question not found", 404);
    }

    if (options.length !== 4) {
      throw new ApiError("Each question must have exactly 4 options", 400);
    }

    const correctAnswers = options.filter((opt) => opt.isCorrect).length;
    if (correctAnswers !== 1) {
      throw new ApiError("Exactly one option must be correct", 400);
    }

    await prisma.skillAssessmentQuestion.update({
      where: { id },
      data: {
        question,
        skillAssessmentOptions: {
          deleteMany: { skillAssessmentQuestionId: id },
          create: options,
        },
      },
    });

    return { message: `Question #${id} updated successfully` };
  } catch (error) {
    throw error;
  }
};
