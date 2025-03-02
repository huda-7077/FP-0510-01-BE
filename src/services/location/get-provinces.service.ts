import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";

export const getProvincesService = async (
  regencyId?: number,
  search?: string
) => {
  try {
    const cachedProvinceData = await redisClient.get("provinceData");

    if (cachedProvinceData) {
      return JSON.parse(cachedProvinceData);
    }

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

    await redisClient.setEx(
      "provinceData",
      24 * 3600,
      JSON.stringify(provinces)
    );

    return provinces;
  } catch (error) {
    throw error;
  }
};
