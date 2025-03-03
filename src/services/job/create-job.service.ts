import { Job } from "@prisma/client";
import { cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { generateJobUniqueSlug } from "../../utils/slug";
import { ApiError } from "../../utils/apiError";

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
      throw new ApiError(
        "Missing required fields: title, companyId, companyLocationId, or applicationDeadline.",
        400
      );
    }

    const existingJob = await prisma.job.findFirst({
      where: { title, companyId, isDeleted: false },
    });

    if (existingJob) {
      throw new ApiError(
        "A job with this title already exists for the company.",
        400
      );
    }

    const slug = await generateJobUniqueSlug(title);

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
    throw error;
  }
};
