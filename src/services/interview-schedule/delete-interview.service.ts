import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const deleteInterviewService = async (id: number, userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
      include: {
        company: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError("Authentication Failed", 401);
    }

    if (!user.companyId) {
      throw new ApiError("Authorization Failed", 403);
    }

    const existingInterview = await prisma.interview.findUnique({
      where: {
        id,
        jobApplication: { job: { companyId: user.companyId } },
        isDeleted: false,
      },
    });

    if (!existingInterview) {
      throw new ApiError("Interview not found or you don't have access", 404);
    }

    await prisma.interview.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return { message: `Interview #${id} deleted successfully` };
  } catch (error) {
    throw error;
  }
};
