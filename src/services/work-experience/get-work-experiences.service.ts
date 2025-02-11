import { prisma } from "../../lib/prisma";

export const getWorkExperiencesService = async (userId: number) => {
  try {
    const workExperiences = await prisma.workExperience.findMany({
      where: { userId },
      orderBy: { startDate: "desc" },
    });

    return { data: workExperiences };
  } catch (error) {
    throw error;
  }
};
