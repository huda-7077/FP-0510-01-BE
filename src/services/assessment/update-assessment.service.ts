import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { generateSkillAssessmentUniqueSlug } from "../../utils/slug";

interface UpdatePreTestAssessmentBody {
  slug: string;
  title: string;
  description: string;
  passingScore: number;
  generateSlug?: string;
}

export const updateAssessmentService = async (
  body: UpdatePreTestAssessmentBody
) => {
  const { slug, title, passingScore, generateSlug, description } = body;

  try {
    const existingAssessment = await prisma.preTestAssessment.findUnique({
      where: { slug },
    });

    if (!existingAssessment) {
      throw new Error("Assessment not found");
    }

    let newSlug = slug;

    if (title && title !== existingAssessment.title) {
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

    return await prisma.preTestAssessment.update({
      where: { slug },
      data: {
        description,
        title,
        slug: newSlug,
        passingScore: Number(passingScore),
      },
    });
  } catch (error) {
    console.error(`Error in updateAssessment for slug ${slug}:`, error);
    throw error;
  }
};
