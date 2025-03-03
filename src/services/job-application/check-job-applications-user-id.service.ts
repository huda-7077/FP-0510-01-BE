import { prisma } from "../../lib/prisma";

export const checkJobApplicationsUserIdService = async (
  jobId: number,
  userId: number
) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1
        FROM "job_applications"
        WHERE "jobId" = ${jobId} AND "userId" = ${userId}
      ) AS "exists"
    `;

    const exists = (result as { exists: boolean }[])[0]?.exists || false;

    return { isExist: exists };
  } catch (error) {
    throw error;
  }
};
