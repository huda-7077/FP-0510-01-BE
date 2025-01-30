import { prisma } from "../../lib/prisma";

interface DeleteQuestionOptionParams {
  id: number;
}

export const deleteQuestionOptionService = async ({
  id,
}: DeleteQuestionOptionParams) => {
  try {
    const existingOption = await prisma.assessmentOption.findUnique({
      where: { id },
    });

    if (!existingOption) {
      throw new Error(`Question option with ID ${id} not found`);
    }

    await prisma.assessmentOption.delete({
      where: { id },
    });

    return { message: `Question option #${id} deleted successfully` };
  } catch (error) {
    throw error;
  }
};
