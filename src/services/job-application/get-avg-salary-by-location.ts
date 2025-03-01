import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { TimeRange } from "./get-avg-salary-by-position";

export const getAvgSalaryByProvinceService = async (timeRange: TimeRange) => {
  try {
    let startDate: Date | undefined;
    const now = new Date();

    switch (timeRange) {
      case "Last 7 days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "Last 30 days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "Last 3 months":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "Last 12 months":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "All Time":
        startDate = undefined;
        break;
      default:
        throw new Error("Invalid time range specified.");
    }

    const salaryAverageByProvince = await prisma.$queryRaw<
      { province: string; avgSalary: number }[]
    >`
      SELECT 
        p.province AS province,
        AVG(ja."expectedSalary") AS "avgSalary"
      FROM 
        job_applications ja
      LEFT JOIN
        users u ON "userId" = u.id
      LEFT JOIN 
        regencies r ON "regencyId" = r.id
      LEFT JOIN 
        provinces p ON "provinceId" = p.id
      WHERE 
        u."isDeleted" = false AND
        u.role = 'USER' AND
        p.province IS NOT NULL
        ${
          startDate
            ? Prisma.sql`AND ja."createdAt" >= ${startDate}`
            : Prisma.empty
        }
      GROUP BY 
        p.province
      ORDER BY 
        "avgSalary" DESC
      LIMIT 10
    `;

    const result = salaryAverageByProvince.map((item: any) => ({
      province: item.province || "Unknown",
      avgSalary: Number(item.avgSalary),
    }));

    return { data: result };
  } catch (error) {
    console.error("Error fetching average salary by position:", error);
    throw error;
  }
};
