import { Job } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";

export const updateJobStatusService = async (
  id: number,
  body: Pick<Job, "isPublished">
) => {
  try {
    const existingJob = await prisma.job.findUnique({
      where: { id, isDeleted: false },
    });

    if (!existingJob) {
      throw new ApiError(`Job with id ${id} not found`, 404);
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
    //! Log the error for debugging purposes - delete on production
    console.error("Error in updateJobService:", error);

    let errorMessage = "An unexpected error occurred while creating the job.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
