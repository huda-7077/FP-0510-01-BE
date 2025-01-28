import { prisma } from "../../lib/prisma";

export const getCompanyLocationService = async (id: number) => {
  try {
    const companyLocation = await prisma.companyLocation.findUnique({
      where: { id },
    });

    if (!companyLocation) {
      throw new Error("Company location not found");
    }

    return companyLocation;
  } catch (error) {
    throw error;
  }
};
