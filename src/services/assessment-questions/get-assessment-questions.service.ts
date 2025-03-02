import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getAssessmentQuestionsService = async (
  slug: string,
  role: UserRole
) => {
  try {
    const preTestAssessment = await prisma.preTestAssessment.findUnique({
      where: { slug },
    });

    if (!preTestAssessment) {
      throw new ApiError("Pre test assessment not found", 404);
    }

    const preTestAssessmentId = preTestAssessment.id;

    const whereClause: Prisma.PreTestAssessmentQuestionWhereInput = {};

    if (preTestAssessmentId) {
      whereClause.preTestAssessmentId = preTestAssessmentId;
    }

    let selectResult: any = {};

    if (role === "ADMIN") {
      selectResult = {
        preTestAssessmentOptions: true,
      };
    } else if (role === "USER") {
      selectResult = {
        preTestAssessmentOptions: {
          select: {
            id: true,
            preTestAssessmentQuestionId: true,
            option: true,
            createdAt: true,
          },
        },
      };
    } else {
      throw new ApiError("You are not authorized", 403);
    }

    const assessmentQuestion = await prisma.preTestAssessmentQuestion.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
      include: selectResult,
    });

    return { data: assessmentQuestion };
  } catch (error) {
    throw error;
  }
};
