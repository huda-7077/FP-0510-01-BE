import { prisma } from "../../lib/prisma";

export const deleteJobService = async (id: number) => {
  try {
    const existingJob = await prisma.job.findUnique({
      where: { id, isDeleted: false },
    });

    if (!existingJob) {
      throw new Error("Job not found");
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
