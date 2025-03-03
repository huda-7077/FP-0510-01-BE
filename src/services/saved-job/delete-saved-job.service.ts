import { prisma } from "../../lib/prisma";

export const deleteSavedJobService = async (
  userId: number,
  jobId: number
): Promise<{ message: string }> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const savedJob = await prisma.savedJob.findFirst({
      where: {
        userId,
        jobId,
      },
    });

    if (!savedJob) {
      throw new Error("Bookmark not found.");
    }

    await prisma.savedJob.delete({
      where: {
        id: savedJob.id,
      },
    });

    return { message: "Job bookmark removed successfully." };
  } catch (error) {
    throw error;
  }
};
