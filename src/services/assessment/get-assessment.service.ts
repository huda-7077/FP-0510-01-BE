import { UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getAssessmentService = async (slug: string, role: UserRole) => {
  try {
    let selectResult: any = {};
    if (role === "ADMIN") {
      selectResult = {
        id: true,
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
        title: true,
        slug: true,
        description: true,
        passingScore: true,
        createdAt: true,
        updatedAt: true,
      };
    }

    const preTestAssessment = await prisma.preTestAssessment.findUnique({
      where: { slug },
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
