import { Assessment } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface UpdateAssessmentBody {
  title?: string;
  description?: string;
  passingScore?: number;
  status?: Assessment["status"];
}

export const updateAssessmentService = async (
  body: UpdateAssessmentBody,
  id: number
) => {
  try {
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!existingAssessment) {
      throw new Error("Assessment not found");
    }

    return await prisma.assessment.update({
      where: { id },
      data: {
        ...body,
      },
    });
  } catch (error) {
    throw error;
  }
};
