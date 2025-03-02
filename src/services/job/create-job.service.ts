import { Job } from "@prisma/client";
import { cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { generateJobUniqueSlug } from "../../utils/slug";

export const createJobService = async (
  body: Omit<
    Job,
    "id" | "createdAt" | "updatedAt" | "tags" | "companyId" | "slug"
  >,
  tags: string,
  companyId: number,
  bannerImageFile?: Express.Multer.File
) => {
  try {
    const { title, companyLocationId, applicationDeadline } = body;

    if (!title || !companyLocationId || !applicationDeadline) {
      throw new Error(
        "Missing required fields: title, companyId, companyLocationId, or applicationDeadline."
      );
    }

    const existingJob = await prisma.job.findFirst({
      where: { title, companyId, isDeleted: false },
    });

    if (existingJob) {
      throw new Error("A job with this title already exists for the company.");
    }

    const slug = await generateJobUniqueSlug(title);

    let bannerImageUrl: string | undefined;
    if (bannerImageFile) {
      try {
        const { secure_url } = await cloudinaryUpload(bannerImageFile);
        bannerImageUrl = secure_url;
      } catch (uploadError) {
        throw new Error(
          "Failed to upload banner image. Please try again later."
        );
      }
    }

    let parsedTags: string[] = [];
    if (tags.trim()) {
      parsedTags = tags.split(",").map((tag) => tag.trim().toLocaleLowerCase());
    }

    const createdJob = await prisma.job.create({
      data: {
        ...body,
        slug,
        tags: parsedTags,
        bannerImage: bannerImageUrl,
        salary: body.salary ? Number(body.salary) : null,
        companyId,
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

    return createdJob;
  } catch (error) {
    //! Log the error for debugging purposes - delete on production
    console.error("Error in createJobService:", error);

    let errorMessage = "An unexpected error occurred while creating the job.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};
