import { prisma } from "../../lib/prisma";

interface GetUsersEducationLevelByJobIdQuery {
  jobId: number;
}

export const GetUsersEducationLevelByJobIdService = async (
  query: GetUsersEducationLevelByJobIdQuery
) => {
  try {
    const result = await prisma.$queryRaw<{ educationLevel: string }[]>`
          SELECT DISTINCT "educationLevel"
          FROM users u
          JOIN job_applications ja ON u.id = "userId"
          JOIN jobs j ON "jobId"= j.id
          WHERE j.id = ${query.jobId};
        `;

    const educationLevels = result.map((row) => row.educationLevel);

    return { data: educationLevels };
  } catch (error) {
    throw error;
  }
};
