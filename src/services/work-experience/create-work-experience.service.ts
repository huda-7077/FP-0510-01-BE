import { WorkExperience } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const createWorkExperienceService = async (
  userId: number,
  body: Omit<WorkExperience, "id" | "userId">
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const workExperience = await prisma.workExperience.create({
      data: {
        userId,
        ...body,
      },
    });

    return { message: "Work experience created", data: workExperience };
  } catch (error) {
    throw error;
  }
};
