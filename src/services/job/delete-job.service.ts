import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const deleteJobService = async (id: number, companyId: number) => {
  try {
    const existingJob = await prisma.job.findUnique({
      where: { id, isDeleted: false, companyId, isPublished: false },
    });

    if (!existingJob) {
      throw new ApiError("Job not found or you don't have access", 404);
    }

    await prisma.job.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return { message: `Job #${id} deleted successfully` };
  } catch (error) {
    throw error;
  }
};
