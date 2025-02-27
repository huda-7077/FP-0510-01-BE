import { PreTestAssessmentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { generateSkillAssessmentUniqueSlug } from "../../utils/slug";

interface CreatePreTestAssessmentBody {
  jobId: number;
  title: string;
  description: string;
  passingScore: number;
}

export const createAssessmentService = async (
  body: CreatePreTestAssessmentBody
) => {
  try {
    const { jobId, title, description, passingScore } = body;
    const existingAssessment = await prisma.preTestAssessment.findFirst({
      where: { jobId },
    });

    if (existingAssessment) {
      throw new Error("Assessment already created for the job.");
    }

    const slug = await generateSkillAssessmentUniqueSlug(title);

    return await prisma.preTestAssessment.create({
      data: {
        jobId,
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
