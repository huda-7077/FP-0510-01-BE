import { prisma } from "../../lib/prisma";

export const deleteCompanyLocationService = async (
  locationId: number,
  userId: number
) => {
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

    await prisma.companyLocation.delete({
      where: {
        id: locationId,
        companyId: user.company.id,
      },
    });

    return { message: "company location deleted" };
  } catch (error) {
    throw error;
  }
};
