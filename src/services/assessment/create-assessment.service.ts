import { Assessment } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const createAssessmentService = async (body: Assessment) => {
  try {
    const { jobId } = body;
    const existingAssessment = await prisma.assessment.findFirst({
      where: { jobId },
    });

    if (existingAssessment) {
      throw new Error("Assessment already created for the job.");
    }

    return await prisma.assessment.create({
      data: {
        ...body,
      },
    });
  } catch (error) {
    throw error;
  }
};
