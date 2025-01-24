import { prisma } from "../../lib/prisma";

export interface QuestionOptions {
  questionId: number;
  options: string[];
  isCorrect: boolean[];
}

export const createQuestionOptionsService = async (body: QuestionOptions) => {
  const { questionId, options } = body;
  try {
    if (!questionId || options.length < 1) {
      throw new Error("Data tidak valid");
    }

    return await prisma.assessmentOption.createMany({
      data: options.map((option: string, index) => ({
        questionId,
        option: option,
        isCorrect: body.isCorrect[index],
      })),
    });
  } catch (error) {
    throw error;
  }
};
