import { UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const getSkillAssessmentService = async (
  slug: string,
  role: UserRole
) => {
  try {
    let selectResult: any = {};
    if (role === "DEVELOPER") {
      selectResult = {
        id: true,
        title: true,
        slug: true,
        description: true,
        passingScore: true,
        badgeImage: true,
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
        badgeImage: true,
        createdAt: true,
        updatedAt: true,
      };
    }

    const skillAssessment = await prisma.skillAssessment.findUnique({
      where: { slug },
      select: selectResult,
    });

    if (!skillAssessment) {
      throw new ApiError("Assessment not found", 404);
    }

    return skillAssessment;
  } catch (error) {
    throw error;
  }
};
