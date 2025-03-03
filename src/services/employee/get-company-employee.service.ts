import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

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
      throw new ApiError("You are not an employee of this company", 403);
    }

    return result;
  } catch (error) {
    throw error;
  }
};
