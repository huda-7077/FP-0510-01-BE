import { PreTestAssessmentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface UpdatePreTestAssessmentBody {
  slug: string;
  status: PreTestAssessmentStatus;
}

export const updateAssessmentStatusService = async (
  body: UpdatePreTestAssessmentBody,
  companyId: number
) => {
  const { slug, status } = body;
  try {
    const existingAssessment = await prisma.preTestAssessment.findFirst({
      where: { slug, job: { companyId } },
    });

    if (!existingAssessment) {
      throw new ApiError("Pre test assessment not found", 404);
    }

    const existingPreTestAssessmentQuestionCount =
      await prisma.preTestAssessmentQuestion.count({
        where: { preTestAssessmentId: existingAssessment.id },
      });

    if (
      existingPreTestAssessmentQuestionCount !== 25 &&
      status === PreTestAssessmentStatus.PUBLISHED
    ) {
      throw new ApiError(
        "Pre test assessment must have exactly 25 questions to be published",
        400
      );
    }

    const preTestAssessment = await prisma.preTestAssessment.update({
      where: { id: existingAssessment.id },
      data: { status },
    });

    return {
      skillAssessment: preTestAssessment,
      messages: "Pre test assessment status updated successfully",
    };
  } catch (error) {
    throw error;
  }
};
