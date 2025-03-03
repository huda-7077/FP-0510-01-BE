import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface RegisterEmployeeServiceBody {
  userId: number;
  position: string;
}

export const registerEmployeeService = async (
  body: RegisterEmployeeServiceBody,
  companyId: number
) => {
  try {
    const { userId, position } = body;

    const checkApplicant = await prisma.jobApplication.findFirst({
      where: { job: { companyId }, userId },
      select: {
        userId: true,
      },
    });

    if (!checkApplicant) {
      throw new ApiError(
        "You don't have access to register an employee on this company",
        403
      );
    }

    const existingEmployee = await prisma.employee.findFirst({
      where: { userId: checkApplicant.userId, companyId },
    });

    if (existingEmployee) {
      throw new ApiError(
        "User has already been registered as an employee.",
        400
      );
    }

    return await prisma.employee.create({
      data: {
        companyId,
        userId: checkApplicant.userId,
        position,
        isEmployee: true,
      },
    });
  } catch (error) {
    throw error;
  }
};
