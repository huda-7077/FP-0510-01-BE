import { Job } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { cloudinaryUpload } from "../../lib/cloudinary";

export const updateJobService = async (
  id: number,
  body: Omit<Job, "id" | "createdAt" | "updatedAt" | "tags">,
  tags: string,
  bannerImageFile?: Express.Multer.File
) => {
  try {
    const { companyId, companyLocationId, applicationDeadline } = body;

    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      throw new ApiError(`Job with id ${id} not found`, 404);
    }

    let bannerImageUrl: string | undefined;
    if (bannerImageFile) {
      try {
        const { secure_url } = await cloudinaryUpload(bannerImageFile);
        bannerImageUrl = secure_url;
      } catch (uploadError) {
        throw new ApiError(
          "Failed to upload banner image. Please try again later.",
          400
        );
      }
    }

    let parsedTags: string[] = [];
    if (tags.trim()) {
      parsedTags = tags.split(",").map((tag) => tag.trim());
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        ...body,
        tags: parsedTags,
        bannerImage: bannerImageUrl,
        salary: body.salary ? Number(body.salary) : null,
        companyId: Number(companyId),
        companyLocationId: Number(companyLocationId),
        applicationDeadline: new Date(applicationDeadline),
        isPublished:
          typeof body.isPublished === "string"
            ? body.isPublished === "true"
            : Boolean(body.isPublished),
        isDeleted: Boolean(body.isDeleted),
        requiresAssessment:
          typeof body.requiresAssessment === "string"
            ? body.requiresAssessment === "true"
            : Boolean(body.requiresAssessment),
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
