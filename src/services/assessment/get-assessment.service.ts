import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getAssessmentService = async (slug: string, role: UserRole) => {
  try {
    let selectResult: any = {};
    if (role === "ADMIN") {
      selectResult = {
        id: true,
        jobId: true,
        title: true,
        slug: true,
        description: true,
        passingScore: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      };
    } else if (role === "USER") {
      selectResult = {
        id: true,
        jobId: true,
        title: true,
        slug: true,
        description: true,
        passingScore: true,
        createdAt: true,
        updatedAt: true,
      };
    }

    const whereClause: Prisma.PreTestAssessmentWhereInput = {};

    if (role === "USER") {
      whereClause.status = "PUBLISHED";
    }

    const preTestAssessment = await prisma.preTestAssessment.findFirst({
      where: { slug, ...whereClause },
      select: selectResult,
    });

    if (!preTestAssessment) {
      throw new ApiError("Assessment not found", 404);
    }

    return preTestAssessment;
  } catch (error) {
    throw error;
  }
};
