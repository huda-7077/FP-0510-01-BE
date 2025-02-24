import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getSkillAssessmentQuestionsService = async (
  slug: string,
  role: UserRole
) => {
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

    let selectResult: any = {};

    if (role === "DEVELOPER") {
      selectResult = {
        skillAssessmentOptions: true,
      };
    } else if (role === "USER") {
      selectResult = {
        skillAssessmentOptions: {
          select: {
            id: true,
            skillAssessmentQuestionId: true,
            option: true,
            createdAt: true,
          },
        },
      };
    } else {
      throw new ApiError("You are not authorized", 403);
    }

    const assessmentQuestion = await prisma.skillAssessmentQuestion.findMany({
      where: whereClause,
      include: selectResult,
    });

    return { data: assessmentQuestion };
  } catch (error) {
    throw error;
  }
};
