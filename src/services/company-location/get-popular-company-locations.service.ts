import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";

export type TimeRange =
  | "Last 7 days"
  | "Last 3 months"
  | "Last 12 months"
  | "Last 3 years"
  | "Last 5 years";

export const getPopularCompanyLocationsService = async (
  timeRange: TimeRange
) => {
  const redisKey = `popularProvincesData:${timeRange}`;

  try {
    const cachedPopularProvincesData = await redisClient.get(redisKey);

    if (cachedPopularProvincesData) {
      return JSON.parse(cachedPopularProvincesData);
    }

    let startDate: Date | undefined;
    const now = new Date();

    switch (timeRange) {
      case "Last 7 days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "Last 3 months":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "Last 12 months":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "Last 3 years":
        startDate = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000);
        break;
      case "Last 5 years":
        startDate = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        throw new Error("Invalid time range specified.");
    }

    const popularCompanyLocations = await prisma.$queryRaw<
      { province: string; applicants: number }[]
    >(Prisma.sql`
      SELECT 
        p.province AS province,
        COUNT(ja) AS applicants
      FROM 
        job_applications ja
      LEFT JOIN
        jobs j ON ja."jobId" = j.id
      LEFT JOIN
        company_locations cl ON j."companyLocationId" = cl.id
      LEFT JOIN 
        regencies r ON cl."regencyId" = r.id
      LEFT JOIN 
        provinces p ON r."provinceId" = p.id
      WHERE 
        j."isDeleted" = false AND
        p.province IS NOT NULL
        ${
          startDate
            ? Prisma.sql`AND ja."createdAt" >= ${startDate}`
            : Prisma.empty
        }
      GROUP BY 
        p.province
      ORDER BY 
        "applicants" DESC
      LIMIT 10
    `);

    const result = popularCompanyLocations.map((item: any) => ({
      province: item.province || "Unknown",
      applicants: Number(item.applicants),
    }));

    await redisClient.setEx(redisKey, 3600, JSON.stringify({ data: result }));

    return { data: result };
  } catch (error) {
    console.error(
      "Error fetching popular company locations (province):",
      error
    );
    throw error;
  }
};
