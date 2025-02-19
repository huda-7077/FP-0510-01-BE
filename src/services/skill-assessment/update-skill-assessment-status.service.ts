import { SkillAssessmentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface UpdateSkillAssessmentBody {
  slug: string;
  status: SkillAssessmentStatus;
}

export const updateSkillAssessmentStatusService = async (
  body: UpdateSkillAssessmentBody
) => {
  try {
    const { slug, status } = body;

    const existingSkillAssessment = await prisma.skillAssessment.findFirst({
      where: { slug },
    });

    if (!existingSkillAssessment) {
      throw new ApiError("Skill assessment not found", 404);
    }

    const existingSkillAssessmentQuestionCount =
      await prisma.skillAssessmentQuestion.count({
        where: { skillAssessmentId: existingSkillAssessment.id },
      });

    if (
      existingSkillAssessmentQuestionCount !== 25 &&
      status === SkillAssessmentStatus.PUBLISHED
    ) {
      throw new ApiError(
        "Skill assessment must have exactly 25 questions to be published",
        400
      );
    }

    const skillAssessment = await prisma.skillAssessment.update({
      where: { id: existingSkillAssessment.id },
      data: { status },
    });

    return {
      skillAssessment,
      messages: "Skill assessment status updated successfully",
    };
  } catch (error) {
    throw error;
  }
};
