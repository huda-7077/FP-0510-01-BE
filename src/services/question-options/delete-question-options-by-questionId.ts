import { prisma } from "../../lib/prisma";

interface DeleteQuestionOptionParams {
  questionId: number;
}

export const deleteQuestionOptionsByQuestionIdService = async ({
  questionId,
}: DeleteQuestionOptionParams) => {
  try {
    const existingOptions = await prisma.assessmentOption.findMany({
      where: { questionId },
    });

    if (!existingOptions.length) {
      throw new Error(`No options found for question ID ${questionId}`);
    }

    await prisma.assessmentOption.deleteMany({
      where: { questionId },
    });

    return {
      message: `All options for question #${questionId} deleted successfully`,
      count: existingOptions.length,
    };
  } catch (error) {
    throw error;
  }
};
