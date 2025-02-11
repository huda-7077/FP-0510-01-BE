import { Job } from "@prisma/client";
import { cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

export const createJobService = async (
  body: Omit<Job, "id" | "createdAt" | "updatedAt" | "tags">,
  tags: string,
  bannerImageFile?: Express.Multer.File
) => {
  try {
    const { title, companyId, companyLocationId, applicationDeadline } = body;

    const existingJob = await prisma.job.findFirst({
      where: { title, companyId: Number(companyId) },
    });
    if (existingJob) {
      throw new Error("Job with this title already exists for the company.");
    }

    let bannerImageUrl: string | undefined;
    if (bannerImageFile) {
      const { secure_url } = await cloudinaryUpload(bannerImageFile);
      bannerImageUrl = secure_url;
    }

    const createdJob = await prisma.job.create({
      data: {
        ...body,
        tags: tags.split(","),
        bannerImage: bannerImageUrl,
        salary: body.salary ? Number(body.salary) : null,
        companyId: Number(companyId),
        companyLocationId: Number(companyLocationId),
        applicationDeadline: new Date(applicationDeadline),
        isPublished:
          typeof body.isPublished === "string"
            ? body.isPublished === "true"
            : body.isPublished ?? false,
        isDeleted: Boolean(body.isDeleted) || false,
        requiresAssessment:
          typeof body.requiresAssessment === "string"
            ? body.requiresAssessment === "true"
            : body.requiresAssessment ?? false,
      },
    });

    return createdJob;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unexpected error"
    );
  }
};
