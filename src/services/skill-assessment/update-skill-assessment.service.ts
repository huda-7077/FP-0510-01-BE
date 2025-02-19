import { cloudinaryRemove, cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { generateSkillAssessmentUniqueSlug } from "../../utils/slug";

interface UpdateSkillAssessmentBody {
  slug: string;
  title: string;
  description: string;
  passingScore: number;
  generateSlug?: string;
}

export const updateSkillAssessmentService = async (
  body: UpdateSkillAssessmentBody,
  badgeImage: Express.Multer.File | undefined
) => {
  try {
    const { slug, title, passingScore, generateSlug, description } = body;

    const existingSkillAssessment = await prisma.skillAssessment.findFirst({
      where: { slug },
    });

    if (!existingSkillAssessment) {
      throw new ApiError("Skill assessment not found", 404);
    }

    let newSlug = slug;

    if (title && title !== existingSkillAssessment.title) {
      const existingTitle = await prisma.skillAssessment.findFirst({
        where: { title },
      });
      if (title === existingTitle?.title) {
        throw new ApiError(
          `Skill assessment with title ${title} already exists`,
          409
        );
      }
    }
    if (generateSlug && generateSlug === "true") {
      newSlug = await generateSkillAssessmentUniqueSlug(title);
    }

    let secure_url: string | undefined;
    if (badgeImage) {
      if (existingSkillAssessment.badgeImage !== null) {
        await cloudinaryRemove(existingSkillAssessment.badgeImage);
      }

      const uploadResult = await cloudinaryUpload(badgeImage);
      secure_url = uploadResult.secure_url;
    }

    const skillAssessment = await prisma.skillAssessment.update({
      where: { id: existingSkillAssessment.id },
      data: secure_url
        ? {
            description,
            title,
            slug: newSlug,
            passingScore: Number(passingScore),
            badgeImage: secure_url,
          }
        : {
            description,
            title,
            slug: newSlug,
            passingScore: Number(passingScore),
          },
    });

    return {
      skillAssessment,
      messages: "Skill assessment updated successfully",
    };
  } catch (error) {
    throw error;
  }
};
