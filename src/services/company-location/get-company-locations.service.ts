import { prisma } from "../../lib/prisma";

export const getCompanyLocationsService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isDeleted: false,
      },
      include: {
        company: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    if (!user || !user.company) {
      throw new Error("Company not found");
    }

    const locations = await prisma.companyLocation.findMany({
      where: {
        companyId: user.company.id,
      },
      include: {
        regency: {
          include: {
            province: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return locations;
  } catch (error) {
    throw error;
  }
};
