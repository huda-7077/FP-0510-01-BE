import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export const getProvincesService = async (
  regencyId?: number,
  search?: string
) => {
  try {
    const whereClause: Prisma.ProvinceWhereInput = {};

    if (regencyId) {
      whereClause.regencies = {
        some: {
          id: regencyId,
        },
      };
    }

    if (search) {
      whereClause.province = {
        contains: search,
        mode: "insensitive",
      };
    }

    const provinces = await prisma.province.findMany({
      where: whereClause,
      orderBy: {
        province: "asc",
      },
    });

    return provinces;
  } catch (error) {
    throw error;
  }
};
