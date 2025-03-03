import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/apiError";
import { generateAssessmentUniqueSlug } from "../../utils/slug";

interface UpdatePreTestAssessmentBody {
  slug: string;
  title: string;
  description: string;
  passingScore: number;
  generateSlug?: string;
}

export const updateAssessmentService = async (
  body: UpdatePreTestAssessmentBody,
  companyId: number
) => {
  const { slug, title, passingScore, generateSlug, description } = body;

  try {
    const existingAssessment = await prisma.preTestAssessment.findUnique({
      where: { slug, job: { companyId } },
    });

    if (!existingAssessment) {
      throw new Error("Assessment not found");
    }

    let newSlug = slug;

    if (title && title !== existingAssessment.title) {
      const existingTitle = await prisma.preTestAssessment.findFirst({
        where: { title },
      });

      if (title === existingTitle?.title) {
        throw new ApiError(
          `Pre test assessment with title ${title} already exists`,
          409
        );
      }
    }

    if (generateSlug) {
      newSlug = await generateAssessmentUniqueSlug(title);
    }

    return await prisma.preTestAssessment.update({
      where: { slug, status: "DRAFT" },
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
