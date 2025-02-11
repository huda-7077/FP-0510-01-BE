import { CompanyLocation } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const createCompanyLocationService = async (
  userId: number,
  body: CompanyLocation
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

    const location = await prisma.companyLocation.create({
      data: {
        ...body,
        companyId: user.company.id,
      },
    });

    return location;
  } catch (error) {
    throw error;
  }
};
