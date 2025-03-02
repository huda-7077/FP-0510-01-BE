import { Job } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { cloudinaryUpload } from "../../lib/cloudinary";
import { generateJobUniqueSlug } from "../../utils/slug";

export const updateJobService = async (
  id: number,
  body: Omit<Job, "id" | "createdAt" | "updatedAt" | "tags" | "companyId">,
  tags: string,
  companyId: number,
  generateSlug: string,
  bannerImageFile?: Express.Multer.File
) => {
  try {
    const { title, slug, companyLocationId, applicationDeadline } = body;

    const existingJob = await prisma.job.findUnique({
      where: { id, isDeleted: false, companyId },
    });

    if (!existingJob) {
      throw new ApiError(`Job with not found or you don't have access`, 404);
    }

    let newSlug = slug;

    if (title && title !== existingJob.title) {
      const existingTitle = await prisma.job.findFirst({
        where: { title },
      });
      if (title === existingTitle?.title) {
        throw new ApiError(`Job with title: ${title} already exists`, 409);
      }
    }

    if (generateSlug && generateSlug === "true") {
      newSlug = await generateJobUniqueSlug(title);
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
        title: body.title,
        slug: newSlug,
        description: body.description,
        category: body.category,
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
