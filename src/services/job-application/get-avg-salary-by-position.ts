import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export type TimeRange =
  | "Last 7 days"
  | "Last 30 days"
  | "Last 3 months"
  | "Last 12 months"
  | "All Time";

export const getAvgSalaryByPositionService = async (timeRange: TimeRange) => {
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

    const salaryAverageByPosition = await prisma.$queryRaw<
      { position: string; avgSalary: number }[]
    >`
      SELECT
        j.category AS position,
        AVG(ja."expectedSalary") AS "avgSalary"
      FROM 
        job_applications ja
      LEFT JOIN 
        jobs j ON ja."jobId" = j.id
      WHERE 
        j."isDeleted" = FALSE
        ${
          startDate
            ? Prisma.sql`AND ja."createdAt" >= ${startDate}`
            : Prisma.empty
        }
      GROUP BY 
        j.category
      ORDER BY 
        "avgSalary" DESC
      LIMIT 10
    `;

    const result = salaryAverageByPosition.map((item: any) => ({
      position: item.position || "Unknown",
      avgSalary: Number(item.avgSalary),
    }));

    return { data: result };
  } catch (error) {
    console.error("Error fetching average salary by position:", error);
    throw error;
  }
};
