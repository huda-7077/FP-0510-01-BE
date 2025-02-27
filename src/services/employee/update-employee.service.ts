import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

interface UpdateEmployeeBody {
  userId: number;
  position: string;
  isEmployee: boolean;
}

export const updateEmployeeService = async (
  body: UpdateEmployeeBody,
  companyId: number,
  id: number
) => {
  const { userId, position, isEmployee } = body;

  try {
    const checkApplicant = await prisma.jobApplication.findFirst({
      where: { job: { companyId }, userId },
      select: {
        userId: true,
      },
    });

    if (!checkApplicant) {
      throw new ApiError(
        "You don't have access to update an employee on this company",
        403
      );
    }

    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      throw new ApiError("Employee not found", 404);
    }

    return await prisma.employee.update({
      where: { id },
      data: {
        companyId,
        userId: checkApplicant.userId,
        position,
        isEmployee,
      },
    });
  } catch (error) {
    throw error;
  }
};
