import { prisma } from "../../lib/prisma";

export const getProfileService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        company: {
          include: {
            companyLocations: {
              include: { regency: { include: { province: true } } },
            },
          },
        },
        jobApplications: true,
        regency: { include: { province: true } },
        certificates: true,
        userAssessments: true,
        savedJobs: true,
        experience: true,
      },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    const { password: pass, ...userWithoutPassword } = user;

    return { ...userWithoutPassword };
  } catch (error) {
    throw error;
  }
};
