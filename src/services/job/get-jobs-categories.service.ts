import { prisma } from "../../lib/prisma";

interface GetJobCategoriesQuery {
  companyId: number;
}

export const getJobCategoriesService = async (query: GetJobCategoriesQuery) => {
  try {
    const result = await prisma.$queryRaw<{ category: string }[]>`
          SELECT DISTINCT category 
          FROM "jobs"
          WHERE "companyId" = ${query.companyId}
          ORDER BY category ASC
        `;

    const categories = result.map((row) => row.category);

    return { data: categories };
  } catch (error) {
    throw error;
  }
};
