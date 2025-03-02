import { PreTestAssessmentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { generateSkillAssessmentUniqueSlug } from "../../utils/slug";
import { ApiError } from "../../utils/apiError";

interface CreatePreTestAssessmentBody {
  jobId: number;
  title: string;
  description: string;
  passingScore: number;
}

export const createAssessmentService = async (
  body: CreatePreTestAssessmentBody,
  companyId: number
) => {
  try {
    const { jobId, title, description, passingScore } = body;

    const assessmentJob = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      select: {
        id: true,
      },
    });

    if (!assessmentJob) {
      throw new ApiError(
        "You don't have access to create assessment for this company",
        403
      );
    }

    const existingAssessment = await prisma.preTestAssessment.findFirst({
      where: { jobId: assessmentJob.id },
    });

    if (existingAssessment) {
      throw new ApiError("Assessment already created for the job.", 404);
    }

    const slug = await generateSkillAssessmentUniqueSlug(title);

    return await prisma.preTestAssessment.create({
      data: {
        jobId: assessmentJob.id,
        title,
        slug,
        description,
        passingScore: Number(passingScore),
        status: PreTestAssessmentStatus.DRAFT,
      },
    });
  } catch (error) {
    throw error;
  }
};
