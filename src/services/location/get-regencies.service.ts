import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";

export const getRegenciesService = async (
  provinceId?: number,
  search?: string
) => {
  try {
    const cachedRegencyData = await redisClient.get("regencyData");

    if (cachedRegencyData) {
      return JSON.parse(cachedRegencyData);
    }

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

    await redisClient.setEx("regencyData", 3600, JSON.stringify(regencies));

    return regencies;
  } catch (error) {
    throw error;
  }
};
