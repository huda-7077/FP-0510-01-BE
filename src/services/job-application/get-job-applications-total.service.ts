import { prisma } from "../../lib/prisma";

interface GetJobApplicationsTotalQuery {
  jobId?: number;
}

export const getJobApplicationsTotalService = async (
  query: GetJobApplicationsTotalQuery
) => {
  try {
    const result = await prisma.$queryRaw<{ count: bigint }[]>`
          SELECT COUNT(*) AS count 
          FROM "job_applications"
          WHERE "jobId" = ${query.jobId}
        `;

    const count = result[0]?.count ? Number(result[0].count) : 0;

    return { count };
  } catch (error) {
    throw error;
  }
};
