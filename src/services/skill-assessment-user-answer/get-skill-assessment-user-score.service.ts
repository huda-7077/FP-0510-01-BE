import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getSkillAssessmentUserScoreService = async (
  userId: number,
  slug: string
) => {
  try {
    const skillAssessment = await prisma.skillAssessment.findUnique({
      where: { slug },
    });

    if (!skillAssessment) {
      throw new ApiError("Skill assessment not found", 404);
    }

    const skillAssessmentId = skillAssessment.id;

    const userAnswers = await prisma.skillAssessmentUserAnswer.findMany({
      where: {
        userId,
        skillAssessmentQuestion: {
          skillAssessmentId,
        },
      },
      include: {
        skillAssessmentOption: true,
      },
    });

    // Ambil semua pertanyaan yang terkait dengan skill assessment ini
    const totalQuestions = await prisma.skillAssessmentQuestion.count({
      where: { skillAssessmentId },
    });

    if (userAnswers.length !== totalQuestions) {
      throw new ApiError(
        "You must answer all questions before submitting",
        400
      );
    }

    // Hitung jumlah jawaban yang benar
    const correctAnswers = userAnswers.filter(
      (answer) => answer.skillAssessmentOption.isCorrect
    ).length;

    // Hitung skor (misalnya: 1 soal benar = 4 poin)
    const score = (correctAnswers / totalQuestions) * 100;

    return { totalQuestions, correctAnswers, score };
  } catch (error) {
    throw error;
  }
};
