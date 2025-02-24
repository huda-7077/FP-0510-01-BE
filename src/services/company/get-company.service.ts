import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const getCompanyService = async (id: number) => {
  try {
    const whereClause: Prisma.CompanyWhereUniqueInput = {
      id,
      isDeleted: false,
    };

    const company = await prisma.company.findUnique({
      where: whereClause,
      include: {
        companyLocations: {
          select: {
            address: true,
            latitude: true,
            longitude: true,
            regency: {
              select: {
                regency: true,
                province: { select: { province: true } },
              },
            },
          },
        },
        users: { select: { email: true, phoneNumber: true } },
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  } catch (error) {
    throw error;
  }
};
