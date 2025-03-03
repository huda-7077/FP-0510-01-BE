import { Job } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const updateJobStatusService = async (
  id: number,
  companyId: number,
  body: Pick<Job, "isPublished">
) => {
  try {
    const existingJob = await prisma.job.findUnique({
      where: { id, isDeleted: false, companyId },
    });

    if (!existingJob) {
      throw new ApiError(`Job not found or you don't have access`, 404);
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        isPublished:
          typeof body.isPublished === "string"
            ? body.isPublished === "true"
            : Boolean(body.isPublished),
      },
    });

    return updatedJob;
  } catch (error) {
    throw error;
  }
};
