import { prisma } from "../../lib/prisma";

export const checkEmployeeExistanceService = async (
  companyId: number,
  userId: number
) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1
        FROM "employees"
        WHERE "companyId" = ${companyId} AND "userId" = ${userId}
      ) AS "exists"
    `;

    const exists = (result as { exists: boolean }[])[0]?.exists || false;

    return { isExist: exists };
  } catch (error) {
    console.error("Error checking employee user ID:", error);
    throw error;
  }
};
