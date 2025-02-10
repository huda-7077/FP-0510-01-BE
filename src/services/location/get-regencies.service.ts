import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const getRegenciesService = async (
  provinceId?: number,
  search?: string
) => {
  try {
    const whereClause: Prisma.RegencyWhereInput = {};

    if (provinceId) {
      whereClause.provinceId = provinceId;
    }

    if (search) {
      whereClause.regency = {
        contains: search,
        mode: "insensitive",
      };
    }

    const regencies = await prisma.regency.findMany({
      where: whereClause,
      orderBy: {
        regency: "asc",
      },
      include: {
        province: true,
      },
    });

    return regencies;
  } catch (error) {
    throw error;
  }
};
