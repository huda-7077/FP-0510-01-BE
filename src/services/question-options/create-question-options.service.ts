import { prisma } from "../../lib/prisma";

export interface QuestionOptions {
  questionId: number;
  options: string[];
  isCorrect: boolean[];
}

export const createQuestionOptionsService = async (body: QuestionOptions) => {
  const { questionId, options, isCorrect } = body;

  try {
    if (!questionId || !Number.isInteger(questionId) || questionId <= 0) {
      throw new Error("Invalid question ID");
    }

    if (!Array.isArray(options) || !Array.isArray(isCorrect)) {
      throw new Error("Options and isCorrect must be arrays");
    }

    if (options.length !== isCorrect.length) {
      throw new Error(
        "Number of options and correctness indicators must match"
      );
    }

    if (!isCorrect.some((correct) => correct === true)) {
      throw new Error("At least one option must be marked as correct");
    }

    if (
      options.some((opt) => typeof opt !== "string" || opt.trim().length === 0)
    ) {
      throw new Error("All options must be non-empty strings");
    }

    const cleanedOptions = options.map((opt) => opt.trim());

    const duplicateIndex = cleanedOptions.findIndex((option, index) => {
      return cleanedOptions
        .slice(0, index)
        .some(
          (prevOption) => prevOption.toLowerCase() === option.toLowerCase()
        );
    });

    if (duplicateIndex !== -1) {
      throw new Error(`Duplicate option found: "${options[duplicateIndex]}"`);
    }

    const result = await prisma.$transaction(async (tx) => {
      const question = await tx.assessmentQuestion.findUnique({
        where: { id: questionId },
        select: { id: true },
      });

      if (!question) {
        throw new Error("Question not found");
      }

      return await tx.assessmentOption.createMany({
        data: cleanedOptions.map((option, idx) => ({
          questionId,
          option,
          isCorrect: isCorrect[idx],
        })),
      });
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("foreign key constraint")) {
        throw new Error("Invalid question reference");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
