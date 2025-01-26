import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface GetAssessmentQuery {
  jobId: number;
}

export const getAssessmentsService = async (query: GetAssessmentQuery) => {
  try {
    const { jobId } = query;

    const parsedJobId = jobId && Number(jobId);

    const whereClause: Prisma.AssessmentWhereInput = {};

    if (parsedJobId) {
      whereClause.jobId = parsedJobId;
    }

    const assessment = await prisma.assessment.findMany({
      where: whereClause,
    });

    return { data: assessment };
  } catch (error) {
    throw error;
  }
};
