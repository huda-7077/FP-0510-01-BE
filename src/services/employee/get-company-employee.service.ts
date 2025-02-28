import { prisma } from "../../lib/prisma";

export const getCompanyEmployeeService = async (
  companyId: number,
  userId: number
) => {
  try {
    const result = await prisma.employee.findFirst({
      where: {
        userId,
        companyId,
      },
    });

    if (!result) {
      throw new Error("You are not an employee of this company");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
