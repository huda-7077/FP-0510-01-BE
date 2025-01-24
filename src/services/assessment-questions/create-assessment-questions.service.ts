import { prisma } from "../../lib/prisma";

export interface AssessmentQuestions {
  assessmentId: number;
  questions: string[];
}

export const createAssessmentQuestionsService = async (
  body: AssessmentQuestions
) => {
  const { assessmentId, questions } = body;
  try {
    if (!assessmentId || questions.length < 1) {
      throw new Error("Data tidak valid");
    }

    return await prisma.assessmentQuestion.createMany({
      data: questions.map((question: string) => ({
        assessmentId,
        question: question,
      })),
    });
  } catch (error) {
    throw error;
  }
};
