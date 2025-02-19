import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getSkillAssessmentQuestionsService = async (slug: string) => {
  try {
    const skillAssessment = await prisma.skillAssessment.findUnique({
      where: { slug },
    });

    if (!skillAssessment) {
      throw new ApiError("Skill assessment not found", 404);
    }

    const skillAssessmentId = skillAssessment.id;

    const whereClause: Prisma.SkillAssessmentQuestionWhereInput = {};

    if (skillAssessmentId) {
      whereClause.skillAssessmentId = skillAssessmentId;
    }

    const assessmentQuestion = await prisma.skillAssessmentQuestion.findMany({
      where: whereClause,
      include: {
        skillAssessmentOptions: true,
      },
    });

    return { data: assessmentQuestion };
  } catch (error) {
    throw error;
  }
};
