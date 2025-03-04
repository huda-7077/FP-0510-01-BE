import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";

export const getRegenciesService = async (
  provinceId?: number,
  search?: string
) => {
  try {
    const cachedRegencyData = await redisClient.get("regencyData");

    let regencies;

    if (cachedRegencyData) {
      regencies = JSON.parse(cachedRegencyData);

      if (provinceId || search) {
        regencies = regencies.filter((regency: any) => {
          const matchesProvince = provinceId
            ? regency.provinceId === provinceId
            : true;
          const matchesSearch = search
            ? regency.regency.toLowerCase().includes(search.toLowerCase())
            : true;
          return matchesProvince && matchesSearch;
        });
      }

      regencies.sort((a: any, b: any) => a.regency.localeCompare(b.regency));

      return regencies;
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

    regencies = await prisma.regency.findMany({
      where: whereClause,
      orderBy: {
        regency: "asc",
      },
      include: {
        province: true,
      },
    });

    await redisClient.setEx(
      "regencyData",
      24 * 3600,
      JSON.stringify(regencies)
    );

    return regencies;
  } catch (error) {
    throw error;
  }
};
