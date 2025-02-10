import { prisma } from "../../lib/prisma";

export const deleteWorkExperienceService = async (
  userId: number,
  experienceIds: number[]
) => {
  try {
    const workExperiences = await prisma.workExperience.findMany({
      where: {
        id: { in: experienceIds },
        userId,
      },
    });

    if (workExperiences.length !== experienceIds.length) {
      throw new Error("One or more work experiences not found or unauthorized");
    }

    await prisma.workExperience.deleteMany({
      where: {
        id: { in: experienceIds },
        userId,
      },
    });

    return {
      message: `Successfully deleted ${experienceIds.length} work experience(s)`,
      deletedCount: experienceIds.length,
    };
  } catch (error) {
    throw error;
  }
};
