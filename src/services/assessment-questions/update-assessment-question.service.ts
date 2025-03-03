import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface UpdatePreTestAssessmentQuestionBody {
  id: number;
  question: string;
  options: { option: string; isCorrect: boolean }[];
}

export const updateAssessmentQuestionService = async (
  { id, question, options }: UpdatePreTestAssessmentQuestionBody,
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
