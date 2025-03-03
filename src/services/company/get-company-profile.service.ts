import { prisma } from "../../lib/prisma";

export const getCompanyProfileService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
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

    const { company, phoneNumber, email } = user;

    return {
      ...company,
      phoneNumber,
      email,
    };
  } catch (error) {
    throw error;
  }
};
