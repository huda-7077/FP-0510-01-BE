import { SavedJob } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const createSavedJobService = async (
  userId: number,
  jobId: number
): Promise<SavedJob> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.role !== "USER") {
      throw new Error("Only users can bookmark jobs.");
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
        isDeleted: false,
      },
    });

    if (!job) {
      throw new Error("Job not found or has been deleted.");
    }

    const existingBookmark = await prisma.savedJob.findFirst({
      where: {
        userId,
        jobId,
      },
    });

    if (existingBookmark) {
      throw new Error("Job is already bookmarked.");
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
      },
    });

    return savedJob;
  } catch (error) {
    throw error;
  }
};
