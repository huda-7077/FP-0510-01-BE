import { SkillAssessmentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { generateSkillAssessmentUniqueSlug } from "../../utils/slug";
import { cloudinaryUpload } from "../../lib/cloudinary";

interface CreateSkillAssessmentBody {
  title: string;
  description: string;
  passingScore: number;
}

export const createSkillAssessmentService = async (
  body: CreateSkillAssessmentBody,
  badgeImage: Express.Multer.File
) => {
  try {
    const { title, description, passingScore } = body;

    const existingSkillAssessment = await prisma.skillAssessment.findFirst({
      where: { title },
    });

    if (existingSkillAssessment) {
      throw new ApiError(
        `Skill assessment with title ${title} already exists`,
        409
      );
    }

    const slug = await generateSkillAssessmentUniqueSlug(title);

    const { secure_url } = await cloudinaryUpload(badgeImage);

    const skillAssessment = await prisma.skillAssessment.create({
      data: {
        title,
        slug,
        description,
        passingScore: Number(passingScore),
        badgeImage: secure_url,
        status: SkillAssessmentStatus.DRAFT,
      },
    });

    return {
      skillAssessment,
      messages: "Skill assessment created successfully",
    };
  } catch (error) {
    throw error;
  }
};
