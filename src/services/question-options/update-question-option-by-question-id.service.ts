import { prisma } from "../../lib/prisma";

interface UpdateQuestionOptionBody {
  options: string[];
  isCorrect: boolean[];
}

interface UpdateQuestionOptionParams {
  questionId: number;
}

export const updateQuestionOptionByQuestionIdService = async (
  body: UpdateQuestionOptionBody,
  { questionId }: UpdateQuestionOptionParams
) => {
  try {
    const existingQuestionOptions = await prisma.assessmentOption.findMany({
      where: { questionId },
    });

    if (!existingQuestionOptions.length) {
      throw new Error("Question options not found");
    }

    const { options, isCorrect } = body;

    return await prisma.$transaction(async (tx) => {
      await tx.assessmentOption.deleteMany({
        where: { questionId },
      });

      const newOptions = await tx.assessmentOption.createMany({
        data: options.map((option, index) => ({
          questionId,
          option,
          isCorrect: isCorrect[index],
        })),
      });

      return {
        message: "Question options updated successfully",
        count: newOptions.count,
      };
    });
  } catch (error) {
    throw error;
  }
};
