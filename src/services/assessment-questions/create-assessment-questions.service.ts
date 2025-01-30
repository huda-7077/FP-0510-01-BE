import { prisma } from "../../lib/prisma";

export interface AssessmentQuestions {
  assessmentId: number;
  questions: string[];
}

const BATCH_SIZE = 1000;

export const createAssessmentQuestionsService = async (
  body: AssessmentQuestions
) => {
  const { assessmentId, questions } = body;

  try {
    if (!assessmentId || !Number.isInteger(assessmentId) || assessmentId <= 0) {
      throw new Error("Invalid assessment ID");
    }

    if (!Array.isArray(questions) || questions.length < 1) {
      throw new Error("Questions must be a non-empty array");
    }

    if (questions.some((q) => typeof q !== "string" || q.trim().length === 0)) {
      throw new Error("All questions must be non-empty strings");
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: { id: true },
    });

    if (!assessment) {
      throw new Error("Assessment not found");
    }

    let totalCreated = 0;
    const cleanedQuestions = questions.map((q) => q.trim());

    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < cleanedQuestions.length; i += BATCH_SIZE) {
        const batch = cleanedQuestions.slice(i, i + BATCH_SIZE);
        const result = await tx.assessmentQuestion.createMany({
          data: batch.map((question) => ({
            assessmentId,
            question,
          })),
          skipDuplicates: true,
        });
        totalCreated += result.count;
      }
    });

    return { count: totalCreated };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("foreign key constraint")) {
        throw new Error("Invalid assessment reference");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
